import { Settings as SettingsIcon } from '@mui/icons-material';
import SyncIcon from '@mui/icons-material/Sync';
import {
    Fab,
    IconButton,
    MenuItem,
    TextField,
    Tooltip
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import EdificioAutocomplete from '../../components/EdificioAutocomplete';
import LoadingSpinner from '../../components/LoadingSpinner';
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
    FormSection,
    SectionTitle,
    Select,
    SyncButton,
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

const ConfigButton = styled(Fab)`
  && {
    position: absolute;
    left: -100px;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
    background-color: #2196f3 !important;
    border-radius: 16px;
    z-index: 9999;

    &:hover {
      background-color: #1976d2 !important;
    }

    svg {
      width: 40px;
      height: 40px;
      fill: white;
    }
  }
`;

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    background-color: rgba(33, 150, 243, 0.95);
    color: white;
    padding: 12px 16px;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 300px;
    text-align: center;
    margin: 8px;
    transition: all 0.2s ease;
  }

  & .MuiTooltip-arrow {
    color: rgba(33, 150, 243, 0.95);
  }
`;

const Trabajos = () => {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [filtroEdificio, setFiltroEdificio] = useState(null);
  const [filtroFacturaHecha, setFiltroFacturaHecha] = useState('todos');
  const [configOpen, setConfigOpen] = useState(false);
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
      <Title>Gestión de Trabajos de Destapación</Title>
      
      <FormSection>
        <StyledTooltip 
          title="Presione este botón para entrar a la pestaña de configuración de facturación"
          placement="right"
          arrow
          enterDelay={200}
          leaveDelay={200}
        >
          <ConfigButton onClick={() => setConfigOpen(true)}>
            <SettingsIcon />
          </ConfigButton>
        </StyledTooltip>

        <SectionTitle>Agregar Nuevo Trabajo</SectionTitle>

        <Form onSubmit={handleSubmit}>
          <TextField
            select
            label="Edificio"
            value={edificioSeleccionado?.nombreEdificio}
            onChange={(e) => {
              const selectedEdificio = edificios.find(edificio => edificio.nombreEdificio === e.target.value);
              if (selectedEdificio) {
                handleEdificioChange(selectedEdificio);
              }
            }}
            variant="outlined"
          >
            {edificios.map((option) => (
              <MenuItem key={option.nombreEdificio} value={option.nombreEdificio}>
                {option.nombreEdificio}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="CUIT"
            value={formData.cuit}
            onChange={(e) => setFormData(prev => ({ ...prev, cuit: e.target.value }))}
            variant="outlined"
          />

          <TextField
            select
            label="Tipo de Trabajo"
            value={formData.tipoDestapacion}
            onChange={(e) => setFormData(prev => ({ ...prev, tipoDestapacion: e.target.value }))}
            variant="outlined"
          >
            <MenuItem value="">Seleccione un tipo de trabajo</MenuItem>
            <MenuItem value="Destapación">Destapación</MenuItem>
            <MenuItem value="Reparación">Reparación</MenuItem>
            <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
          </TextField>

          <TextField
            label="Piso"
            value={formData.piso}
            onChange={(e) => setFormData(prev => ({ ...prev, piso: e.target.value }))}
            variant="outlined"
          />

          <TextField
            type="date"
            label="Fecha"
            value={formData.fecha}
            onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Importe"
            value={formData.importe}
            onChange={(e) => setFormData(prev => ({ ...prev, importe: e.target.value }))}
            variant="outlined"
            type="number"
          />

          <TextField
            label="Administrador"
            value={formData.administrador}
            onChange={(e) => setFormData(prev => ({ ...prev, administrador: e.target.value }))}
            variant="outlined"
          />

          <Button 
            type="submit"
            variant="contained"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Agregando...' : 'Agregar Trabajo'}
          </Button>
        </Form>
      </FormSection>

      <SectionTitle>Lista de Trabajos</SectionTitle>

      <FilterSection>
        <div className="left-section">
          <FilterLabel>Edificio:</FilterLabel>
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
              placeholder="Filtrar por edificio"
              isFilter={true}
            />
          </AutocompleteContainer>
        </div>
        
        <SyncButton>
          <Tooltip title="Sincronizar con Google Sheets">
            <IconButton onClick={handleSync} disabled={syncing}>
              <SyncIcon sx={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        </SyncButton>
      </FilterSection>

      <FilterSection>
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