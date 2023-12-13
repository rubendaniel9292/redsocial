import { Request, Response } from 'express';
import follow from '../models/follow';
import user from '../models/user';
//metodos de pruebas
export const pruebaFollow = (req: Request, res: Response) => {
    return res.status(200).send({
        message: 'mensaje enviado desde el controlador follow'
    });

};

//metodo de seguir usurio
export const save = async (req: Request, res: Response) => {
    try {
        //conseguir los datos del body
        const params = req.body;
        //obeter el usuario identificado
        const identity = req.user as any;
        // Verificar si el usuario identificado ya sigue al otro usuario
        const existingFollow = await follow.findOne({
            user: identity.id,
            followed: params.followed
        });
        if (existingFollow) {
            // El usuario ya sigue al otro usuario
            return res.status(400).json({
                status: 'error',
                message: 'Ya sigues a este usuario.'
            });
        }
        //crear objeto del modelo follow
        let userToFollow = new follow({
            user: identity.id,
            followed: params.followed
        });
        const followStored = await userToFollow.save();
        return res.status(200).send({
            status: 'succes',
            message: 'Metodo dar follow: usuario seguido exitosamente',
            identity: req.user,
            followStored
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se ha registrado el segimiendo de usuario"
        });
    }

}


//metodo de dejar de seguir
export const unFollow = async (req: Request, res: Response) => {
    try {
        //recoger el id del usuario identificado
        const identity = (req.user as any).id;
        //recoger el id del usuario que quiero dejar de seguir
        const followedId = req.params.id;
        //hacer find de las coincidencias
        let result = await follow.findOneAndDelete({
            user: identity,
            followed: followedId
        });
        console.log(result);
        if (result) {
            // Accede al documento eliminado utilizando result
            return res.status(200).json({
                status: "success",
                message: "Follow eliminado correctamente",
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "No se encontró la relación de seguimiento para eliminar"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se ha eliminado el segimiendo de usuario"
        });
    }
    ;
}
//listado de usuarios que sigo
//listaod de usuarios que me siguen


