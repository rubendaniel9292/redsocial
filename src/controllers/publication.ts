import { Request, Response } from 'express';
//metodos de pruebas
const pruebaPublicaion = (req: Request, res: Response) => {
    return res.status(200).send({
        message: 'mensaje enviado desde el controlador publication'
    });

};

export default pruebaPublicaion;