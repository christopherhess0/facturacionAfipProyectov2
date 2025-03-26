const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    trabajo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trabajo',
        required: true
    },
    numeroFactura: {
        type: Number,
        required: true
    },
    cae: {
        type: String,
        required: true
    },
    fechaEmision: {
        type: Date,
        default: Date.now
    },
    usuarioFacturador: {
        type: String,
        enum: ['christopher', 'nicole', 'german'],
        required: true
    },
    pdfPath: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'generada', 'error'],
        default: 'pendiente'
    },
    error: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Factura', facturaSchema); 