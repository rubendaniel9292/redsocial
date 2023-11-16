import express  from 'express';

import pruebaFollow from '../controllers/follow';

const routerFollow = express.Router();

//definir rutas
routerFollow.get('/prueba-follow', pruebaFollow);
export default routerFollow;
