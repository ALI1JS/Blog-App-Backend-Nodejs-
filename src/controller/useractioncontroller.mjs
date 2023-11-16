import { userModel, sendEmail, JWT, hash, articleModel,DeleteManyComments } from "./index.mjs"
import { unlink, readFile } from "node:fs";




export async function Follow(req, res) {
  const { followerID, followingID } = req.body;

  try {

    const alreadyFollow = await findInArray(userModel, followingID, "followers", followerID)

    if (!alreadyFollow) {
      const updated1 = await userModel.findByIdAndUpdate(followerID, { $push: { following: followingID } });

      if (updated1) {
        const updated2 = await userModel.findByIdAndUpdate(followingID, { $push: { followers: followerID } })

        if (updated2) {
          const sent = await sendEmail(updated1.email, "Following", `${updated2.username} follow you `);
          if (sent)
            console.log(sent);
          else
            console.log("un sent");
          return res.status(200).json(true);
        }

        else
          return res.status(400).json(false);
      }

      else
        return res.status(400).json(false);
    }
    else
      return res.json("Already you Following ");

  } catch (error) {
    return res.json({ message: error.message });
  }

}

export async function UnFollow(req, res) {
  const { followerID, followingID } = req.body;


  try {

    const alreadyFollow = await findInArray(userModel, followingID, "followers", followerID);

    if (alreadyFollow) {
      const deleted1 = await userModel.findByIdAndUpdate(followerID, { $pull: { following: followingID } });

      if (deleted1) {

        const deleted2 = await userModel.findByIdAndUpdate(followingID, { $pull: { followers: followerID } });
        if (deleted2) {
          const sent = await sendEmail(deleted1.email, "UnFollowing", `${deleted2.username} unfollow you `);
          if (sent)
            console.log(sent);
          else
            console.log("un sent");
          return res.json({ message: true });
        }

        else
          return res.json({ message: false });
      }
      else
        return res.json({ message: false });
    }

    else
      return res.json({ message: "Already unfollow" });

  } catch (error) {
    return res.json({ message: error.message });
  }
}

export async function ForgetPassword(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user)
    return res.status(404).json({ message: "User not found " });


  const token = await JWT.sign({ email, userID: user._id }, process.env.JWT_SECRT_KEY, { expiresIn: "15m" });

  if (!token)
    return res.status(402).json({ message: "Invalid token" });

  const message = `
 You are receiving this email because you requested a password reset for your account. 
 \n
 Please click the following link to reset your password:\n
 http://localhost:5000/api/resetPasword/${token}
  
 `
  const result = await sendEmail(user.email, "Reset Password", message);

  if (!result)
    return res.status(402).json({ message: "sendEmail failed" });

  res.status(200).json({ message: "you must check your email and Reset your password Before 15 Minutes", token })


}


export async function ResetPassword(req, res) {
  const token = req.headers.Authorization || req.headers.authorization;
  const { newPassword } = req.body;

  try {

    const verified = await JWT.verify(token, process.env.JWT_SECRT_KEY);

    const hashed = await hash(newPassword, 10);

    const updated = await userModel.findByIdAndUpdate(verified.userID, { password: hashed });

    if (!updated)
      return res.status(203).json({ message: "your password is not Reset try again please " });

    return res.status(200).json({ message: "Reset Password successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }


}

export async function DeleteAccount(req, res) {

  const { id } = req.params;
  try {

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (deletedUser) {
      unlink(deletedUser.avatar, (err) => {

        if (err)
          throw Error(err);
      })

      return res.status(200).json({ message: "We Are so sad to leave us, we hope come back soon" });
    }

    return res.status(203).json({ message: "Cann't Delete the account try again" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function DeleteUserArticles(req, res, next) {
  const { userID } = req.user;
  const { path } = req.route;

  try {
    const articleIds = [];
    const articles = await articleModel.deleteMany({ authorID: userID });

    if (articles.deletedCount === 0) {
      if (path.includes("account") && path.includes("delete")) {

        next()
      }
      return res.status(200).json({ message: "No articles found" });
    }

    else {
      if (path.includes("account") && path.includes("delete")) {
        next()
      }
      else
        return res.status(200).json({ message: "success" });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function DeleteArticlesComments(req, res, next) {
  const { userID } = req.user;
  const { path } = req.route;

  try {

    const articles = await articleModel.find({ authorID: userID });
    const articleIds = [];

      articles.forEach(article => {
        articleIds.push(article._id.toString());
      })

     
      const result = await DeleteManyComments(articleIds);

      if (path.includes("account") && path.includes("delete"))
        next()
      
      else
        return res.json(result);


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function GetUser(req, res) {
  const { id } = req.params;

  try {

    const user = await userModel.findById(id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    readFile(user.avatar, (err, data) => {

      if (err)
        return res.status(500).json({ message: err.message });

      return res.status(200).json({ userInfo: user, avatarData: data });

    });



  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function findInArray(model, id, field, searchItem) {

  const data = await model.findById(id);

  if (data[field].includes(searchItem))
    return true;

  else
    return false;
}










