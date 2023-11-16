
import { articleModel } from "../src/model/articlmodel.mjs";
import { commentModel, relpyModel } from "../src/model/commentmodel.mjs";

export async function DeleteManyComments (articleIds)
{
    try {
          
           const articles = await articleModel.find({_id: {$in: articleIds}});
            const commentIds = [];
            const commentIds2 = [];

           if (articles.length === 0)
             return false;
            
            articles.forEach(article =>{
                commentIds.push(...article.comments)

            });

            commentIds.forEach(id =>{
                commentIds2.push(id.toString());
            })
            
            const comments = await commentModel.find({ _id: { $in: commentIds2 } });
            
            if (comments) {

                const repliesIDS = [];

                comments.forEach(commnet => {
                    
                    if (commnet.replies && commnet.replies.length > 0) {
                        repliesIDS.push(...commnet.replies);
                    }
                })
                 
                const deletedReplies = await relpyModel.deleteMany({ _id: { $in: repliesIDS } });
                
                if (deletedReplies.deletedCount >= 0) {
                    await commentModel.deleteMany({_id: {$in : commentIds2}})

                    articles.forEach(async article =>{
                        
                        article.comments = [];
                        await article.save();
                    }) 

                    return ("Success");
                }
            }
            else
              return ("replies not found");

    } catch (error) {
        return error.message;
    }
}