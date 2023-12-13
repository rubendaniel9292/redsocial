import express  from 'express';
import { auth } from '../middlewares/auth';
import {pruebaFollow,  save, unFollow } from '../controllers/follow';

const routerFollow = express.Router();

//definir rutas
routerFollow.get('/prueba-follow', pruebaFollow);
routerFollow.post('/save', auth, save);
routerFollow.delete('/unfollow/:id', auth, unFollow);

export default routerFollow;
