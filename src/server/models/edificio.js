const mongoose = require('mongoose');

const edificioSchema = new mongoose.Schema({
  direccion: {
    type: String,
    required: true,
    unique: true
  },
  cuit: {
    type: String,
    required: true
  },
  administrador: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Edificio', edificioSchema); 