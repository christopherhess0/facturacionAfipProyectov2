const mongoose = require('mongoose');

const trabajoSchema = new mongoose.Schema({
    edificio: {
        type: String,
        required: true,
        trim: true
    },
    cuit: {
        type: String,
        default: '',
        trim: true
    },
    tipoDestapacion: {
        type: String,
        required: true,
        trim: true
    },
    piso: {
        type: String,
        default: '',
        trim: true
    },
    fecha: {
        type: String,
        required: true,
        trim: true
    },
    importe: {
        type: Number,
        required: true,
        min: 0
    },
    seFactura: {
        type: Boolean,
        default: true
    },
    facturaHecha: {
        type: Boolean,
        default: false
    },
    pagado: {
        type: Boolean,
        default: false
    },
    administrador: {
        type: String,
        default: '',
        trim: true
    },
    nombreContacto: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

// Middleware para actualizar updatedAt
trabajoSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.models.Trabajo || mongoose.model('Trabajo', trabajoSchema); 