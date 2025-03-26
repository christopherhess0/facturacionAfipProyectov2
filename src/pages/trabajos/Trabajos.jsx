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
  const [filtroFacturaHecha, setFiltroFacturaHecha] = useState('todos');
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
    console.log('Carga inicial de trabajos');
    fetchTrabajos(1, sortOrder);
    cargarEdificios();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (page > 1) {
      fetchTrabajos(page, sortOrder);
    }
  }, [page]);

  useEffect(() => {
    console.log('Filtro o orden cambiado:', { filtroEdificio, filtroFacturaHecha, sortOrder });
    setPage(1);
    fetchTrabajos(1, sortOrder, filtroEdificio, filtroFacturaHecha);
  }, [filtroEdificio, filtroFacturaHecha, sortOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoTrabajo = {
        edificio: formData.edificio?.direccion || '',
        cuit: formData.cuit || '',
        tipoDestapacion: formData.tipoDestapacion || '',
        piso: formData.piso || '',
        fecha: formData.fecha || '',
        importe: parseFloat(formData.importe) || 0,
        seFactura: true,
        facturaHecha: false,
        administrador: formData.administrador || '',
      };

      console.log('Enviando nuevo trabajo:', nuevoTrabajo);
      
      const response = await axios.post('/api/trabajos', nuevoTrabajo);
      console.log('Trabajo creado:', response.data);
      
      // Limpiar el formulario
      setFormData({
        edificio: '',
        cuit: '',
        tipoDestapacion: '',
        piso: '',
        fecha: '',
        importe: '',
        administrador: ''
      });
      
      // Recargar la lista de trabajos
      fetchTrabajos(1);
      
    } catch (error) {
      console.error('Error al crear trabajo:', error);
      setError('Error al crear el trabajo');
    }
  };

  const handleEdit = (trabajo) => {
    setEditingId(trabajo._id);
    const edificioEncontrado = edificios.find(e => e.nombreEdificio === trabajo.edificio);
    setEdificioSeleccionado(edificioEncontrado);
    
    // Asegurarse de que la fecha sea válida antes de formatearla
    let fechaFormateada;
    try {
      const fecha = new Date(trabajo.fecha);
      if (isNaN(fecha.getTime())) {
        // Si la fecha es inválida, usar la fecha actual
        fechaFormateada = format(new Date(), 'yyyy-MM-dd');
      } else {
        fechaFormateada = format(fecha, 'yyyy-MM-dd');
      }
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      fechaFormateada = format(new Date(), 'yyyy-MM-dd');
    }

    setFormData({
      ...trabajo,
      fecha: fechaFormateada
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
      if (!trabajo) {
        console.error('Trabajo no encontrado:', id);
        return;
      }

      console.log('Actualizando trabajo:', {
        id,
        field,
        valorActual: trabajo[field],
        nuevoValor: !trabajo[field]
      });

      // Solo enviar el campo que se está actualizando
      const datosActualizados = {
        [field]: !trabajo[field]
      };
      
      await axios.patch(`/api/trabajos/${id}`, datosActualizados);
      console.log('Trabajo actualizado exitosamente');
      
      // Recargar los trabajos
      await fetchTrabajos(1, sortOrder, filtroEdificio, filtroFacturaHecha);
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      setError('Error al actualizar el estado');
    }
  };

  const handleEdificioChange = (edificio) => {
    console.log('Edificio seleccionado:', edificio);
    setEdificioSeleccionado(edificio);
    setFormData(prev => ({
      ...prev,
      edificio: edificio,
      cuit: edificio?.cuit || '',
      administrador: edificio?.administrador || ''
    }));
  };

  const handleTipoDestapacionChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      tipoDestapacion: newValue
    }));
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

  const fetchTrabajos = async (pageNum = page, order = sortOrder, edificioFilter = filtroEdificio, facturaHechaFilter = filtroFacturaHecha) => {
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

      if (facturaHechaFilter !== 'todos') {
        console.log('Aplicando filtro por factura hecha:', facturaHechaFilter);
        params.facturaHecha = facturaHechaFilter === 'si';
      }

      console.log('Solicitando trabajos con params:', params);
      
      const response = await axios.get('/api/trabajos', { params });
      console.log('Respuesta del servidor:', response.data);
      
      const trabajosConFechasFormateadas = response.data.trabajos.map(trabajo => ({
        ...trabajo,
        fecha: trabajo.fecha.includes('/') ? trabajo.fecha : format(new Date(trabajo.fecha), 'dd/MM/yy')
      }));
      
      if (pageNum === 1) {
        setTrabajos(trabajosConFechasFormateadas);
      } else {
        setTrabajos(prev => [...prev, ...trabajosConFechasFormateadas]);
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
            onChange={handleTipoDestapacionChange}
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

      <h3>Lista de Trabajos</h3>

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
              fetchTrabajos(1, sortOrder, edificio ? { direccion: edificio.direccion } : null, filtroFacturaHecha);
            }}
            placeholder="Buscar edificio..."
            style={{ width: '100%', minWidth: '300px' }}
            isFilter={true}
          />
        </AutocompleteContainer>

        <FilterLabel>Filtrar por Factura HECHA:</FilterLabel>
        <Select
          value={filtroFacturaHecha}
          onChange={(e) => {
            setFiltroFacturaHecha(e.target.value);
            setPage(1);
            fetchTrabajos(1, sortOrder, filtroEdificio, e.target.value);
          }}
          style={{ minWidth: '120px', marginLeft: '10px' }}
        >
          <option value="todos">Todos</option>
          <option value="si">SI</option>
          <option value="no">NO</option>
        </Select>
      </FilterSection>

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
            trabajos.map((trabajo, index) => (
              <TableRow key={`${trabajo._id}-${index}`}>
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
    </Container>
  );
};

export default Trabajos; 