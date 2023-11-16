import { Router } from "express";

import {Authorized, Validate, VerifyToken, createComment, deleteComment, getAllComments, editComment} from "./index.mjs"

const router = Router();



router.post("/articles/comment/add/:id",Validate("auth"), VerifyToken, Validate("comment"), createComment);
router.post("/articles/comment/update", Validate("auth"), VerifyToken, Authorized, editComment);
router.post("/articles/comment/delete/:id", Validate("auth"), VerifyToken, Authorized, deleteComment);
router.get("/articles/all_comments/:id", Validate("auth"), VerifyToken, getAllComments);

export {
    router
}
