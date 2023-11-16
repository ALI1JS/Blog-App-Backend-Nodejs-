import {
articleModel,
relpyModel,
commentModel,
arrangeComments
} from "./index.mjs";


export async function createComment(req, res) {
    const { comment } = req.body;

    try {

        const newComment = await new commentModel({
            comment,
            author: req.user.userID
        });

        newComment.save()
            .then((comment) => {
                if (comment) {
                    //add the commentID to the article 

                    articleModel.findByIdAndUpdate({ _id: req.params.id }, { $push: { comments: comment._id } })
                        .then((article) => {
                            if (article)
                                return res.status(200).json({ comment, message: "the comment added successfully" });
                            else
                                return res.status(400).json({ message: "the commnet doesn't added" })

                        })
                }

                else
                    return res.status(403).json({ message: "the comment doesn't created" });
            })
            .catch((err) => {
                return res.status(500).json({ message: err.message });
            })

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

export function editComment(req, res) {

    const { newData, commentID } = req.body;

    commentModel.findByIdAndUpdate({ _id: commentID }, { comment: newData })
        .then((comment) => {
            if (comment)
                return res.status(200).json({ message: comment });

            else
                return res.status(400).json({ message: "the comment doesn't updated" });
        })
        .catch((err) => {
            return res.status(500).json({ message: err });
        })


}

export function deleteComment(req, res) {
    /**
     *  delete operation 
     * - first delete the all its replies from replies collection
     * - second delete the its id from aricles collection (comment)
     * - third delete the comment 
     */

    const  articleID  = req.params.id;
    const { commentID } = req.body;

    commentModel.findByIdAndDelete(commentID)
        .then((comment) => {

            if (comment) {
                relpyModel.deleteMany({ _id: { $in: comment.replies } })
                    .then((data) => {
                        if (data) {

                            articleModel.findByIdAndUpdate(articleID, { $pull: { comments: commentID } })
                                .then((article) => {
                                    return res.json({ message: "comment deleted successfully" });
                                })

                        }
                        else {
                            return res.status(400).json({ message: "no reply deleted" });
                        }
                    })
            }
            else {
                return res.status(404).json({ message: "comment not found" });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: err.message });
        })

}


export function getAllComments(req, res) {
    const  articleID  = req.params.id;


    articleModel.findById(articleID)
        .then((article) => {

            if (article) {
                const commentsList = article.comments;

                commentModel.find({ _id: { $in: commentsList } })
                    .then((comments) => {
                        if (comments.length > 0) {
                            relpyModel.find({ _id: { $in: comments.replies } })
                                .then((replies) => {

                                    if (replies) {
                                        return res.status(200).json(arrangeComments(comments, replies));
                                    }
                                    else
                                        return res.status(404).json({ message: "No Relpy" })

                                })
                        }
                        else
                            return res.status(404).json({ message: "No comments" });
                    })
            }
            else
                return res.status(404).json({ message: "No Article" });
        })
}


