import {Schema, model} from "mongoose";



const tokenSchema = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        require:true
    },

    token:{
        type:String,
        require:true
    }
});

const tokenModel = model("Tokens", tokenSchema);

export {tokenModel};
