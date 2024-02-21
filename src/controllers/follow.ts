import { followsUsersId, followThisUser } from '../services/followServices';
import { Request, Response } from 'express';
import follow from '../models/follow';


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
        console.log('identity.id:', identity.id);
        console.log('params.followed:', params.followed);

        const existingFollow = await follow.findOne({
            user: identity.id,
            followed: params.followed
        });
        
        if (existingFollow) {
            console.log('existe el follow: ',existingFollow);
            // El usuario ya sigue al otro usuario
            return res.status(400).json({
                status: 'error',
                message: 'Ya sigues a este usuario.'
            });
        }
        //crear objeto del modelo follow
        let userToFollow = new follow({
            user: identity.id,
            followed: params.followed,
            //followed: new mongoose.Types.ObjectId(params.followed),
        });
        const followStored = await userToFollow.save();
        return res.status(200).send({
            status: 'success',
            message: 'Metodo dar follow: usuario seguido exitosamente',
            identity: req.user,
            follow: followStored
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
//accion listado de usuarios que cualquier usuario esta siguiendo
export const folloWing = async (req: Request, res: Response) => {
    try {
        //sacar el id del usuaio dentificado
        let identity = (req.user as any).id;
        //comprobar si me llega el id de la url
        if (req.params.id) identity = req.params.id;
        //comprobar si me llega la pagina
        let page = 1;
        if (req.params.page) page = parseInt(req.params.page);
        //definir usuario por pagina
        const itemPerPage = 5;
        //Puede ser más adecuado para situaciones donde la paginación es simple y directa
        const total = await follow.countDocuments();
        //calcular el indice de inicio de la paginacion

        const starIndex = (page - 1) * itemPerPage;
        let result = await follow.find({ user: identity })
            .populate('user followed', '-password -role -__v -email')
            .skip(starIndex).limit(itemPerPage);
        //listado de usuarios me siguen a mi mediante un array de usuario de los que me siguen y sigo como identificado
        let followuserid = await followsUsersId(identity);
        return res.status(200).json({
            status: "success",
            message: "Listado de usuario que estoy siguiendo",
            follows: result,
            total,
            pages: Math.ceil(total / itemPerPage),
            user_following: followuserid ? followuserid.following : [],
            user_follower: followuserid ? followuserid.followers : []
            
        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se ha cargado el listados de usuario"
        });

    }
}
//listaod de usuarios que siguen a cualquier otro usuario (soy seguido mis seguidores)

export const folloWers = async (req: Request, res: Response) => {
    try {
        //sacar el id del usuaio dentificado
        let identity = (req.user as any).id;
        //comprobar si me llega el id de la url
        if (req.params.id) identity = req.params.id;
        //comprobar si me llega la pagina
        let page = 1;
        if (req.params.page) page = parseInt(req.params.page);
        //definir usuario por pagina
        const itemPerPage = 5;

        //Puede ser más adecuado para situaciones donde la paginación es simple y directa
        const total = await follow.countDocuments();
        //calcular el indice de inicio de la paginacion
        //let itemPage = 5;
        const starIndex = (page - 1) * itemPerPage;
        //consultar usuarios seguidos
        let result = await follow.find({ followed: identity })
            .populate('user followed', '-password -role -__v -email')
            .skip(starIndex).limit(itemPerPage);
        //listado de usuarios me siguen a mi mediante un array de usuario de los que me siguen y sigo como identificado
        let followuserid = await followsUsersId(identity);
        return res.status(200).json({
            status: "success",
            message: "Listado de usuario que me siguen",
            follows: result,
            total,
            pages: Math.ceil(total / itemPerPage),
            user_following: followuserid ? followuserid.following : [],
            user_follower: followuserid ? followuserid.followers : []
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se ha cargado el listado de usuarios que siguen a cualquier otro usuario"
        });
    }
}

