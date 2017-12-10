'use strict';

const express = require('express');
const router = express.Router();
const SHA256 = require('crypto-js/sha256');
const CustomError = require('../../locale/CustomError');



// cargar el modelo de Agente
const Usuario = require('../../models/Usuario');



/**
 * POST /usuarios
 * Crea un usuaurio en base al nombre, email y clave introducido por el usuario
 * La clave es hasheada con SHA256 antes de ser almacenada en base de datos
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
