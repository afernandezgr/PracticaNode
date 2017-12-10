'use strict';

const jwt = require('jsonwebtoken');
const CustomError = require('../../locale/CustomError');
//exportamos un creador de middelwares de autenticación

module.exports=() => {

    return function(req,res,next){
        //leer credenciales
        const token = req.body.token || req.query.token || req.get('x-access-token');

        if (!token){

            const err=new Error(CustomError.translateMessage('NO_TOKEN_PROVIDED',req.body.lang));
            err.status=401;
            next(err);
            return;
        }

        //comprobar credenciales
        jwt.verify(token,process.env.JWT_SECRET, (err, decoded)=> {
            if (err){
                const error=new Error(CustomError.translateMessage('INVALID_TOKEN',req.body.lang));
                error.status=401;
                next(error);
                return;
            }

            req.userId=decoded.user_id; //lo guardamos en el request para los siguientes middlewares
            next(); // token es valido dejamos que siga
        }); 

        //continuar
    }
}