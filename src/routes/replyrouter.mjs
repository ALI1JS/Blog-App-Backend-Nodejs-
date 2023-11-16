import {Router} from "express";
import {Authorized, Validate, VerifyToken, editReply, addReply, deleteReply} from "./index.mjs"
const router = Router();




router.post("/articles/reply/add", Validate('auth'), VerifyToken, addReply);
router.post("/articles/reply/update/:id", Validate('auth'), VerifyToken, Authorized, editReply);
router.post("/articles/reply/delete/:id", Validate('auth'), VerifyToken, Authorized, deleteReply);


export{
    router
}