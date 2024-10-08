import jwt from 'jsonwebtoken';
import APIError from "../utils/apiError.js";
import { asyncHandlerPromises } from "../utils/asyncHandler.js";
import { userModel } from '../models/users.model.js';

// If Function Perameter is Not Used in Function and it is Required Peramater than we can use Defined it using _ .
export const verifyJWT = asyncHandlerPromises(async (req, _, next) => {
    try {
        const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new APIError(401, "Unauthorized Request !");
        }

        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECREATE);

        const user = await userModel.findById(decodedTokenInfo?._id).select("-password -refereshToken");

        if (!user) {
            throw new APIError(401, "Invalid Access Token");
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("MIDDLEWARE ERROR " , error);
        throw new APIError(401,error.message);
    }

});