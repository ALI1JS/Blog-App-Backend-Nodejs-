import {Schema,model} from "mongoose";



const userSchema = new Schema({
 
    username:{
        required:true,
        type:String
    },

    email:{
        required:true,
        type:String
    },

    password:{
        required:true,
        type:String
    },
    jopTitle:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    avatar:String,

    followers:{
        type:[Schema.Types.ObjectId],
        default:[]
    },

    following:{
        type:[Schema.Types.ObjectId],
        default:[]
    },

    saveList:{
      type:[Schema.Types.ObjectId],
      default:[] 
    },

    reportsList:{
      type:[Schema.Types.ObjectId], 
      ref:"Reports",
      default:[]
    },

    role:{
        type:String,
        required:true,
        default:"user"
    },
    verified:{
        type:Boolean,
        required:true,
        default:false
    }

});

userSchema.index({username:"text", jobTitle:"text", desc:"text"});

const userModel = model('Users', userSchema);

export {
    userModel 
}