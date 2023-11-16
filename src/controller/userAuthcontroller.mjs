import { userModel, tokenModel, validationResult, hash, compare, JWT, sendEmail } from "./index.mjs";
import crypto from "crypto";
import { unlink } from "fs"


export function Register(req, res) {
   const { username, email, password, desc, jopTitle } = req.body;
   const validError = validationResult(req);

   try {
      if (validError.isEmpty()) {
         userModel.findOne({ email: email })
            .then((data) => {
               
               if (data)
                  return res.json({ message: "this email already exists try to  login or create a new one" });
               else {
                  // must encrypt any senstive data before store it
                  const encrypted = hash(password, 10, (err, hash) => {
                     if (!err) {
                        const newUser = new userModel({
                           username,
                           email,
                           password: hash,
                           desc,
                           jopTitle,
                           avatar: req.file.path
                        })

                        newUser.save()
                           .then(async (user) => {

                              const result = await saveTokenAndSend(user);

                              if (result)
                                 return res.json({ message: result });

                           })
                           .catch((err) => {
                              res.json({ message: err.message })
                           })
                     }

                     else
                        res.json({ message: err.message });

                  })
               }
            })
      }

      else 
        throw Error(validError)

   }
   catch (err) {
      return res.status(500).json({ message: err.message });
   }


}

async function saveTokenAndSend(user) {
   try {

      const newToken = new tokenModel({
         userID: user._id,
         token: crypto.randomBytes(32).toString("hex"),
      });

      if (newToken) {
         await newToken.save();
         const message = `Thanks for Registration. You should Verify this email.
         \nPress on this Link: http://localhost:5000/api/verify/${newToken.userID}/${newToken.token}`;
         await sendEmail(user.email, "Verification Email", message);

         return ("verification email sent successfully")
      }


   } catch (error) {
      return (error.message);
   }
}

export async function Verify(req, res) {
   const { userID, token } = req.params;


   const user = await userModel.findById(userID);

   if (!user)
      res.status(404).json({ message: "Invalid URL" });


   const data = await tokenModel.find({ userID, token });

   if (!data)
      res.status(404).json({ message: "Inavalid URL" });


   await userModel.findByIdAndUpdate(userID, { verified: true });
   await tokenModel.findOneAndDelete({ userID: userID });

   res.status(200).json({ message: "Verified successfully" });

}
// SING IN  --- No Permission:

export async function SignIn(req, res) {

   const errors = validationResult(req);

   if (errors.isEmpty()) {
      const { email, password } = req.body;
      // CHECK IF EMAIL EXIST OR NOT 

      try {
         await userModel.findOne({ email: email })
            .then((user) => {
               if (!user)
                  return res.json({ message: "User not found" });

               else {
                  //  COMPARE THE PASSWORD
                  compare(password, user.password, (err, result) => {
                     if (err) {
                        throw (err)
                     }
                     else {
                        if (result) {
                           // SEND THE MESSAHE AND THR TOKEN

                           const Token = JWT.sign(
                              { userID: user._id, userEmail: user.email, role: user.role, isVerified: user.verified },
                              process.env.JWT_SECRT_KEY
                              , { expiresIn: "24h" })

                           return res.json({ message: "SIGN IN SUCCESSFULLY", token: Token });
                        }
                        else 
                           return res.json({ message: "INVALID PASSWORD" });
                     }
                  })
               }
            })



      }
      catch (err) {
         return res.json({ message: err.message })
      }
   }

   else {
      return res.json({ message: errors })
   }

}



// LOGOUT :   Permission => is authenticated

export function Logout(req, res) {

   // Make another token with 0h expiraton time😀

   const logoutToken = JWT.sign({ userID: req.user.userID, userEmail: req.user.email }, process.env.JWT_SECRT_KEY,
      { expiresIn: "0h" });

   res.json({ message: "logout successful we are very sad for that", token: logoutToken });


}

// CHANGE PROFILE:

export async function UpdateProfile(req, res) {

   const errors = validationResult(req)
   const { id } = req.params;

   try {

      if (errors.isEmpty()) {
         // costruct the required data from request:
         const { email, password, username, desc, jopTitle } = req.body;
         const hashPassword = await hash(password, 10)

         const newData = {
            email,
            username,
            password:hashPassword,
            desc,
            jopTitle,
            avatar: req.file.path
         }



         const user = await userModel.findById(id);

         if (!user)
            return res.status(404).json({ message: "User not found" });

         const updatedUser = await userModel.findByIdAndUpdate(id, newData);

         if (!updatedUser)
            return res.status(500).json({ message: "User Not Saved" });

         unlink(user.avatar, (err) => {

            if (!err)
               return res.status(200).json({ message: "User Updated" });

            throw Error(err.message)

         })
      }

      else {
         throw Error(errors)
      }

   } catch (error) {
      return res.status(500).json({ message: error.message });
   }




}