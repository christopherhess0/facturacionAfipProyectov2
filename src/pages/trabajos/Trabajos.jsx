import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EdificioAutocomplete from '../../components/EdificioAutocomplete';
import TipoDestapacionAutocomplete from '../../components/TipoDestapacionAutocomplete';
import { fetchEdificios } from '../../features/edificios/edificiosSlice';
import { agregarTrabajo, cargarTrabajos, editarTrabajo, eliminarTrabajo, toggleFacturado } from '../../features/trabajos/trabajosSlice';
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

const Trabajos = () => {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [filtroEdificio, setFiltroEdificio] = useState(null);
  const [formData, setFormData] = useState({
    edificio: '',
    cuit: '',
    tipoDestapacion: '',
    fecha: '',
    importe: '',
    administrador: '',
    piso: ''
  });
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);

  const trabajos = useSelector(state => state.trabajos?.trabajos || []);
  const edificios = useSelector(state => state.edificios?.edificios || []);

  useEffect(() => {
    dispatch(cargarTrabajos());
    dispatch(fetchEdificios());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!edificioSeleccionado) return;

    const nuevoTrabajo = {
      id: editingId || Date.now(),
      edificio: edificioSeleccionado.nombreEdificio,
      cuit: edificioSeleccionado.cuit,
      tipoDestapacion: formData.tipoDestapacion,
      fecha: formData.fecha,
      importe: formData.importe,
      administrador: edificioSeleccionado.nombreAdministracion,
      piso: formData.piso
    };

    if (editingId) {
      dispatch(editarTrabajo({ id: editingId, datos: nuevoTrabajo }));
      setEditingId(null);
    } else {
      dispatch(agregarTrabajo(nuevoTrabajo));
    }

    setFormData({
      edificio: '',
      cuit: '',
      tipoDestapacion: '',
      fecha: '',
      importe: '',
      administrador: '',
      piso: ''
    });
    setEdificioSeleccionado(null);
  };

  const handleEdit = (trabajo) => {
    setEditingId(trabajo.id);
    const edificioEncontrado = edificios.find(e => e.nombreEdificio === trabajo.edificio);
    setEdificioSeleccionado(edificioEncontrado);
    setFormData({
      ...trabajo
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este trabajo?')) {
      dispatch(eliminarTrabajo(id));
    }
  };

  const handleFacturadoChange = (id) => {
    dispatch(toggleFacturado({ id }));
  };

  const handleEdificioChange = (edificio) => {
    setEdificioSeleccionado(edificio);
    if (edificio) {
      setFormData(prev => ({
        ...prev,
        edificio: edificio.nombreEdificio,
        cuit: edificio.cuit,
        administrador: edificio.nombreAdministracion
      }));
    }
  };

  const trabajosFiltrados = useMemo(() => {
    return trabajos.filter(trabajo => 
      !filtroEdificio || trabajo.edificio === filtroEdificio?.nombreEdificio
    );
  }, [trabajos, filtroEdificio]);

  return (
    <Container>
      <Title>Gestión de Trabajos de Destapación</Title>
      
      <FilterSection>
        <FilterLabel>Filtrar por Edificio:</FilterLabel>
        <AutocompleteContainer>
          <EdificioAutocomplete
            edificios={edificios}
            value={filtroEdificio}
            onChange={setFiltroEdificio}
          />
        </AutocompleteContainer>
      </FilterSection>

      <Form onSubmit={handleSubmit}>
        <AutocompleteContainer>
          <EdificioAutocomplete
            edificios={edificios}
            value={edificioSeleccionado}
            onChange={handleEdificioChange}
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
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Importe</TableHeader>
            <TableHeader>Administrador</TableHeader>
            <TableHeader>Facturado</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {trabajosFiltrados.map((trabajo) => (
            <TableRow key={trabajo.id}>
              <TableCell>{trabajo.edificio}</TableCell>
              <TableCell>{trabajo.cuit}</TableCell>
              <TableCell>{trabajo.tipoDestapacion}</TableCell>
              <TableCell>{trabajo.piso}</TableCell>
              <TableCell>{trabajo.fecha}</TableCell>
              <TableCell>${trabajo.importe}</TableCell>
              <TableCell>{trabajo.administrador}</TableCell>
              <TableCell>
                <Select
                  value={trabajo.facturado ? "SI" : "NO"}
                  onChange={() => handleFacturadoChange(trabajo.id)}
                  style={{ 
                    backgroundColor: trabajo.facturado ? '#4CAF50' : '#f44336',
                    color: 'white',
                    padding: '5px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </Select>
              </TableCell>
              <TableCell>
                <ActionButtons>
                  <ActionButton onClick={() => handleEdit(trabajo)}>
                    ✏️
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(trabajo.id)}>
                    🗑️
                  </ActionButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Trabajos; 