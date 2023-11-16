import { Request, Response } from 'express';
//metodos de pruebas
const pruebaFollow = (req: Request, res: Response) => {
    return res.status(200).send({
        message: 'mensaje enviado desde el controlador follow'
    });

};

export default pruebaFollow;