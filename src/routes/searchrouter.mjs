import {Router} from "express";
import { Search } from "./index.mjs";

const router = Router();


router.get("/search/", Search);




export {router};