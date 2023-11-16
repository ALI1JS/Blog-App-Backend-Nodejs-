import { validationResult } from "express-validator";
import JWT  from "jsonwebtoken";


export function VerifyToken (req, res, next)
{
    const errors = validationResult(req);

    if (errors.isEmpty())
    {
        const token = req.headers["Authorization"] || req.headers["authorization"];
    
       
        try {
           const decoded = JWT.verify(token, process.env.JWT_SECRT_KEY);
           
           req.user = decoded;
           next(); 
         
         } catch (error) {
             return res.status(401).json({message:"Invalid token"})
         }
    }

    else
    {
        return res.status(401).json({message:errors});
    }
    
}