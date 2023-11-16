import { Schema, model } from "mongoose";


const reportSchema = new Schema({
    why:{
        type:String,
        required:true
    },

    reporterID:{
        type:Schema.Types.ObjectId,
        required:true
    },
  
    reportedID:{
        type:Schema.Types.ObjectId,
        required:true
    }

})


const reportModel = model("Reports", reportSchema);

export {reportModel};