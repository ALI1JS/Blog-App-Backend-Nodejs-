import { articleModel, userModel } from "./index.mjs";






export async function Search (req, res)
{
    const {q} = req.query;

    const articleResult = await articleModel.find({$text:{$search:q}});
    const userResult = await userModel.find({$text: {$search: q}});

    if (articleResult.length === 0 && userResult.length === 0)
       return res.status(404).json({message:"No results found"});
    
    const usersInfo = [];
    userResult.forEach((user)=>{
       
        usersInfo.push({username:user.username, jobTitle:user.jopTitle, desc:user.desc});
    })
    
    return res.status(200).json({message:"Success", artcles: articleResult, users:usersInfo});
}