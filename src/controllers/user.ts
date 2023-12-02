
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/user';
import { createToken } from '../services/jwt'
import paginate from 'mongoose-paginate-v2';

// extender el tipo Request para incluir la propiedad user y que no de error, 
//ya que TypeScript no reconoce la propiedad user 
declare module 'express' {
    //extender el module express para poder probar en el endpoint y consultar los usuarios
    interface Request {
        user?: typeof User; // Asegúrate de que User sea el tipo correcto para tus usuarios
    }
}
//metodos de pruebas
export const pruebaUser = (req: Request, res: Response) => {

    return res.status(200).json({
        message: 'mensaje enviado desde el controlador user',
        user: req.user
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
        }).select({ 'password': 0 }).then(async (users) => {
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

//perfil

export const profile = (req: Request, res: Response) => {
    //recibe parametros del id del usuario por url
    const id = req.params.id;
    //consulta para sacar los datos del usuario
    User.findById(id).select({ 'password': 0, 'role': 0 }).exec().then((userProfile: any) => {
        //posteriormente devolver informacion de follows
        return res.status(200).json({
            status: "success",
            user: userProfile
        })
    }).catch((error: any) => {
        return res.status(404).json({
            status: "error",
            error,
            message: 'No existe el usuario'
        });
    });
    //devolver el resultado

}

//listado de usuarios paginados
export const list = async (req: Request, res: Response) => {
    try {
        //controlar en que ruta estamos

        let page = 1;
        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        //consulta con mongoose para contar el total de usuarios
        const total = await User.countDocuments();
        //calcular el indice de inicio de la paginacion
        let itemPage = 5;
        const starIndex = (page - 1) * itemPage;

        //realziar la consulta para obtener los usuarios de papagina actual
        const user = await User.find().sort('_id').skip(starIndex).limit(itemPage);
        /*
        skip(startIndex) se asegura de que se omitan los primeros 5 documentos 
        (en el caso de que startIndex sea 5) antes de comenzar a recuperar los siguientes 5 documentos 
        (según el valor de itemPerPage). Esto facilita la implementación de la paginación, 
        ya que puedes controlar qué "página" de resultados estás recuperando.
        */


        //posteriormente info de seguimiento

        return res.status(200).json({
            status: "success",
            message: 'ruta de Listado de usuarios',
            user,
            page,
            itemPage,
            total,
            pages: Math.ceil(total / itemPage)

        })

    } catch (error) {
        return res.status(404).json({
            status: error,
            message: 'error al obtener el numero de usuarios'
        });

    }


}

//metodo para actualziar el usuario
export const update = async (req: Request, res: Response) => {
    //recoger info del usuario
    const userToUpdate = req.body;
    const userIdentiti = req.user as any;//usando aserscion de tipos
    //elimimar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;
    //comprobar si el usuario existe
    User.find({
        $or: [
            { email: userToUpdate.email!.toLocaleLowerCase() },
            { nick: userToUpdate.nick!.toLocaleLowerCase() }
        ]
    }).select({ 'password': 0 }).then(async (users) => {
        //comprar el email y el nick para poder actualizar el objeto
        let userIsset = false;
        //recorrer los usuarios
        users.forEach(user => {
            //evalua si el usuario existe y el user usuario.id
            if (user && user._id !== userIdentiti!.id) userIsset = true;
        });
        if (userIsset) {
            return res.status(200).json({
                status: 'success', message: 'el usuario ya existe'
            });

        }


        //cifrar la contraseña de manera mas directa medaite promesas
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;

        }
        //buscar y actualizar
        await User.findByIdAndUpdate(userIdentiti.id, userToUpdate, { new: true }).then(async (userUpdate) => {
            return res.status(200).json({
                status: 'success', message: 'Usuario actualziado correctamente', userUpdate
            });

        }).catch((error) => {
            return res.status(500).json({
                status: 'error',
                message: 'error al actualizar usuarios',
                error
            });;

        });
    });
}