import jwt from 'jwt-simple';
import moment from 'moment';
import crypto from 'crypto';


//clave secreta aleatoria y rotativa mediante metodo crypto
export const secret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

//funcion para crear token
export const createToken = (user: any) => {
    const payLoad = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        ite: moment().unix(),//hace referencia al momento que se crea este objeto
        exp: moment().add(30, 'days').unix()//hace referencia al tiempo de expiracion
    }
    //devolver el token jwt codificado
    return jwt.encode(payLoad, secret);

}

