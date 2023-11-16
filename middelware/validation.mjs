import {body, header, param, query} from "express-validator";

export function Validate (validator)
{
    switch (validator)
    {
        case "useracount":
            return [
                body("email").not().isEmpty().withMessage("Please enter your email address"),
                body("email").isEmail().withMessage("correct email format"),
                body("username").not().isEmpty().withMessage("please enter your username"),
                body("username").isLength({min:5,max:10}).withMessage("username must be at least 5 to 10 characters long"),
                body("password").not().isEmpty().withMessage("please enter your password"),
                body("password").isLength({min:5,max:15}).isAlphanumeric()
                .withMessage("password must be between 5 and 15 characters long and consist charchter and numbres")
            ]

        break;

        case "SignIn":
            return [
                body("email").not().isEmpty().withMessage("Please enter your email address"),
                body("email").isEmail().withMessage("correct email format"),
                body("password").not().isEmpty().withMessage("please enter your password"),
                body("password").isLength({min:5,max:15}).isAlphanumeric()
                .withMessage("password must be between 5 and 15 characters long and consist charchter and numbres")
            ]
        
        break;

        case "auth":
            return [
                header("authorization").notEmpty().withMessage("Token is required")|| 
                header("Authorization").notEmpty().withMessage("Token is required"),
                header("authorization").isJWT().withMessage("Invalid Token")|| 
                header("Authorization").isJWT().withMessage("Invalid Token"),
            ]
        
        break;

        case "article":
            return [
                body("title").notEmpty().withMessage("Title is required"),
                body("desc").notEmpty().withMessage("Description is required"),
                body("body").notEmpty().withMessage("Body is required"),
                body("tags").isArray({min:0, max:3}).withMessage("you can add three tags ")
            ]
        break;
        
        case "params":
            return [
              param("param").notEmpty().withMessage("param required"),
            ]

        break;
        case "query":
            return [
              query("query").notEmpty().withMessage("param required"),
            ]

        break;
        case "comment":
            return [
                body("comment").notEmpty().withMessage("Title is required"),
            ]

        break;

        
    }
}