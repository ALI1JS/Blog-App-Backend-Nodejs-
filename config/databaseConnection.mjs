import { connect } from "mongoose";

export default async function ConnectToDataBase() {
    try {

        const dbCon = await connect("mongodb://127.0.0.1:27017/Blog");

        if (dbCon)
            console.info ("😀 Mongo database connect susccefully 🥰");

        else
            throw new Error("Can not connect to mongodb 😥");

    } catch (error) {
        console.error(error.message);
    }
}