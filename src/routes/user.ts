import express  from 'express';

import pruebaUser from '../controllers/user';

const routerUser = express.Router();

//definir rutas
routerUser.get('/prueba-usuario', pruebaUser);

export default routerUser;
