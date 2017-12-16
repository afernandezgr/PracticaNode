'use strict';

const mongoose = require('mongoose');

// primero creamos el esquema de Usuario
const usuarioSchema = mongoose.Schema({
  nombre: String,
  email: {type: String, index:true, unique:true},
  clave: String
});



// Ahora  creamos el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);


// Lo exportamos
module.exports = Usuario;