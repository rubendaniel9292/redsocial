import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String, require: true
    },
    surname: {
        type: String, require: true
    },
    nick: {
        type: String, require: true
    },
    email: {
        type: String, require: true
    },
    password: {
        type: String, require: true
    },
    role: {
        type: String, default: 'role_user'
    },
    image: {
        type: String, default: 'default.png'
    },
    created_at: {
        type: Date, default: Date.now
    }

});
export default model('User', userSchema, 'users');//nombre del modelo, formato del modelo (esquema), nombre de la coleccion de datos