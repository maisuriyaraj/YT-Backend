import mongoose from "mongoose";
import express from "express";

const app = express();

const connectDB = async() => {
    try {
        const connectionResponse = await mongoose.connect(process.env.MONGO_URI);
        app.on("error",(error)=>{
            console.log("Express Mongo Connection Error : " , error);
            throw error;
        })
        console.log("MONGO CONNECTED 🗿",connectionResponse.connection.host);
    } catch (error) {
        console.error("Mongoose Connection ERROR : " , error);
        process.exit(1);
    }
}

export default connectDB;