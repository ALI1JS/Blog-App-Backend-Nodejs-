import {Schema, model} from "mongoose";


const articlSchema = new Schema({
    authorID:{
        required:true,
        type: Schema.Types.ObjectId,
        ref:"Users"
    },

    title:{
        required:true,
        type:String
    },

    desc:String,
    
    body:{
        type:[
            {
                subtitle:String,
                para:String
            }
        ]
        ,
        required:true
    },
    
    createdAt:{
        type:Date,
        default: Date.now()
    },
    
    updatedAt:{
        type: Date,
        default: Date.now()
    },

    coverImage:String,
    tags:{
        type:[String],
        default:[]
    },
    comments:{
        type:[Schema.Types.ObjectId],
        ref:"Comments",
        default: []
    },

    claps:{
        type:[Schema.Types.ObjectId],
        ref:"Claps",
        default:[]
    },
    catogry:{
        type:String,
        required:true,
    }
})

articlSchema.index({title:"text", desc:"text", body:"text"});

const articleModel = model("Articls", articlSchema)

export {articleModel}
