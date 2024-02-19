import mongoose from "mongoose";
const connection = async ()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_redsocial'); //para local
        //await mongoose.connect('mongodb+srv://rubendaniel9220:2AFm44eetoAuYAO3@red-social.apepkco.mongodb.net/');

        console.log('conexion a BD exitosa');

    }catch(error){
        console.error(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}
export default connection;