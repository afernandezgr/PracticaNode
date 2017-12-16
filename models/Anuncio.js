'use strict';

const mongoose = require('mongoose');

// primero creamos el esquema
const anuncioSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]  //dato que de momento solamente vamos a hacer operaciones de lectura de anuncios no vamos a gestionar que los valores introducidos en tags sean los preestablecidos
});


//creamos un método estático
anuncioSchema.statics.list=function(filters,limit,skip,sort,fields){
  //obtenemos la query sin ejecutarla
  const query=Anuncio.find(filters);

  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);

  //ejecutamos la query y devolvemos una promesa
  return query.exec();
  ///el metodo list esta devolviendo una promesa
}


// y por último creamos el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);


// y lo exportamos
module.exports = Anuncio;