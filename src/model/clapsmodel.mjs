import { Schema, model } from "mongoose";



const clapsSchema = new Schema({
    clapNum:Number,
    ownerID: Schema.Types.ObjectId
});


const clapsModel = model("Claps", clapsSchema);

export {clapsModel};