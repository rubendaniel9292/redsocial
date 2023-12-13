import { Schema, model, Document } from "mongoose";

const followSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    followed: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now,
    }

});

export default model('Follow', followSchema, 'follows');//nombre del modelo, formato del modelo (esquema), nombre de la coleccion de datos