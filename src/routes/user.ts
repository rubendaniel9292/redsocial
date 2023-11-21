import express  from 'express';



import { register,pruebaUser } from '../controllers/user';

const routerUser = express.Router();

//definir rutas

routerUser.get('/prueba-usuario', pruebaUser);
routerUser.post('/registro', register);



export default routerUser;
