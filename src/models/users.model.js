import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new Schema({
    username: { type: String, required: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, default: null },
    avatar: { type: String, default: null }, // Cloundinary Service
    coverImage: { type: String, default: null },
    password: { type: String, required: [true, 'password is Required'] },
    refereshToken: { type: String },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos'
    }]
}, { timestamps: true });

// To use Aggregation Pipeline within User Model
userSchema.plugin(mongooseAggregatePaginate);

// Mongoose Hooks 

/**
 * @description This hook will execute before user data save in database like Middleware
 */
userSchema.pre("save",async function (next) {

    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

// We can make custome methods also

/**
 * 
 * This Function is Custom Schema Method like insertOne or anyother. 
 */
userSchema.methods.isPasswordCorrect =async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function (){
    const token = jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECREATE,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY});

    return token;
}

userSchema.methods.generateRefereshToken = function (){
    const token = jwt.sign({
        _id:this._id
    },
    process.env.REFERESH_TOKEN_SECREATE,
    {expiresIn:process.env.REFERESH_TOKEN_EXPIRY});

    return token;
}


export const userModel = mongoose.model("users", userSchema);