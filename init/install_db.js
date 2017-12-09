'use strict';

var fs = require('fs');


//cargamos el connector a la base de datos
require('../lib/connectMongoose');


const Anuncio = require('../models/Anuncio');
const Usuario = require('../models/Usuario');


//inicializar colecciones
Anuncio.remove({}, function (err) {
    if (err) return handleError(err);
    //console.log('Coleccion anuncios borrada');
});
Usuario.remove({}, function (err) {
    if (err) return handleError(err);
    //console.log('Coleccion usuarios borrada');
});


//console.log("Iniciando lectura de datos para datos de anuncios");
var data = fs.readFileSync("./init/anuncios.js");
var jsonData=JSON.parse(data);
//console.log(jsonData);
var anuncio;
jsonData.anuncios.forEach(anuncio => {
    anuncio = new Anuncio({nombre: anuncio.nombre, venta:anuncio.venta, precio: anuncio.precio, foto: anuncio.foto,  tags: anuncio.tags});
    
    // lo persistimos en la colección de agentes
    anuncio.save((err, anuncioGuardado) => {
        if (err) {
          console.log('Error grabando anuncio en base de datos');
          throw err;
        }
  
    //console.log(anuncio.nombre + ' guardado');
    });
});
//console.log("Fin lectura de anuncios");

//console.log("Iniciando lectura de datos para datos de usuarios");
data = fs.readFileSync("./init/usuarios.js");
jsonData=JSON.parse(data);

var usuario;
jsonData.usuarios.forEach(usuario => {
    usuario = new Usuario({nombre: usuario.nombre, email:usuario.email, clave: usuario.clave});
    
    // lo persistimos en la colección de usuarios
    usuario.save((err, usuarioGuardado) => {
        if (err) {
          console.log('Error grabando usuario en base de datos');
          throw err;
        }
  
    //console.log(usuario.nombre + ' guardado');
    });
});
console.log("Fin lectura de usuarios");
//process.exit(0);


