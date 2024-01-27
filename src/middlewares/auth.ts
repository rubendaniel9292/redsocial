import jwt from 'jwt-simple';
import moment from 'moment';
import { NextFunction, Request, Response } from 'express';
import { secret } from '../services/jwt'
//midleware funcion de autenticacion

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        //comprobar si me llega la cabecera de auth
        if (!req.headers.authorization) {
            return res.status(403).json({
                status: 'error', message: 'La peticion no tiene la cabecera de autenticacion',

            });
        }
        //decodificar el token, limpiando de comillas y limpiado de espacios en blanco
        let token = req.headers.authorization.replace(/['"]+g/, '').trim();
        //console.log('Token antes del try:', token);



        //console.log('Token:', token);
        let payLoad = jwt.decode(token, secret);
        //comprobar la expiracion del token
        if (payLoad.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error', message: 'token expirado'
            });
        };
        //agregar datos de usuario a reques
        req.user = payLoad;
        //console.log('Usuario añadido a la req:', (req as any).user);
        console.log('Middleware de autenticación ejecutado');
        //Pasar a la ejecución del siguiente middleware o controlador
        next();

    } catch (error) {
        //console.log('Error en auth middleware:', error);
        return res.status(403).json({
            status: 'error', message: 'token inválido'
        });
    };




}
