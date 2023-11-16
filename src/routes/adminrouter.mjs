import { Router } from "express";
import {
    ClearArticles,
    ClearUsers,
    ClearComments,
    ClearReplies,
    Validate,
    VerifyToken,
    Authorized
} from "./index.mjs"
const router = Router();


router.delete('/admin/clear/users',Validate("auth"), VerifyToken, Authorized, ClearUsers);
router.delete("/admin/clear/comments/", Validate("auth"), VerifyToken, ClearComments);
router.delete("/admin/clear/articles",Validate("auth"), VerifyToken, Authorized, ClearArticles);
router.delete("/admin/clear/replies",Validate("auth"), VerifyToken, Authorized, ClearReplies);



export {router};