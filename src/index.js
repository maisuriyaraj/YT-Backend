import dotenv from 'dotenv';
import express from 'express';
import { app } from './app.js';
import connectDB from './db/db.js';

dotenv.config({path:'./.env'});


connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server Started on : http://localhost:8181");
    });
}).catch((error)=>{
    console.log("Mongo Connection is Faild ",error);
});

