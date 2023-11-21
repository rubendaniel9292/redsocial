import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import user from '../models/user';

//metodos de pruebas
export const pruebaUser = (req: Request, res: Response) => {

    return res.status(200).send({
        message: 'mensaje enviado desde el controlador user'
    });

};

//registro de usuarios
export const register = async (req: Request, res: Response) => {
    try {
        //recooger datos de la peticion
        const params = req.body;
        //comprobar que llegen los datos correctamente
        if (!params.name || !params.surname || !params.nick || !params.email || !params.password) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        //control de usuarios duplicados
        user.find({
            $or: [
                { email: params.email!.toLocaleLowerCase() },
                { nick: params.nick!.toLocaleLowerCase() }
            ]
        }).exec().then(async (users) => {
            if (users && users.length) {
                return res.status(200).json({
                    status: 'success', message: 'el usuario ya existe'
                });
            };
            /*
            cifrar la contraseña mediante calback: 
            recibe la contraseña, numero de encriptaciones, y el calck que recibe errro y la pw cifrada
            bcrypt.hash(userToSave.password!, 10, (error, pwd) => {
                userToSave.password = pwd;
                guardar usuario en la bd
                return res.status(200).json({
                    status: 'success',
                    message: 'Registro de usuario',
                    userToSave
                });
            }
            */

            //cifrar la contraseña de manera mas directa medaite promesas
            let pwd = await bcrypt.hash(params.password, 10);
            params.password = pwd;

            //crear objeto de usuario
            let userToSave = new user(params);
            //guardar en la bd directamente
            userToSave.save();
            return res.status(200).json({
                status: 'success',
                message: 'Registro de usuario',
                userToSave,
            });


        }).catch((error) => {
            return res.status(500).json({
                status: 'error',
                message: 'error en la consulta de usuarios',
                error
            });
        })

    } catch(error){
        return res.status(500).json({
            status: "error",
            message: "No se ha registrado el usuario"
        });
    };

}

