import { Router } from "express";
import {uplode, VerifyToken, Validate, Authorized, Sort, FindAll, FindOne, CatogeryFilter, Create, Delete, Update} from "./index.mjs";

const router = Router();



router.post("/article/create", Validate("auth"), VerifyToken, Validate("article"),uplode.single("cover"), Create);
router.post("/article/update/:id", Validate("auth"), VerifyToken,Authorized, uplode.single("cover"), Update);
router.delete("/article/delete/:id", Validate("auth"), VerifyToken, Authorized, Validate("article"), Delete);
router.post("/article/sort/",Validate("auth"), VerifyToken, Sort);
router.get("/article/getAll", Validate("auth"), VerifyToken, FindAll);
router.get("/article/getOne/:id", Validate("auth"), VerifyToken, FindOne);
router.get("/article/getArticles/", Validate("auth"), VerifyToken, CatogeryFilter);


export {
    router
}