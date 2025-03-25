const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    numeroComprobante: {
        type: Number,
        required: true
    },
    tipoComprobante: {
        type: Number,
        required: true,
        default: 6 // Factura B por defecto
    },
    puntoVenta: {
        type: Number,
        required: true,
        default: 1
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    items: [{
        descripcion: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        precio: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    cae: String,
    vencimientoCae: Date,
    observaciones: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Factura', facturaSchema); 