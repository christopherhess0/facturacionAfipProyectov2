const mongoose = require('mongoose');

const trabajoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    cuitCliente: {
        type: String,
        required: true
    },
    tipoTrabajo: {
        type: String,
        required: true
    },
    ubicacion: {
        departamento: String,
        piso: String
    },
    importe: {
        type: Number,
        required: true
    },
    administracion: {
        nombre: {
            type: String,
            required: true
        },
        contacto: String
    },
    facturado: {
        type: Boolean,
        default: false
    },
    facturaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Factura'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Trabajo', trabajoSchema); 