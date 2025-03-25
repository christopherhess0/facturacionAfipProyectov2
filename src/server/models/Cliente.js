const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    documento: {
        type: String,
        required: true
    },
    tipoDocumento: {
        type: Number,
        required: true,
        default: 80 // CUIT por defecto
    },
    direccion: String,
    telefono: String,
    email: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema); 