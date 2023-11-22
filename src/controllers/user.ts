
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/user';
import createToken from '../services/jwt'


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
        User.find({
            $or: [
                { email: params.email!.toLocaleLowerCase() },
                { nick: params.nick!.toLocaleLowerCase() }
            ]
        }).select({ 'password': 0 }).exec().then(async (users) => {
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
            let userToSave = new User(params);
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

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se ha registrado el usuario"
        });
    };

}

//login
export const login = async (req: Request, res: Response) => {
    try {
        //recoger parametros
        let params = req.body;
        if (!params.email || !params.password) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        //buscar en la bd si existe el email o usuario
        const userRecord = await User.findOne({ email: params.email });
        if (!userRecord || !userRecord.password) {
            return res.status(400).json({
                status: 'error',
                message: 'no existe el usuario o la contraseña es nula'
            });
        }
        //compprobar su contraseña, devuelve token y datos de usuario
        const pwd = await bcrypt.compare(params.password, userRecord.password!);
    
        if (!pwd) {
            return res.status(400).json({
                status: 'error',
                message: 'Contraseña incorrecta'
            });
        }
        //conseguir token
        const token = createToken(userRecord);
        //devuelte datos del usuario
        return res.status(200).json({
            status: 'success',
            message: 'Login exitoso',
            //user: {id: User._id, name: User.name, nick: User.nick },//hacerlo de esta manera da error de que el id y nick no se encuentra en el modelo
            userRecord,
            token
        });
    } catch (error) {
        console.error('Error en la comparación de contraseñas:', error);
        return res.status(400).json({
            status: 'error',
            message: 'Ocurrio un error durante el inicio de sesion',
        });
    };
}

