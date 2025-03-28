import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledFab = styled(Fab)`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 300px;
  background-color: #2196f3 !important;
  z-index: 9999;

  &:hover {
    background-color: #1976d2 !important;
  }

  svg {
    width: 100px;
    height: 100px;
    fill: white;
  }
`;

const ConfiguracionFacturacion = ({ open, onClose }) => {
  console.log('Renderizando ConfiguracionFacturacion'); // Debug log

  const [cuentas, setCuentas] = useState([]);
  const [editingCuenta, setEditingCuenta] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    porcentaje: 100,
    certificado: '',
    clave: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      cargarCuentas();
    }
  }, [open]);

  const cargarCuentas = async () => {
    try {
      const response = await axios.get('/api/facturacion/cuentas');
      setCuentas(response.data);
    } catch (error) {
      setError('Error al cargar las cuentas');
      console.error(error);
    }
  };

  const handleClose = () => {
    setEditingCuenta(null);
    setFormData({
      nombre: '',
      cuit: '',
      porcentaje: 100,
      certificado: '',
      clave: ''
    });
    setError('');
    setSuccess('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCuenta) {
        await axios.put(`/api/facturacion/cuentas/${editingCuenta._id}`, formData);
        setSuccess('Cuenta actualizada correctamente');
      } else {
        await axios.post('/api/facturacion/cuentas', formData);
        setSuccess('Cuenta creada correctamente');
      }
      await cargarCuentas();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar la cuenta');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cuenta?')) {
      try {
        await axios.delete(`/api/facturacion/cuentas/${id}`);
        setSuccess('Cuenta eliminada correctamente');
        await cargarCuentas();
      } catch (error) {
        setError('Error al eliminar la cuenta');
        console.error(error);
      }
    }
  };

  const handleEdit = (cuenta) => {
    setEditingCuenta(cuenta);
    setFormData(cuenta);
  };

  return (
    <div style={{ position: 'relative' }}>
      <StyledFab onClick={() => handleEdit(null)}>
        <SettingsIcon />
      </StyledFab>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCuenta ? 'Editar Cuenta' : 'Nueva Cuenta de Facturación'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="CUIT"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Porcentaje de Facturación"
              type="number"
              value={formData.porcentaje}
              onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 0, max: 100 }}
            />
            <TextField
              fullWidth
              label="Ruta del Certificado"
              value={formData.certificado}
              onChange={(e) => setFormData({ ...formData, certificado: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Ruta de la Clave Privada"
              value={formData.clave}
              onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
              margin="normal"
              required
            />
          </Box>

          <List sx={{ mt: 4 }}>
            {cuentas.map((cuenta) => (
              <ListItem key={cuenta._id}>
                <ListItemText
                  primary={cuenta.nombre}
                  secondary={`CUIT: ${cuenta.cuit} - ${cuenta.porcentaje}%`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEdit(cuenta)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(cuenta._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingCuenta ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfiguracionFacturacion; 