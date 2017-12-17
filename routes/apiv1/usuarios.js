'use strict';

const express = require('express');
const router = express.Router();
const SHA256 = require('crypto-js/sha256');
const CustomError = require('../../locale/CustomError');
const validatorEmail= require('email-validator');


// cargar el modelo de Usuarios
const Usuario = require('../../models/Usuario');


/**
 * POST /usuarios
 * Descripción: Crea un usuaurio en base al nombre, email y clave introducido por el cliente
 *
 * Parametros que se le pasan:
 * nombre: Nombre del usuario
 * email: Email del usuario (será el usuario empleado para hacer login, no se podrá repetir en base de datos)
 * clave: Clave a asignar al usuario que estamos registrando. En base de datos no se almacenará nunca la clave propiamente dicha del usuario usuario, 
 * sino el hash de dicha *clave, como medida de seguridad. Esto garantiza la no reversibilidad del datos almacenado 
 */

router.post('/', (req, res, next) => {
  // creamos un usuario en memoria
  const usuario = new Usuario(req.body);

  //console.log(usuario.nombre , ' ', usuario.email, ' ' , usuario.clave);
  //Verificamos que todos los campos requeridos son proporcionados
  if (!usuario.nombre || !usuario.email || !usuario.clave)
  {
     res.status(401).json({success: false, result: CustomError.translateMessage('FIELDS_REQUIRED')});
     return;
  }

  //verificamos que el formato del email proporcionado es valido
  if (!validatorEmail.validate(usuario.email))
  {
     res.status(401).json({success: false, result: CustomError.translateMessage('EMAIL_MALFORMED')});
     return;
  }

  //hasheamos la clave prorporcionada por el usuario antes de almacenarla en base de datos
  usuario.clave=SHA256(req.body.clave);

  // lo persistimos en la colección de usuarios
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      console.log(err);
       if (err.code=11000){ // el error 11000 ese el error de clave duplicada y al haber marcado email como unique no permitirá almacenar 2 emails iguales
        res.status(401).json({success: false, result: CustomError.translateMessage('USER_ALREADY_REGISTERED')});
        return;
      }
      
      next(err);
      return;
    }
    res.json({ success: true, result: CustomError.translateMessage('USER_SAVED') });
  })
});


module.exports = router;
