'use strict';

const express = require('express');
const router = express.Router();

//  Activación de autenticación por token
//const jwtAuth=require('../../lib/jwtAuth');
//router.use(jwtAuth());

// cargar el modelo de Anuncios
const Anuncio = require('../../models/Anuncio');


/**
 * GET /tags
 * Devuelve la lista de tagas distintas de todos los anuncios incluidos en base de datos
 */

router.get('/tags',async (req,res,next) =>{
  //console.log('paso');
  try{
  
   // Realizamos una busqueda entre todos los anuncios seleccionando todas las tags distintas presentes en base de datos

   const query=Anuncio.distinct('tags',{},function(err,anuncio)
  
   {
    if (err) return handleError(err);
    res.json({sucess: true, result: anuncio});
   })
 }
  catch(err){
    next(err);
  }
});


/**
 * GET /anuncios
 * Obtener una lista de anuncios en base a unos criterios
 */

router.get('/', async (req,res,next)=>{
  try{

    const nombre= req.query.nombre;
    const venta= req.query.venta;
    const precio= req.query.precio;
    const tag= req.query.tag;
    const limit=parseInt(req.query.limit); 
    const skip=parseInt(req.query.start); 
    const sort=req.query.sort;
    const fields=req.query.fields;

    

    //creo el filtro vacio
    const filter={};
    if (nombre){
      filter.nombre=new RegExp('^'+nombre,"i");
    }

    if (venta){
      filter.venta=venta;
    }

    if (precio){
      if (precio.indexOf("-")===-1){
          //no incluye guion para marcar intervalo
          filter.precio=precio;    
          console.log(filter.precio); 
      }
      else{
          const inicio=precio.substring(0,precio.indexOf("-"));
          const fin=precio.substring(precio.indexOf("-")+1);
          //si hay rango de precio inicial y final
          if (inicio && fin)
          {
            filter.precio={$gte:inicio, $lte:fin};
          }
          else if (inicio) //si solo lo hay inicial
          {
            filter.precio={$gte:inicio};
          }
          else // si solo lo hay final
          {
            filter.precio={$lte:fin};
          }
      } 
    }

    if (tag){
      filter.tags={$in: [tag]};
      console.log(filter.tag);
    }
   const rows= await Anuncio.list(filter,limit,skip,sort,fields);
   res.json({sucess: true, result: rows});
  }
  catch (err){
    next(err);
  }

});



module.exports = router;
