const mongoose = require('mongoose');

const cuentaFacturacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cuit: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  porcentaje: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100
  },
  certificado: {
    type: String,
    required: true,
    trim: true
  },
  clave: {
    type: String,
    required: true,
    trim: true
  },
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CuentaFacturacion', cuentaFacturacionSchema); 