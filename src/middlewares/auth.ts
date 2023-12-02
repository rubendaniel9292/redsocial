import jwt from 'jwt-simple';
import moment from 'moment';
import { Request, Response } from 'express';
import { secret } from '../services/jwt'
//midleware funcion de autenticacion
export const auth = (req: Request, res: Response, next: any) => {
    //comprobar si me llega la cabecera de auth
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: 'error', message: 'La peticion no tiene la cabecera de autenticacion',

        });
    }
    //decodificar el token, limpiando de comillas
    let token = req.headers.authorization.replace(/['"]+g/, '');

    try {
        let payLoad = jwt.decode(token, secret);

        //comprobar la expiracion del token
        if (payLoad.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error', message: 'token expirado'
            });
        };
        //agregar datos de usuario a reques
        (req as any).user = payLoad;
    } catch (error) {
        return res.status(403).json({
            status: 'error', message: 'token inválido'
        });
    };


    next();
    //pasar a la ejeccuion

}
