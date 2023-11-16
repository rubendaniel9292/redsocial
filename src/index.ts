import connection from "./database/connection";
import express from "express";
import cors from 'cors';

import routerUser from "./routes/user";
import routerFollow from "./routes/follow";
import routerPublication from "./routes/publication";

console.log('api arrandada');
connection();
//creacion del servidor
const app = express();
const port = 3900;

//configuracion de cors
app.use(cors());
//convertir los datos del bodey a objetos JSON
app.use(express.json());
//decodificar los datos que llegen de un formulario normal(url encode)
app.use(express.urlencoded({ extended: true }));

//ruta de prueba
app.get('/ruta-prueba', (req, res) => {
    return res.status(200).json({
        id: 1,
        nombre: 'daniel ruben rivas'
    });
})

//configuracion de rutas

app.use('/api', routerUser);
app.use('/api', routerPublication);
app.use('/api', routerFollow);


//escuchar peticiones http
app.listen(port, () => {
    console.log('servidor de node corriendo en el puerto ', port);
})
