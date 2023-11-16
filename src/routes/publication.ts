import express  from 'express';

import pruebaPublicaion from '../controllers/publication';

const routerPublication = express.Router();

//definir rutas
routerPublication.get('/prueba-publication', pruebaPublicaion);

export default routerPublication;
