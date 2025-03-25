const express = require('express');
const router = express.Router();
const Factura = require('../models/Factura');
const { Afip } = require('@afipsdk/afip.js');

const afip = new Afip({
    CUIT: process.env.CUIT,
    production: process.env.NODE_ENV === 'production',
    cert: 'cert.pem',
    key: 'key.pem',
});

// Obtener todas las facturas
router.get('/', async (req, res) => {
    try {
        const facturas = await Factura.find().populate('cliente');
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva factura
router.post('/', async (req, res) => {
    try {
        const { cliente, items } = req.body;
        const puntoVenta = 1;
        const tipoComprobante = 6;

        // Obtener último número de comprobante
        const ultimoNumero = await afip.ElectronicBilling.getLastVoucher(puntoVenta, tipoComprobante);
        
        // Calcular total
        const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        // Crear datos para AFIP
        const fecha = new Date().toISOString().split('T')[0];
        const dataAfip = {
            'CantReg': 1,
            'PtoVta': puntoVenta,
            'CbteTipo': tipoComprobante,
            'Concepto': 1,
            'DocTipo': 80,
            'DocNro': cliente.documento,
            'CbteDesde': ultimoNumero + 1,
            'CbteHasta': ultimoNumero + 1,
            'CbteFch': fecha.replace(/-/g, ''),
            'ImpTotal': total,
            'ImpTotConc': 0,
            'ImpNeto': total,
            'ImpOpEx': 0,
            'ImpTrib': 0,
            'ImpIVA': 0,
            'MonId': 'PES',
            'MonCotiz': 1
        };

        // Crear factura en AFIP
        const respuestaAfip = await afip.ElectronicBilling.createVoucher(dataAfip);

        // Crear factura en la base de datos
        const factura = new Factura({
            cliente: cliente._id,
            numeroComprobante: ultimoNumero + 1,
            tipoComprobante,
            puntoVenta,
            fecha: new Date(),
            items,
            total,
            cae: respuestaAfip.CAE,
            vencimientoCae: respuestaAfip.CAEFchVto
        });

        const nuevaFactura = await factura.save();
        await nuevaFactura.populate('cliente');
        res.status(201).json(nuevaFactura);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener una factura por ID
router.get('/:id', async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id).populate('cliente');
        if (factura) {
            res.json(factura);
        } else {
            res.status(404).json({ message: 'Factura no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 