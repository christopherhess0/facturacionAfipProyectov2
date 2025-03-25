const express = require('express');
const router = express.Router();
const Trabajo = require('../models/Trabajo');

// Obtener todos los trabajos
router.get('/', async (req, res) => {
    try {
        const trabajos = await Trabajo.find().sort({ fecha: -1 });
        res.json(trabajos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo trabajo
router.post('/', async (req, res) => {
    try {
        const trabajo = new Trabajo({
            ...req.body,
            fecha: req.body.fecha || new Date(),
            facturado: false
        });
        const nuevoTrabajo = await trabajo.save();
        res.status(201).json(nuevoTrabajo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener trabajos no facturados
router.get('/no-facturados', async (req, res) => {
    try {
        const trabajos = await Trabajo.find({ facturado: false }).sort({ fecha: -1 });
        res.json(trabajos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un trabajo específico
router.get('/:id', async (req, res) => {
    try {
        const trabajo = await Trabajo.findById(req.params.id);
        if (!trabajo) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }
        res.json(trabajo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un trabajo
router.put('/:id', async (req, res) => {
    try {
        const trabajo = await Trabajo.findById(req.params.id);
        if (!trabajo) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }

        // Actualizar campos
        Object.keys(req.body).forEach(key => {
            trabajo[key] = req.body[key];
        });

        const trabajoActualizado = await trabajo.save();
        res.json(trabajoActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Marcar trabajo como facturado
router.patch('/:id/facturar', async (req, res) => {
    try {
        const trabajo = await Trabajo.findById(req.params.id);
        if (!trabajo) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }

        trabajo.facturado = true;
        trabajo.facturaId = req.body.facturaId; // ID de la factura generada
        const trabajoActualizado = await trabajo.save();
        res.json(trabajoActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un trabajo
router.delete('/:id', async (req, res) => {
    try {
        const trabajo = await Trabajo.findById(req.params.id);
        if (!trabajo) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }

        await trabajo.remove();
        res.json({ message: 'Trabajo eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 