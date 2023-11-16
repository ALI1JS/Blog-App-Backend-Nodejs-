import { Router } from "express";
import {uplode, Validate, VerifyToken, Register, SignIn, Logout, Verify} from "./index.mjs";
const router = Router();


//Validate("useracount")

router.post("/auth/signup", uplode.single("avatar"), Register); //Any One Can Access this API

router.post("/auth/login", Validate("SignIn"), SignIn);

router.post("/auth/logout", Validate("auth"), VerifyToken, Logout);

router.get("/verify/:userID/:token", Verify);
export {
    router
}