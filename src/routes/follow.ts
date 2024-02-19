import express  from 'express';
import { auth } from '../middlewares/auth';
import {folloWers, folloWing, pruebaFollow,  save, unFollow } from '../controllers/follow';

const routerFollow = express.Router();

//definir rutas
routerFollow.get('/prueba-follow', pruebaFollow);
routerFollow.post('/save', auth, save);
routerFollow.delete('/unfollow/:id', auth, unFollow);

routerFollow.get('/following/:id?/:page?',auth, folloWing);
routerFollow.get('/followers/:id?/:page?',auth, folloWers);

export default routerFollow;
