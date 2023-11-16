import { Schema, model } from "mongoose";


const commentSchema = new Schema({
    comment:{
       type:String,
       required:true
    },
    date:{
        type:Date,
        default: Date.now()
    },
    replies:{
        type:[ Schema.Types.ObjectId],
        ref:"Replies",
        default:[]
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    }
});

const repliesSchema = new Schema({
    reply:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    }
})


const commentModel = model("Comments", commentSchema);
const relpyModel = model("Replies", repliesSchema);

export {
    commentModel,
    relpyModel
}