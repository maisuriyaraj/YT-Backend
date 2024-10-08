import mongoose, { Schema } from "mongoose";

const subScripitionSchema = new mongoose.Schema({
    userId: {type : Schema.Types.ObjectId,ref:'users'}, // The One who is subscribing
    channel : {
        type : Schema.Types.ObjectId,ref:'users' // the one whom Subscriber is subscribing
    }
});


export const subScriptionModel = mongoose.model('subscription',subScripitionSchema);