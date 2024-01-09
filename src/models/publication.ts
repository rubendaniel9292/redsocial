import { Schema, model } from "mongoose";
const publicationSchema = new Schema({
    //usuario relacionado a esa publicacion
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    text: {
        type: String, require: true
    },
    file: String,
    created_at: {
        type: Date, default: Date.now
    }

});
export default model('Publications', publicationSchema, 'publications');