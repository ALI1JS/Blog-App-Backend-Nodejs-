import {Stripe, paypal} from "./index.mjs"

const stripe = new Stripe("sk_test_51N06UzLV9R6YV6E1YYJtRczVJemzUMbzUuQqbkXjgCzz1Ku8Xb4KLgIhePteIIN2T5GBxWcth9wKfkU0d4P9Qoe200Nm1t5VEt");

const configure = paypal.configure({
    "mode": "sandbox",
    "client_id": "Ae4qVLe_uhthQQpbP8ugWgG4Iynu26wy3IZ91cALbLGLhHriF05IsEPtjseeR97sLNaO09LtIwWPxIM_",
    "client_secret": "EArG_MTIhNNwv2dv_kpT_dhbUygZf8RdJ8p5oCUbCybKFY0YXR84sZxed2asglG8fmHbSLOgxSygkFnc"
})

export function success (req, res)
{
    return res.send("<h2>payment success</h2>")
}

export function cancel(req, res)
{
  return res.send("<h2>payment process canceled</h2> ")
}



export async function PaymentPayPal(req, res) {

    const { amount, plan } = req.body;
    const payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000/api/payment/success",
            "cancel_url": "http://localhost:5000/api/payment/cancel",
        },
        "transactions": [{
            "plan": "plan1",
            "amount": {
                "currency": "USD",
                "total": 10
            },
            "description": "This is the payment description."
        }]
    }
    try {
        paypal.payment.create(payment_json, (err, payment) => {

            if (payment) {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        console.log("someone requedt you");
                        console.log(payment.links[i].href);
                        return res.json(payment.links[i].href);
                    }
                }

            } else {
                return res.json(err);
            }
        });


    } catch (error) {
        return res.json(error);
    }
}


export async function PaymentStripe (req, res)
{
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:"Plan 1",
                        description:"plan one in my blog post"
                    },
                    unit_amount:2000
                },
                quantity:1
            }
        ],
        mode:"payment",
        success_url:"http://localhost:5000/api/payment/success",
        cancel_url:"http://localhost:5000/api/payment/cancel",
    })

    if (session)
      res.json(session.url);

    else
     return res.json({message:"please try again the session isn't estublished"})
}
