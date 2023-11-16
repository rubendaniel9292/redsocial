import { Request, Response } from 'express';
//metodos de pruebas
const pruebaUser = (req: Request, res: Response) => {
    return res.status(200).send({
        message: 'mensaje enviado desde el controlador user'
    });

};

export default pruebaUser;