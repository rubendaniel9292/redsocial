import express  from 'express';
import { auth } from '../middlewares/auth';
import multer from 'multer';

import { save, pruebaPublicaion, remuvePublication, userPublication, detail, upLoap, mediaPost, feedPost } from '../controllers/publication';

const routerPublication = express.Router();

//definir rutas
routerPublication.get('/prueba-publication', pruebaPublicaion);
routerPublication.get('/detail/:id', detail, auth);
routerPublication.post('/save', auth, save);
routerPublication.delete('/remove/:id', auth, remuvePublication);
routerPublication.get('/user/:id', userPublication, auth);


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
        cb(null, process.cwd() + '/dist/uploads/publications');
    },
    //El nombre del archivo en destination, 
    //filename es usado para determinar cómo debería ser nombrado el archivo dentro de la carpeta.
    filename: function (req, file, cb) {
        cb(null, 'pub' + '-' + file.fieldname + Date.now() + file.originalname)
        //cb(null, file.fieldname  + '-' + Date.now() + file.originalname)//manera de la documetnacion
    }
});

//midelwere que se aplicara a la ruta y se ejecuta antes de la accion del controlador
const upload = multer({ storage: storage });
routerPublication.post('/upload/:id', [auth, upload.single('file')], upLoap);
routerPublication.get('/media/:file', mediaPost, auth);
routerPublication.get('/feed', feedPost, auth);
export default routerPublication;
