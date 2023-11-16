import mongoose from "mongoose";
const connection = async ()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_redsocial');
        console.log('conexion a BD exitosa');

    }catch(error){
        console.error(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}
export default connection;