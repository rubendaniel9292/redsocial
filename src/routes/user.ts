
import express from 'express';
import { register, pruebaUser, login, profile, list, update } from '../controllers/user';
import { auth } from '../middlewares/auth';

const routerUser = express.Router();

//definir rutas

routerUser.get('/prueba-usuario', auth, pruebaUser);
routerUser.post('/registro', register);
routerUser.post('/login', login);
//rutas que requieren autenticacion
routerUser.get('/profile/:id', auth, profile);
routerUser.get('/list/:page?', list);

routerUser.put('/update', auth, update);
export default routerUser;
