import { DeleteManyComments } from "../../utlits/deletemanyComments.mjs";
import { articleModel, commentModel, relpyModel, userModel } from "./index.mjs";




export async function ClearUsers (req, res)
{
   try {
        
        const deletedUsers = await userModel.deleteMany({});

            if (deletedUsers.length === 0);
                return res.status(404).json({ message: "No users were deleted" });

            return res.status(200).json({ message: "Success" });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function ClearArticles (req, res)
{
    try {
        
        const deletedArticles = await articleModel.deleteMany({});
        const deletedComments = await commentModel.deleteMany({});
        const deletedReplies = await relpyModel.deleteMany({});

        if (deletedArticles.length === 0 && deletedComments.length === 0 && deletedReplies.length ===0)
            return res.status(404).json({ message: "No articles were deleted" });

        return res.status(200).json({ message: "Success you clear all article and its comments and replies in this system" });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function ClearComments (req, res)
{
    const articleIds = [req.query.id];

    
    try {
        
      const result  = await DeleteManyComments(articleIds);
     
       return res.json(result);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    
}

export async function ClearReplies (req, res)
{
    const {commentId} = req.body;
    try {
        
       const comment = await commentModel.findById(commentId);
        
       if (comment && comment.replies.length > 0)
       {
           const deletdReplies = await relpyModel.deleteMany({_id: {$in : comment.replies}})

           if (deletdReplies.deletedCount > 0)
           {
               comment.replies = [];
               await comment.save();
               return res.status(200).json({message:"All Replies deleted successfully"})
               
           }

          return res.status(500).json({message:"Cann't be deleted"})

       }
       
       return res.status(404).json({message:"No such comment"});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


