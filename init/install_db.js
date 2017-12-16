'use strict';

var fs = require('fs');

 //cargamos modelos
 const Anuncio = require('../models/Anuncio');
 const Usuario = require('../models/Usuario');

 //cargamos el connector a la base de datos

 const conn=require('../lib/connectMongoose');
 

//Borrado de anuncios
function borraAnuncios(proceso){

  return new Promise((resolve,reject) => {
    Anuncio.remove({}, function (err) {
        if (err) reject(new Error('Borrado de Anuncios fallido'));
        else resolve(proceso + 'Borrado de Anuncios OK\n');
      });  
   
  });
}

//Borrado de usuarios
function borraUsuarios(proceso){
 return new Promise((resolve,reject) => {
    Usuario.remove({}, function (err) {
        if (err) reject(new Error('Borrado de Usuarios fallido'));
        else resolve(proceso + 'Borrado de Usuarios OK\n');
    });
 });
}

//carga anuncios desde JSON
function cargaAnuncios(proceso){
    
    return new Promise((resolve,reject) =>{
    var data = fs.readFile("./init/anuncios.json", (err, data)=>{
       if (err) reject(new Error('Error leyendo fichero de anuncios'));  
       else
       {
         var anuncio;
         var jsonData=JSON.parse(data);
         jsonData.anuncios.forEach(anuncio => {
        
         anuncio = new Anuncio({nombre: anuncio.nombre, venta:anuncio.venta, precio: anuncio.precio, foto: anuncio.foto,  tags: anuncio.tags});   
         // lo persistimos en la colección de anuncios
         anuncio.save((error, anuncioGuardado) => {
           if (error) reject(new Error('Error grabando anuncios'));      
           });          
         });           
        }
        resolve(proceso + 'Carga de anuncios OK\n');    
     });  
    });
}


//carga Usuarios desde JSON
function cargaUsuarios(proceso){
    
    return new Promise((resolve,reject) =>{
    var data = fs.readFile("./init/usuarios.json", (err, data)=>{
       if (err) reject(new Error('Error leyendo fichero de usuarios'));  
       else
       {
         var usuario;
         var jsonData=JSON.parse(data);
         jsonData.usuarios.forEach(usuario => {
         usuario = new Usuario({nombre: usuario.nombre, email:usuario.email, clave: usuario.clave});  
         // lo persistimos en la colección de usuarios
         usuario.save((error, usuarioGuardado) => {
           if (error) reject(new Error('Error grabando usuarios'));      
           });          
         });    
        }    
        resolve(proceso + 'Carga de usuarios OK\n');
    });      
   });
}


async function main(){
    
   //A través de llamadas async-await a funciones, que devuelven promesas, que van realizando ls distintas acciones borrado y carga
   //De forma ordenada 
   let result='';
   result=await borraAnuncios(result);

   result=await borraUsuarios(result);

   result=await cargaAnuncios(result);

   result=await cargaUsuarios(result);

   return result;
   
}

main().then(result => {
    console.log(result);
    process.exit(0);
    })
    .catch(err =>{
    console.log('Se produjo un error durante la inyección masiva de datos ', err);
    process.exit(1);
});



