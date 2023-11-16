
export default function arrangeComments(commentsList, repliesList) {
    let newCommentList = [];
  
    commentsList.forEach((comment) => {
      let newComment = { ...comment, replyData: [] };
  
      comment.replies.forEach((id) => {
        const reply = repliesList.find((reply) => reply._id === id);
        if (reply) {
          newComment.replyData.push(reply);
        }
      });
  
      newCommentList.push(newComment);
    });
  
    return newCommentList;
  }