const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo cliente
router.post('/', async (req, res) => {
    const cliente = new Cliente(req.body);
    try {
        const nuevoCliente = await cliente.save();
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(cliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cliente eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 