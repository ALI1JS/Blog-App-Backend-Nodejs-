import {commentModel, relpyModel} from "./index.mjs"

// every one
export function addReply (req, res)
{
    const {reply, commentID} = req.body;

    const newReply = new relpyModel({
       reply,
       author:req.user.userID
    })

    newReply.save()
    .then((saved)=>{
       
         if (saved)
         {
            commentModel.findByIdAndUpdate({_id: commentID},{ $push: { replies: saved._id } })
            .then((added)=>{
                if (added)
                {
                    return res.status(200).json({message: saved})
                }
            })

         }
    
        else
         return res.status(400).json({message:"the reply doesn't saved or added"});
    })
    .catch((er)=>{
        return res.status(500).json({message:errorMonitor.message});
    })

}

// only the owner or the admin
export function editReply(req, res)
{
    const {newData, replyID} = req.body;

    relpyModel.findByIdAndUpdate(replyID, {reply: newData})
    .then((reply)=>{
       
        if (reply)
          return res.status(200).json({message: "updated"});

        else
          return res.status(400).json({message:"the reply was not updated"});
    })
    .catch((err)=>{
        return res.status(500).json({message: err.message});
    })
}

// only the owner or the admin
export function deleteReply( req, res)
{
    const {commentID, replyID} = req.body;

    relpyModel.findByIdAndDelete(replyID)
    .then((deleted)=>{
        if (deleted)
        {
            commentModel.findByIdAndUpdate(commentID, {$pull:{replies: replyID}})
            .then((updated)=>{
                if (updated)
                  return res.status(200).json({message: "deleted successfully"});
            })
        }

        else
          return res.status(404).json({message:"the reply not found"});
    })
    .catch((error)=>{
        return res.status(500).json({message:error.message});
    })
}