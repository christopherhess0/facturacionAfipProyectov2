import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2C5282;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    border-color: #2C5282;
    outline: none;
    box-shadow: 0 0 0 1px #2C5282;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    border-color: #2C5282;
    outline: none;
    box-shadow: 0 0 0 1px #2C5282;
  }
`;

const Button = styled.button`
  background-color: #2C5282;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2d3748;
  }
  
  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 8px;
`;

const SuccessMessage = styled.div`
  color: #38a169;
  font-size: 0.875rem;
  margin-top: 8px;
`;

const AgregarTrabajo = ({ onTrabajoAgregado }) => {
  const [edificios, setEdificios] = useState([]);
  const [formData, setFormData] = useState({
    edificio: '',
    cuit: '',
    tipoDestapacion: '',
    piso: '',
    fecha: new Date().toISOString().split('T')[0],
    importe: '',
    administrador: '',
    seFactura: true,
    facturaHecha: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const tiposDestapacion = [
    'Destapación de Cocina',
    'Destapación de Baño',
    'Destapación de Cloaca',
    'Destapación de Columna de cocina',
    'Destapación de Columna de lavadero',
    'Destapación de Cocina y lavadero',
    'Destapacion de 2 cloacas'
  ];

  useEffect(() => {
    cargarEdificios();
  }, []);

  const cargarEdificios = async () => {
    try {
      const response = await axios.get('/api/edificios');
      setEdificios(response.data);
    } catch (error) {
      console.error('Error al cargar edificios:', error);
      setError('Error al cargar la lista de edificios');
    }
  };

  const handleEdificioChange = (edificioSeleccionado) => {
    const edificio = edificios.find(e => e.direccion === edificioSeleccionado);
    if (edificio) {
      setFormData(prev => ({
        ...prev,
        edificio: edificio.direccion,
        cuit: edificio.cuit || '',
        administrador: edificio.administrador || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/trabajos', formData);
      setSuccess('Trabajo agregado exitosamente');
      setFormData({
        edificio: '',
        cuit: '',
        tipoDestapacion: '',
        piso: '',
        fecha: new Date().toISOString().split('T')[0],
        importe: '',
        administrador: '',
        seFactura: true,
        facturaHecha: false
      });
      if (onTrabajoAgregado) {
        onTrabajoAgregado(response.data);
      }
    } catch (error) {
      console.error('Error al agregar trabajo:', error);
      setError('Error al agregar el trabajo. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Edificio</Label>
          <Select
            name="edificio"
            value={formData.edificio}
            onChange={(e) => handleEdificioChange(e.target.value)}
            required
          >
            <option value="">Seleccione un edificio</option>
            {edificios.map((edificio) => (
              <option key={edificio._id} value={edificio.direccion}>
                {edificio.direccion}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>CUIT</Label>
          <Input
            type="text"
            name="cuit"
            value={formData.cuit}
            onChange={handleInputChange}
            readOnly
          />
        </FormGroup>

        <FormGroup>
          <Label>Tipo de Destapación</Label>
          <Select
            name="tipoDestapacion"
            value={formData.tipoDestapacion}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione tipo</option>
            {tiposDestapacion.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Piso</Label>
          <Input
            type="text"
            name="piso"
            value={formData.piso}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Fecha</Label>
          <Input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Importe</Label>
          <Input
            type="number"
            name="importe"
            value={formData.importe}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Administrador</Label>
          <Input
            type="text"
            name="administrador"
            value={formData.administrador}
            onChange={handleInputChange}
            readOnly
          />
        </FormGroup>

        <FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Trabajo'}
          </Button>
        </FormGroup>
      </Form>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </FormContainer>
  );
};

export default AgregarTrabajo; 