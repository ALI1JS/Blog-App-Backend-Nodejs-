import { userModel, sendEmail, articleModel as article, articleModel } from "./index.mjs";
import {readFile, unlink} from "fs"


export async function Create(req, res) {
    // extract the data from body:
    const { title, desc, body, tags, catogry } = req.body;

    // handle the creaton articles

    try {

        const newArticle =  new article({
            authorID: req.user.userID,
            title,
            desc,
            body,
            tags,
            catogry,
            coverImage:req.file.path
        })

        await newArticle.save()
            .then(async (article) => {

                if (article) {
                    const user = await userModel.findById( req.user.userID);
                    
                      const followings = await userModel.find({_id: {$in : user.following}});

                        followings.forEach(item =>{
                           sendEmail(item.email, article.title, article.desc )
                        })
                   
                    return res.status(200).json({ message: "Article saved successfully" });
                }

                else
                    return res.status(402).json({ message: "Article not saved" });
            })
            .catch((err) => {
                return res.status(402).json({ message: err.message })
            })


    } catch (error) {
        return res.status(404).json({ message: error })
    }


}


export async function Update(req, res) {

    const articleID = req.params.id;
    
    try {
        
        const article = await articleModel.findById(articleID);

         if (article)
         {
            {
            if (req.file){
                req.body.coverImage = req.file.path;
                unlink(article.coverImage, (err)=>{
                    if (err)
                     return res.status(err.code).json({message: err.message})
                });
            }
            }
            
             const updated = await articleModel.updateOne({_id: articleID}, req.body);

             if (!updated)
               return res.status(500).json({message:"Error updating article"});
            
            return res.status(200).json({message:"updated successfully"});

         } 
         return res.status(400).json({message:"article not found"});
    } catch (err) {
        return res.status(402).json({ message: err.message })
    }

}

export async function Delete(req, res) {
    const { id } = req.params;
    try {

        await article.findByIdAndDelete(id)
            .then((article) => {

                if (article)
                {
                    unlink(article.coverImage, (err)=>{
                        if (!err)
                          throw Error(err);
                    })
                    return res.status(200).json({ message: "Article deleted successfully", article })
                }

                else
                    return res.status(402).json({ message: "Article not found" });
            })
            .catch((err) => {
                return res.status(402).json({ message: err.message });
            })


    } catch (error) {
        return res.status(402).json({ message: error.message });
    }
}


export async function FindAll(req, res) {
    try {

        if (req.user.role === 'admin') {
            const allArticles = await articleModel.find();

            if (allArticles.length === 0)
                return res.status(404).json({ message: "Not Found" });
            return res.status(200).json({ message: allArticles });
        }
        else {
            const allArticles = await articleModel.find({ authorID: req.user.userID });


            if (allArticles.length === 0)
                return res.status(404).json({ message: "Not Found" });


            return res.status(200).json({ message: allArticles });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export async function FindOne(req, res)
{
    const articleID = req.params.id;

    try {
        
         const article = await articleModel.findById(articleID);

         if (!article)
           return res.status(404).json({ message:"No such article"});

        readFile(article.coverImage,"utf-8", (err, cover)=>{
            
           if (err)
             throw Error(err);

            return res.status(200).json({article, cover});
        })
           

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function Sort(req, res) {

    const { q } = req.query;
    let result;

    try {

        if (q === "comments") {
            result = await articleModel.aggregate([
                {
                    $addFields: {
                        commentCount: {
                            $cond: {
                                if: { $isArray: "$comments" },
                                then: { $size: "$comments" },
                                else: 0
                            }
                        }
                    }
                },
                {
                    $sort: {
                        commentCount: -1
                    }
                }
            ])
        }


        return res.json({ message: result });

    } catch (error) {
        return res.status(201).json({ message: error.message });
    }

}

export async function CatogeryFilter (req, res)
{
    const {q} = req.query;
    
    if (q === "" || q === undefined || q === " ")
      return res.status(500).json({message:"there is not query like this "})
    
    const articles = articleModel.find({catogry: q})

    if (articles && articles.length > 0)
      return res.status(200).json({message:articles});
    
    return res.status(404).json({message:"no articles found"});

}




