import { connect } from "mongoose";

export default async function ConnectToDataBase() {
    try {

        const dbCon = await connect(process.env.MONGO_STRING);

        if (dbCon)
            console.info ("😀 Mongo database connect susccefully 🥰");

        else
            throw new Error("Can not connect to mongodb 😥");

    } catch (error) {
        console.error(error.message);
    }
}