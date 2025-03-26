const express = require('express');
const router = express.Router();
const facturacionService = require('../services/facturacionService');
const afipService = require('../services/afipService');

// Ruta de prueba para verificar la conexión con AFIP
router.get('/test-afip', async (req, res) => {
  console.log('Iniciando prueba de conexión con AFIP...');
  try {
    console.log('Llamando a afipService.testConnection()...');
    const resultado = await afipService.testConnection();
    console.log('Resultado de la prueba:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('Error detallado en test de AFIP:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.response?.data
    });
    res.status(500).json({ 
      success: false, 
      message: 'Error al probar conexión con AFIP',
      error: error.message,
      details: error.response?.data || {},
      stack: error.stack
    });
  }
});

// Distribuir facturas pendientes entre usuarios
router.get('/distribuir', async (req, res) => {
  try {
    const resultado = await facturacionService.distribuirFacturas();
    res.json(resultado);
  } catch (error) {
    console.error('Error en ruta /distribuir:', error);
    res.status(500).json({ error: 'Error al distribuir facturas' });
  }
});

// Generar facturas para un usuario específico
router.post('/generar/:usuario', async (req, res) => {
  try {
    const { usuario } = req.params;
    const resultados = await facturacionService.generarFacturasParaUsuario(usuario);
    res.json(resultados);
  } catch (error) {
    console.error('Error en ruta /generar/:usuario:', error);
    res.status(500).json({ error: 'Error al generar facturas' });
  }
});

// Obtener estado de facturación
router.get('/estado', async (req, res) => {
  try {
    const distribucion = await facturacionService.distribuirFacturas();
    res.json(distribucion);
  } catch (error) {
    console.error('Error en ruta /estado:', error);
    res.status(500).json({ error: 'Error al obtener estado de facturación' });
  }
});

module.exports = router; 