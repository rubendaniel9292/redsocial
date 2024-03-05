import { followsUsersId } from '../services/followServices';
import { Request, Response } from 'express';
import publication from '../models/publication';
import fs from 'fs';
import path from 'path';

import mongoose from 'mongoose';


//metodos de pruebas
export const pruebaPublicaion = (req: Request, res: Response) => {
    return res.status(200).send({
        message: 'mensaje enviado desde el controlador publication'
    });

};

//1: guardar las publicaciones

export const save = async (req: Request, res: Response) => {
    try {
        //recoger datos del body, sino llegar dar respuesta negativa
        const params = req.body;
        if (!params.text) return res.status(400).send({
            status: 'error',
            message: 'debes enviar el texto de la publicacion'
        });
        //crear el objeto y rellenarlo
        let newPublicacion = new publication(params);
        newPublicacion.user! = (req.user! as any).id;


        //guardar el objeto de la bd
        await newPublicacion.save();
        return res.status(200).send({
            status: 'success',
            message: 'articulo guardado correctaente',
            newPublicacion
        });

    } catch (error) {
        return res.status(404).send({
            status: 'error',
            message: 'no se ha guarado la publicacion guardada'
        });
    }

}

//2: sacar una sola ublicacion listar 
export const detail = async (req: Request, res: Response) => {
    try {
        const publicationId = req.params.id;
        let publicationStored = await publication.findById(publicationId);
        if (!publicationStored) return res.status(404).send({
            status: 'error',
            message: 'no existe la publicacion'
        });
        return res.status(200).send({
            status: 'success',
            message: 'detalle de publicacion',
            publication: publicationStored

        });

    } catch (error) {
        return res.status(404).send({
            status: 'error',
            message: 'no error al listar la publicacion'
        });
    }
}

//3: todas las publicaciones
export const remuvePublication = async (req: Request, res: Response) => {
    try {
        //sacar el id de la publicacion a borrar solo la publicacon que  haya hecho un usuario
        const publicationId = req.params.id;
        await publication.findOneAndDelete({ 'user': (req.user! as any).id, '_id': publicationId });

        return res.status(200).send({
            status: 'success',
            message: 'publicacion eliminada correctamente',
            publicationId
        });
    } catch (error) {
        return res.status(404).send({
            status: 'error',
            message: 'no se ha elimiano la publicacion'
        });
    }
}


//4: listar las publicaciones de un usuario en concreto, de su perfil
export const userPublication = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        //consulta con mongoose para contar el total de usuarios
        const total = await publication.countDocuments();
        //calcular el indice de inicio de la paginacion
        let page = 1;
        if (req.params.page) page = parseInt(req.params.page);
        let itemPage = 5;
        const starIndex = (page - 1) * itemPage;

        //find, populate, ordenar de mas reciente a mas vieja, paginar
        const publications = await publication.find({ 'user': userId }).sort('-created_at')
            .populate('user', '-password -__v -role -email')//saber a que usuario creo esa publicacion, y quitar info innecesario de ese usuario
            .skip(starIndex).limit(itemPage);


        return res.status(200).send({
            status: 'success',
            message: 'lista de pblicaciones del usuario',
            publications: publications,
            total,
            pages: Math.ceil(total / itemPage)

        });

    } catch (error) {
        return res.status(404).send({
            status: 'error',
            message: 'no se ha listado la publicacion del usuario'
        });
    }
}

//5: subir archivos
export const upLoap = async (req: Request, res: Response) => {
    try {
        //sacar el publication id
        const publicationId = req.params.id;
        //recoger imagenes y comprobar si existen
        if (!req.file && !req.files) return res.status(400).json({
            status: "error",
            message: "Peticion no incluye imagen"
        });

        //conseguir el nombre del archivos

        let nameFile = req.file!.originalname;//con ! le decimos a TS que el req.file no es indefinido, de lo contrardio dara error
        let fileSplit = nameFile.split('\.');
        let nameExt = fileSplit[1];//segundo indice del nombre del arhivo despues de separarlo
        //4: validar si la extencion correcta, sino se cumple lo eliminamos con un metodo nativo de node unlink
        if (nameExt !== 'png' && nameExt !== 'jpg'
            && nameExt !== 'jpeg' && nameExt !== 'svg'
            && nameExt !== 'gif') {
            const filePath = req.file!.path;

            fs.unlinkSync(filePath);
            /*otra manera
              fs.unlink(req.file!.path, (error) => {
                return res.status(400).json({
                    status: "error",
                    error,
                    extencion: nameExt,
                    message: "Formato de archivo no válido"
                });
            })
             */
            return res.status(400).json({
                status: "error",
                extencion: nameExt,
                message: "Formato de archivo no válido"
            });

        } else {
            //5: actualiza el articulo si todo sale bien del usuario identificado y de una publicacion
            let id = (req.user as any).id;// Realiza un cast a 'any' para acceder a '_id'
            const publicationUpDated = await publication.findOneAndUpdate({ 'user': id, '_id': publicationId }, { file: req.file!.filename }, { new: true });
            if (!publicationUpDated) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la subida del archivo",
                    user: req.user,

                });
            }
            console.log(publicationUpDated);
            return res.status(200).send({
                status: "success",
                message: 'archivo de avatar subido correctamente',
                publication: publicationUpDated,
                file: req.file,
            });
        }

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al subir la imagen',
            error

        });

    }
}
//6:  devolver archivos multimedia
export const mediaPost = (req: Request, res: Response) => {
    //sacar el parametro de a url
    const file = req.params.file;
    //montar el path real de la imagen
    const filePath = './dist/uploads/publications/' + file;
    //const filePath = path.resolve(__dirname, 'uploads', 'avatars', file);

    //comprobar que el archivo existe
    fs.stat(filePath, (error, exist) => {
        if (!exist) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe la imagen',
                error
            })
        }
        //devolver un archivo
        return res.sendFile(path.resolve(filePath));
    });



}
//7: listar publicacioens del feed (usuarios que estoy siguiende)
export const feedPublication = async (req: Request, res: Response) => {
    try {
        let userId = (req.user as any).id;
        if (userId) {
            //comprobar si me llega la pagina
            let page = 1;
            if (req.params.page) page = parseInt(req.params.page);
            //definir usuario por pagina
            const itemPerPage = 5;
            //Puede ser más adecuado para situaciones donde la paginación es simple y directa
            const total = await publication.countDocuments();
            //calcular el indice de inicio de la paginacion
            let itemPage = 5;
            const starIndex = (page - 1) * itemPage;

            /* UNA MANERA DE OBETER EL LISTADO DE USUARIOS QUE SIGO Y SUS PUBLICACIONES
            const followsResult: false | { following: (mongoose.Types.ObjectId | null | undefined)[]; followers: (mongoose.Types.ObjectId | null | undefined)[]; } = await followsUsersId(userId);
 
             if (!followsResult || !followsResult.following) {
                 return res.status(403).send({
                     status: "error",
                     message: 'No se pudo obtener el userId del usuario autenticado',
                 });
             }
             // Filtrar null y undefined de la matriz
             const myFollowing = followsResult.following.filter(f => f) as mongoose.Types.ObjectId[];
            */
            /*OTRA MANERA:  verifica tanto si followsResult es falsy (como null o undefined) 
            como si followsResult.following es falsy antes de intentar acceder a followsResult.following. 
            Si followsResult es false, no se intentará acceder a followsResult.following y evitará el error que estás enfrentando. */
            const followsResult = await followsUsersId(userId);

            if (!followsResult || !followsResult.following) {
                return res.status(403).send({
                    status: "error",
                    message: 'No se pudo obtener el userId del usuario autenticado',
                });
            }
            const myFollowing = followsResult.following.filter(Boolean) as mongoose.Types.ObjectId[];

            const publications = await publication.find({
                //user: { $in: myFollowing }
                user: myFollowing
            }).populate('user', '-password -role -__v -email')
                .sort('-created_ad')
                .skip(starIndex).limit(itemPage);
            if (!publications) return res.status(500).send({
                status: "error",
                message: 'No hay publicaciones para mostrar'
            });
            console.log('Publications:', publications);
            return res.status(200).send({
                status: "success",
                message: 'Feed de publicaciones',
                userId: myFollowing,
                publications: publications,
                total,
                pages: Math.ceil(total / itemPerPage),
            });
        } else {
            return res.status(403).send({
                status: "error",
                message: 'No se pudo obtener el userId del usuario autenticado',
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: 'ocurrio un error durante la carga del feed',
        });
    }

}
