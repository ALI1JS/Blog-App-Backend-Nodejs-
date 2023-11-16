import {Router} from "express";
import {uplode, Validate, VerifyToken, Authorized, GetUser, ResetPassword, ForgetPassword, Follow, UnFollow, DeleteAccount, DeleteArticlesComments, DeleteUserArticles, UpdateProfile } from "./index.mjs";
const router = Router();

router.post("/user/follow", Validate("auth"), VerifyToken, Follow);
router.post("/user/unfollow", Validate("auth"), VerifyToken, UnFollow);
router.post("/user/forgetPassword", ForgetPassword);
router.post("/user/resetPassword", ResetPassword);
router.delete("/user/delete/account/:id", Validate("auth"), VerifyToken, Authorized, DeleteArticlesComments, DeleteUserArticles, DeleteAccount);
router.post("/user/update/acount/:id",Validate("auth"), VerifyToken , Authorized, uplode.single("avatar"), UpdateProfile);
router.get("/user/:id", GetUser);

export {router}