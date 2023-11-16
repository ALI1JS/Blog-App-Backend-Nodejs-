import express from "express";
const app = express();

/**
 * Import routes and Required functions from one file
 * To achieve the Readablity
 */

import {
cors,
dotenv,
swaggerUi,
swaggerDocument,
userActionRouter,
authRouter,
articlRouter,
commentRouter,
replyRouter,
actionRouter,
paymentRouter,
adminRouter,
ConnectToDataBase,
searchRouter
} from "./index2.mjs"

/***
 * App Settings
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
dotenv.config();
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/***
 * Database Connection
 */

ConnectToDataBase();


/***
 * routes
 */


app.use("/api", authRouter);
app.use("/api", articlRouter);
app.use("/api", commentRouter);
app.use("/api", replyRouter);
app.use("/api", paymentRouter);
app.use("/api", actionRouter);
app.use("/api", userActionRouter);
app.use("/api", searchRouter);
app.use("/api", adminRouter);
app.use("*", (req, res)=>{
   return res.json({message:"Thia EndPoint Not Found"});  
})
/***
 * Listening
 */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
     console.log(`listening on port ${PORT}`);
})