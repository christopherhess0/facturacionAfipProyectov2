import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Facturacion = () => {
  const [distribucion, setDistribucion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const cargarDistribucion = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/facturacion/estado');
      setDistribucion(response.data);
    } catch (error) {
      setError('Error al cargar la distribución de facturas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDistribucion();
  }, []);

  const generarFacturas = async (usuario) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await axios.post(`/api/facturacion/generar/${usuario}`);
      
      setSuccess(`Facturas generadas correctamente para ${usuario}`);
      cargarDistribucion(); // Recargar la distribución
    } catch (error) {
      setError(`Error al generar facturas para ${usuario}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Facturación
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {distribucion && Object.entries(distribucion.distribucion).map(([usuario, trabajos]) => (
          <Grid item xs={12} md={4} key={usuario}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {usuario.charAt(0).toUpperCase() + usuario.slice(1)}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Trabajos pendientes: {trabajos.length}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => generarFacturas(usuario)}
                  disabled={trabajos.length === 0 || loading}
                  fullWidth
                >
                  Generar Facturas
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Facturacion; 