const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tecnologias: [{
    type: String
  }],
  imagen: {
    type: String
  },
  enlace: {
    type: String
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
}, { timestamps: true });

module.exports = mongoose.model('Proyecto', proyectoSchema);