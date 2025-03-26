const mongoose = require('mongoose');

const edificioSchema = new mongoose.Schema({
  direccion: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cuit: {
    type: String,
    trim: true,
    default: ''
  },
  administrador: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Evitar la recompilación del modelo
module.exports = mongoose.models.Edificio || mongoose.model('Edificio', edificioSchema); 