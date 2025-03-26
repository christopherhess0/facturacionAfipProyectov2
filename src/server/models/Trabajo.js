const mongoose = require('mongoose');

const trabajoSchema = new mongoose.Schema({
    edificio: {
        type: String,
        required: true,
        trim: true
    },
    cuit: {
        type: String,
        trim: true,
        default: ''
    },
    tipoDestapacion: {
        type: String,
        required: true,
        trim: true
    },
    piso: {
        type: String,
        trim: true,
        default: ''
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
        default: true // Siempre true ya que solo guardamos los que se facturan
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
        trim: true,
        default: ''
    },
    nombreContacto: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

// Middleware para actualizar updatedAt
trabajoSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Trabajo', trabajoSchema); 