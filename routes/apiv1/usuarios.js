'use strict';

const express = require('express');
const router = express.Router();
const SHA256 = require('crypto-js/sha256');
const CustomError = require('../../locale/CustomError');



// cargar el modelo de Agente
const Usuario = require('../../models/Usuario');


/**
 * POST /usuarios
 * Descripción: Crea un usuaurio en base al nombre, email y clave introducido por el cliente
 *
 * Parametros que se le pasan:
 * nombre: Nombre del usuario
 * email: Email del usuario (será el usuario empleado para hacer login)
 * clave: Clave a asignar al usuario que estamos registrando. En base de datos no se    *almacenará nunca la clave propiamente dicha del usuario usuario, sino el hash de dicha *clave, como medida de seguridad. Esto garantiza la no reversibilidad del datos almacenado 
 */

router.post('/', (req, res, next) => {
  // creamos un usuario en memoria
  const usuario = new Usuario(req.body);

  //hasheamos la clave prorporcionada por el usuario antes de almacenarla en base de datos
  usuario.clave=SHA256(req.body.clave);

  // lo persistimos en la colección de usuarios
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ success: true, result: CustomError.translateMessage('USER_SAVED',reg.body.lang) });
  })
});


module.exports = router;
