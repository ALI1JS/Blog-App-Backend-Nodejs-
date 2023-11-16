import {router as authRouter} from "./src/routes/userauth.mjs";
import {router as articlRouter} from "./src/routes/articlerouter.mjs";
import {router as commentRouter} from "./src/routes/commentsrouter.mjs";
import {router as replyRouter} from "./src/routes/replyrouter.mjs";
import {router as paymentRouter} from "./src/routes/paymentrouter.mjs";
import { router as actionRouter}  from "./src/routes/articleActionrouter.mjs";
import { router as userActionRouter}  from "./src/routes/useractionrouter.mjs";
import ConnectToDataBase from "./config/databaseConnection.mjs";
import { connect } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json"  assert {type: "json"};
import {router as searchRouter} from "./src/routes/searchrouter.mjs";
import {router as adminRouter} from "./src/routes/adminrouter.mjs";


export {
    connect,
    dotenv,
    cors,
    authRouter,
    articlRouter,
    commentRouter,
    replyRouter,
    paymentRouter,
    actionRouter,
    userActionRouter,
    searchRouter,
    adminRouter,
    ConnectToDataBase,
    swaggerUi,
    swaggerDocument
}