import { articleModel } from "../src/model/articlmodel.mjs";
import { commentModel, relpyModel } from "../src/model/commentmodel.mjs";



export async function Authorized(req, res, next) {
    const { role, userID } = req.user
    const {path} = req.route;
    const {id} = req.params
    
    try {

        if (role === 'admin')
            next();

        else {
           
            if (path.includes("article") && (path.includes("update") || path.includes("delete")))
            {
                const article = await articleModel.findById(id);
    
                if (article && article.authorID == userID)
                 next();

                else 
                 return res.status(403).json({message:"Forbidden"});
            }

            else if (path.includes("comment") && (path.includes("update") || path.includes("delete")))
            {
                const comment = await commentModel.findById(id);
                
                if (comment && comment.author == userID)
                 next();
                
                return res.status(403).json({message:"Forbidden"});
            }

            else if (path.includes("reply") && (path.includes("update") || path.includes("delete")))
            {
                const  reply = await relpyModel.findById(id);
                
                if (reply && reply.author == userID)
                 next();
                
                return res.status(403).json({message:"Forbidden"});
            }

            else if ( path.includes("user") && (path.includes("update") || path.includes("delete")))
            {
                console.log(id,  userID);
                if (id == userID)
                    next();

                else
                  return res.status(403).json({message:"Forbidden"});
            }

        }  


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}