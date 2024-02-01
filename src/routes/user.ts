
import express from 'express';
import { register, pruebaUser, login, profile, list, update, upLoap, avatar, counters } from '../controllers/user';
import { auth } from '../middlewares/auth';
import multer from 'multer';

const routerUser = express.Router();

//confuguracion de subida
const storage = multer.diskStorage({
    //La carpeta donde se guardó el archivo, cb: el directorio del archivo 
    /*
    process.cwd() se está utilizando para obtener la ruta del directorio de trabajo actual del proceso 
    y luego se concatena con '/dist/img/articles'. 
    Esto construye la ruta completa del directorio de destino donde se guardarán los archivos.
    */
    //destination se utiliza para determinar en qué carpeta se almacenarán los archivos subidos.
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/dist/uploads/avatars');
    },
    //El nombre del archivo en destination, 
    //filename es usado para determinar cómo debería ser nombrado el archivo dentro de la carpeta.
    filename: function (req, file, cb) {
        cb(null, 'avatar' + '-' + file.fieldname + Date.now() + file.originalname)
        //cb(null, file.fieldname  + '-' + Date.now() + file.originalname)//manera de la documetnacion
    }
});

//definir rutas

routerUser.get('/prueba-usuario', auth, pruebaUser);
routerUser.post('/registro', register);
routerUser.post('/login', login);
//rutas que requieren autenticacion
routerUser.get('/porfile/:id', auth, profile);
routerUser.get('/list/:page?', list);

routerUser.put('/update', auth, update);

//midelwere que se aplicara a la ruta y se ejecuta antes de la accion del controlador
const upload = multer({ storage: storage });
routerUser.post('/upload', [auth, upload.single('file')], upLoap);

routerUser.get('/avatar/:file', avatar);
routerUser.get("/counters/:id", auth, counters);
export default routerUser;
