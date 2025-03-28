const express = require('express');
const router = express.Router();
const facturacionService = require('../services/facturacionService');
const AfipService = require('../services/afipService');
const CuentaFacturacion = require('../models/CuentaFacturacion');

// Ruta de prueba para verificar la conexión con AFIP
router.get('/test-afip/:cuenta', async (req, res) => {
  console.log('Iniciando prueba de conexión con AFIP...');
  try {
    const { cuenta } = req.params;
    console.log(`Probando conexión para cuenta: ${cuenta}`);
    
    const afipService = new AfipService(cuenta);
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

// Obtener todas las cuentas de facturación
router.get('/cuentas', async (req, res) => {
  try {
    const cuentas = await CuentaFacturacion.find({ activa: true });
    res.json(cuentas);
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    res.status(500).json({ error: 'Error al obtener las cuentas de facturación' });
  }
});

// Crear nueva cuenta de facturación
router.post('/cuentas', async (req, res) => {
  try {
    const cuenta = new CuentaFacturacion(req.body);
    await cuenta.save();
    res.status(201).json(cuenta);
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    res.status(400).json({ error: 'Error al crear la cuenta de facturación' });
  }
});

// Actualizar cuenta de facturación
router.put('/cuentas/:id', async (req, res) => {
  try {
    const cuenta = await CuentaFacturacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!cuenta) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }
    res.json(cuenta);
  } catch (error) {
    console.error('Error al actualizar cuenta:', error);
    res.status(400).json({ error: 'Error al actualizar la cuenta de facturación' });
  }
});

// Eliminar cuenta de facturación
router.delete('/cuentas/:id', async (req, res) => {
  try {
    const cuenta = await CuentaFacturacion.findByIdAndUpdate(
      req.params.id,
      { activa: false },
      { new: true }
    );
    if (!cuenta) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    res.status(400).json({ error: 'Error al eliminar la cuenta de facturación' });
  }
});

module.exports = router; 