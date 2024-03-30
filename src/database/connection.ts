import mongoose from "mongoose";
import fs from 'fs';
const connection = async () => {
    try {
        const connectionString = process.env.DATABASE_URL;
        //await mongoose.connect('mongodb://127.0.0.1:27017/mi_redsocial'); //para conectarse local
        //await mongoose.connect('connectionString!'); //para conectarse con variable de entorno 
        await mongoose.connect(connectionString!);
        console.log('conexion a BD exitosa');
        // Registrar la conexión exitosa en un archivo de registro
        fs.appendFileSync('conexion.log', 'Conexion a BD exitosa\n');

    } catch (error) {
        console.error(error);
        // Registrar la conexión fallida en un archivo de registro
        fs.appendFileSync('conexion.log', 'Conexion a BD fallida\n');
        throw new Error("No se ha podido conectar a la base de datos");

    }
}
export default connection;