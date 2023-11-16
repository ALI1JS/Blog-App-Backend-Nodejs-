import { Router} from "express";
import {Validate, VerifyToken, Clap, SaveArticle, Report, UnReport} from "./index.mjs";

const router = Router();

router.post("/article/clap", Validate("auth"), VerifyToken, Clap);
router.post("/article/save", Validate("auth"), VerifyToken, SaveArticle);
router.post("/article/report", Validate("auth"), VerifyToken, Report);
router.post("/article/unreport/", Validate("auth"), VerifyToken, UnReport);



export {router};