'use strict';

const express = require('express');
const router = express.Router();
const CustomError = require('../../locale/CustomError');

//  Activación de autenticación por token
const jwtAuth=require('../../lib/jwtAuth');
router.use(jwtAuth());

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

    //Si ha introducir valor nombre buscará los registros cuyo campo nombre comiencen por los caracteres introducidos
    if (nombre){
      filter.nombre=new RegExp('^'+nombre,"i");
    }
   
   //validamos campo venta
    if (venta && venta.toString()!='true' && venta.toString()!='false')
    {
      res.status(401).json({success: false, result: CustomError.translateMessage('NOT_VALID_VALUE_VENTA')});
      return;
    } 
    if (venta){   
      filter.venta=venta;
    }

    //validamos campo precio
    if (precio){
      if (precio.indexOf("-")===-1){
          //no incluye guion para marcar intervalo
          if (isNaN(parseFloat(precio))) //vamos a ver si es un valor numérico
          {
            res.status(401).json({success: false, result: CustomError.translateMessage('PRECIO_IS_NOT_NUMERIC_VALUE')});
            return;
          } 
          filter.precio=precio;    
          console.log(filter.precio); 
      }
      else{
          const inicio=precio.substring(0,precio.indexOf("-"));
          const fin=precio.substring(precio.indexOf("-")+1);
          //si hay rango de precio inicial y final
          console.log (isNaN(parseFloat(inicio)) , isNaN(parseFloat(fin)))
          if (inicio && fin)
          {
            //console.log (sNaN(parseFloat(inicio)) , isNaN(parseFloat(fin)))
            if (isNaN(parseFloat(inicio)) || isNaN(parseFloat(fin))) //vamos a ver si son valores numericos los del intervalo
            {
              res.status(401).json({success: false, result: CustomError.translateMessage('VALUE_PRECIO_INTERVAL_NOT_VALID')});
              return;
            } 
            filter.precio={$gte:inicio, $lte:fin};
          }
          else if (inicio) //si solo lo hay inicial
          {
            if (isNaN(parseFloat(inicio))) //vamos a ver si es un valor numérico
            {
              res.status(401).json({success: false, result: CustomError.translateMessage('INITIAL_VALUE_FOR_INTERVAL_PRECIO_NOT_VALID')});
              return;
            } 
            filter.precio={$gte:inicio};
          }
          else // si solo lo hay final
          {
            if (isNaN(parseFloat(fin))) //vamos a ver si es un valor numérico
            {
              res.status(401).json({success: false, result: CustomError.translateMessage('END_VALUE_FOR_INTERVAL_PRECIO_NOT_VALID')});
              return;
            } 
            filter.precio={$lte:fin};
          }
      } 
    }

    //Verificamos parametros tag , admite cualquier valor para el tag a la hora de búsqueda
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
