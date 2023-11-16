import {Router} from "express";
import { success, cancel, PaymentPayPal, PaymentStripe, VerifyToken, Validate } from "./index.mjs";

const router = Router();

router.get("/payment/success", success);
router.get("/payment/cancel", cancel);
router.post("/plans/payment/paypal",Validate("auth"), VerifyToken, PaymentPayPal);
router.post("/plans/payment/stripe", Validate("auth"), VerifyToken, PaymentStripe)


export{
    router
}