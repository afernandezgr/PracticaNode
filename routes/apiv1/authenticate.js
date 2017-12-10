'use strict';

const express = require('express');
const router = express.Router();
const jwt= require('jsonwebtoken');
const SHA256 = require('crypto-js/sha256');
const Usuario = require('../../models/Usuario');
const CustomError = require('../../locale/CustomError');



router.post('/',async (req,res,next)=>{
  try{
      // recogemos las credenciales del body
      const email=req.body.email;
      const clave=req.body.clave;
      const lang=req.body.lang;
      
     
     // Buscamos en la base de datos en usaurio
      const usuario =  await Usuario.findOne({email:email}).exec();
      
      if (usuario===null || usuario===undefined || usuario.clave !== SHA256(clave).toString()) 
      {
        res.status = 401;      
        res.json({error: CustomError.translateMessage('INCORRECT_CREDENTIALS',lang)});
        return;
      }
 
      const user = {_id: usuario._id}

    // El usuario existe y la password coincide 
    // Creamos un token 
    // no firmar objetos de mongoose!!!, usar mejor un nuevo objeto OJO solo con lo mínimo
    
    
    
    jwt.sign({ user_id: user._id},process.env.JWT_SECRET,{  //user id del usuario que hemos encontrado en la base de datos, este no lo inventamso ahora para ejemplo
     expiresIn:process.env.JWT_EXPIRES_IN
     },(err,token) => {
    if(err){
      next(err);
      return;
    }
    //y lo devolvemos
    res.json({sucess: true, token: token});
   });


  }
  catch(err){
    next(err);
  }

});

module.exports=router;
