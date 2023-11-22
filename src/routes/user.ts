import express  from 'express';
import { register,pruebaUser, login } from '../controllers/user';

const routerUser = express.Router();

//definir rutas

routerUser.get('/prueba-usuario', pruebaUser);
routerUser.post('/registro', register);
routerUser.post('/login', login);



export default routerUser;
