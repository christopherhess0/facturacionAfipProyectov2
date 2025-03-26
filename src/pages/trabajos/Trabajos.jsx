import SyncIcon from '@mui/icons-material/Sync';
import {
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import EdificioAutocomplete from '../../components/EdificioAutocomplete';
import LoadingSpinner from '../../components/LoadingSpinner';
import TipoDestapacionAutocomplete from '../../components/TipoDestapacionAutocomplete';
import axios from '../../config/axios';
import { fetchEdificios } from '../../features/edificios/edificiosSlice';
import { cargarTrabajos } from '../../features/trabajos/trabajosSlice';
import AgregarTrabajo from './components/AgregarTrabajo';
import {
    ActionButton,
    ActionButtons,
    AutocompleteContainer,
    Button,
    Container,
    FilterLabel,
    FilterSection,
    Form,
    Input,
    Select,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Title
} from './styles/Trabajos.styles';

const StyledTableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  background-color: #f3f4f6;
  font-weight: 600;
  
  &.sortable {
    cursor: pointer;
    
    &:hover {
      background-color: #e5e7eb;
    }
    
    .sort-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;

const Trabajos = () => {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [filtroEdificio, setFiltroEdificio] = useState(null);
  const [formData, setFormData] = useState({
    edificio: '',
    cuit: '',
    tipoDestapacion: '',
    piso: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    importe: '',
    administrador: '',
    seFactura: false,
    facturaHecha: false,
    pagado: false,
    nombreContacto: ''
  });
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const observerTarget = useRef(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [edificios, setEdificios] = useState([]);

  const trabajosRedux = useSelector(state => state.trabajos?.trabajos || []);

  useEffect(() => {
    dispatch(cargarTrabajos());
    dispatch(fetchEdificios());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingId) {
        await axios.put(`/api/trabajos/${editingId}`, formData);
      } else {
        await axios.post('/api/trabajos', formData);
      }
      setFormData({
        edificio: '',
        cuit: '',
        tipoDestapacion: '',
        piso: '',
        fecha: format(new Date(), 'yyyy-MM-dd'),
        importe: '',
        administrador: '',
        seFactura: false,
        facturaHecha: false,
        pagado: false,
        nombreContacto: ''
      });
      setEdificioSeleccionado(null);
      setEditingId(null);
      await fetchTrabajos();
    } catch (err) {
      console.error('Error:', err);
      setError('Error al guardar el trabajo');
    }
  };

  const handleEdit = (trabajo) => {
    setEditingId(trabajo._id);
    const edificioEncontrado = edificios.find(e => e.nombreEdificio === trabajo.edificio);
    setEdificioSeleccionado(edificioEncontrado);
    setFormData({
      ...trabajo,
      fecha: format(new Date(trabajo.fecha), 'yyyy-MM-dd')
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este trabajo?')) {
      try {
        await axios.delete(`/api/trabajos/${id}`);
        fetchTrabajos();
      } catch (err) {
        setError('Error al eliminar el trabajo');
        console.error('Error:', err);
      }
    }
  };

  const handleFacturadoChange = async (id, field) => {
    try {
      const trabajo = trabajos.find(t => t._id === id);
      await axios.put(`/api/trabajos/${id}`, {
        ...trabajo,
        [field]: !trabajo[field]
      });
      fetchTrabajos();
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error('Error:', err);
    }
  };

  const handleEdificioChange = (edificio) => {
    setEdificioSeleccionado(edificio);
    if (edificio) {
      setFormData(prev => ({
        ...prev,
        edificio: edificio.nombre,
        cuit: edificio.cuit || '',
        administrador: edificio.administrador || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        edificio: '',
        cuit: '',
        administrador: ''
      }));
    }
  };

  const trabajosFiltrados = useMemo(() => {
    return trabajosRedux.filter(trabajo => 
      !filtroEdificio || trabajo.edificio === filtroEdificio?.nombreEdificio
    );
  }, [trabajosRedux, filtroEdificio]);

  const handleSortByDate = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setPage(1);
    fetchTrabajos(1, newOrder);
  };

  const fetchTrabajos = async (pageNum = page, order = sortOrder, edificioFilter = filtroEdificio) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: pageNum,
        limit: 20,
        sort: order
      };
      
      if (edificioFilter?.direccion) {
        console.log('Aplicando filtro por edificio:', edificioFilter.direccion);
        params.edificio = edificioFilter.direccion;
      }

      console.log('Solicitando trabajos con params:', params);
      
      const response = await axios.get('/api/trabajos', { params });
      console.log('Respuesta del servidor:', response.data);
      
      if (pageNum === 1) {
        setTrabajos(response.data.trabajos);
      } else {
        setTrabajos(prev => [...prev, ...response.data.trabajos]);
      }
      
      setHasMore(response.data.pagination.hasMore);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los trabajos');
      setLoading(false);
    }
  };

  // Configurar el observer para el scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  // Cargar más trabajos cuando cambia la página
  useEffect(() => {
    if (page > 1) {
      fetchTrabajos(page, sortOrder);
    }
  }, [page, sortOrder]);

  // Cargar trabajos iniciales
  useEffect(() => {
    fetchTrabajos(1, sortOrder);
  }, [sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setTrabajos([]);
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError('');
      console.log('Iniciando sincronización...');
      
      const response = await axios.post('/api/trabajos/sync');
      console.log('Respuesta de sincronización:', response.data);
      
      await fetchTrabajos(1, sortOrder);
      setPage(1);
      
      console.log('Sincronización completada');
    } catch (err) {
      console.error('Error detallado en sincronización:', {
        mensaje: err.message,
        respuesta: err.response?.data,
        status: err.response?.status
      });
      setError(`Error al sincronizar: ${err.response?.data?.details || err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const cargarEdificios = async () => {
    try {
      const response = await axios.get('/api/edificios');
      if (response.data && Array.isArray(response.data)) {
        console.log('Edificios cargados:', response.data.length);
        setEdificios(response.data);
      }
    } catch (error) {
      console.error('Error al cargar edificios:', error);
      setError('Error al cargar la lista de edificios');
    }
  };

  useEffect(() => {
    cargarEdificios();
  }, []);

  useEffect(() => {
    console.log('Filtro cambiado, recargando trabajos con filtro:', filtroEdificio);
    fetchTrabajos(1, sortOrder, filtroEdificio);
  }, [filtroEdificio, sortOrder]);

  const handleTrabajoAgregado = (nuevoTrabajo) => {
    setTrabajos(prev => [nuevoTrabajo, ...prev]);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Title>Gestión de Trabajos de Destapación</Title>
        <Tooltip title="Sincronizar con Google Sheets">
          <IconButton onClick={handleSync} disabled={syncing}>
            <SyncIcon sx={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <FilterSection>
        <FilterLabel>Filtrar por Edificio:</FilterLabel>
        <AutocompleteContainer>
          <EdificioAutocomplete
            edificios={edificios}
            value={filtroEdificio}
            onChange={(edificio) => {
              console.log('Seleccionando edificio para filtrar:', edificio);
              setFiltroEdificio(edificio);
              setPage(1);
              fetchTrabajos(1, sortOrder, edificio ? { direccion: edificio.direccion } : null);
            }}
            placeholder="Buscar edificio..."
            style={{ width: '100%', minWidth: '300px' }}
            isFilter={true}
          />
        </AutocompleteContainer>
      </FilterSection>

      <h3>Agregar Nuevo Trabajo</h3>

      <Form onSubmit={handleSubmit}>
        <AutocompleteContainer>
          <EdificioAutocomplete
            edificios={edificios}
            value={edificioSeleccionado}
            onChange={handleEdificioChange}
            placeholder="Seleccione un edificio"
            isFilter={false}
          />
        </AutocompleteContainer>

        <Input
          type="text"
          name="cuit"
          value={formData.cuit}
          readOnly
          placeholder="CUIT"
        />

        <AutocompleteContainer>
          <TipoDestapacionAutocomplete
            value={formData.tipoDestapacion}
            onChange={(newValue) => setFormData(prev => ({ ...prev, tipoDestapacion: newValue }))}
          />
        </AutocompleteContainer>

        <Input
          type="text"
          name="piso"
          value={formData.piso}
          onChange={(e) => setFormData(prev => ({ ...prev, piso: e.target.value }))}
          placeholder="Piso"
          required
        />

        <Input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
          required
        />

        <Input
          type="number"
          name="importe"
          value={formData.importe}
          onChange={(e) => setFormData(prev => ({ ...prev, importe: e.target.value }))}
          placeholder="Importe"
          required
        />

        <Input
          type="text"
          name="administrador"
          value={formData.administrador}
          readOnly
          placeholder="Administrador"
        />

        <Button type="submit">
          {editingId ? 'Actualizar Trabajo' : 'Agregar Trabajo'}
        </Button>
      </Form>

      <Table>
        <thead>
          <TableRow>
            <TableHeader>Edificio</TableHeader>
            <TableHeader>CUIT</TableHeader>
            <TableHeader>Tipo de Destapación</TableHeader>
            <TableHeader>Piso</TableHeader>
            <TableHeader className="sortable" onClick={handleSortByDate}>
              <div className="sort-container">
                <span>Fecha</span>
                <span style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                  {sortOrder === 'desc' ? <FaSortDown size={16} color="white" /> : <FaSortUp size={16} color="white" />}
                </span>
              </div>
            </TableHeader>
            <TableHeader>Importe</TableHeader>
            <TableHeader>¿Se factura?</TableHeader>
            <TableHeader>Factura HECHA</TableHeader>
            <TableHeader>Administrador</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {trabajos.length > 0 ? (
            trabajos.map((trabajo) => (
              <TableRow key={trabajo._id}>
                <TableCell>{trabajo.edificio}</TableCell>
                <TableCell>{trabajo.cuit}</TableCell>
                <TableCell>{trabajo.tipoDestapacion}</TableCell>
                <TableCell>{trabajo.piso}</TableCell>
                <TableCell>{trabajo.fecha}</TableCell>
                <TableCell>${new Intl.NumberFormat('es-AR').format(trabajo.importe)}</TableCell>
                <TableCell>
                  <Select
                    value={trabajo.seFactura ? "SI" : "NO"}
                    onChange={() => handleFacturadoChange(trabajo._id, 'seFactura')}
                  >
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={trabajo.facturaHecha ? "SI" : "NO"}
                    onChange={() => handleFacturadoChange(trabajo._id, 'facturaHecha')}
                  >
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </Select>
                </TableCell>
                <TableCell>{trabajo.administrador}</TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionButton onClick={() => handleEdit(trabajo)}>
                      ✏️
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(trabajo._id)}>
                      🗑️
                    </ActionButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="10" style={{ textAlign: 'center' }}>
                {loading ? 'Cargando trabajos...' : 'No hay trabajos para mostrar'}
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>

      {/* Elemento observador para el scroll infinito */}
      <div ref={observerTarget} style={{ height: '20px', margin: '10px 0' }}>
        {loading && <LoadingSpinner />}
      </div>

      {error && (
        <div style={{ color: 'red', margin: '1rem 0' }}>
          {error}
        </div>
      )}

      <AgregarTrabajo onTrabajoAgregado={handleTrabajoAgregado} />
    </Container>
  );
};

export default Trabajos; 