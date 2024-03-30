import connection from "./database/connection";
import express from "express";
import cors from 'cors';

import routerUser from "./routes/user";
import routerFollow from "./routes/follow";
import routerPublication from "./routes/publication";
import dotenv from 'dotenv';
import helmet from 'helmet';
// Cargar variables de entorno desde el archivo .env
dotenv.config();
console.log('api arrandada');

connection();
//creacion del servidor

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));  // Ayuda a proteger aplicaciones Express
//const ip = process.env.IP; 
const port = process.env.HTTP_PORT;
const portS = process.env.HTTPS_PORT;

//configuracion de cors
app.use(cors

    ({
        origin: '0.0.0.0', // tu dominio, ip o '0.0.0.0' para permitir cualquier origen
        credentials: true, // Indica si se permiten credenciales (cookies, tokens de autenticación)
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
        allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados HTTP permitidos
    }));




//convertir los datos del body a objetos JSON
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

app.use('/api/user', routerUser);
app.use('/api/publication', routerPublication);
app.use('/api/follow', routerFollow);


//escuchar peticiones http
app.listen(port, () => {
    console.log('servidor de node corriendo correctamente');
})
//escuchar peticiones https (en produccion con el certificado ssl/tsl instalado)
app.listen(portS, () => {
    console.log('servidor de node corriendo correctamente');
});