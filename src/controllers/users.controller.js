import jwt from 'jsonwebtoken';
import { userModel } from "../models/users.model.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import { asyncHandlerPromises } from "../utils/asyncHandler.js";
import handleFileUploading from "../utils/cloudnairy.js";


async function generateAccessTokenandRefereshToken(userId) {
   try {
      const user = await userModel.findById(userId);
      const accessToken = user.generateAccessToken();
      const refereshToken = user.generateRefereshToken();

      user.refereshToken = refereshToken;
      user.accessToken = accessToken;

      // I am Saveing RefereshToken and AccessToken in Database without Password Checking
      // Here No need to check password so i am using {validateBeforeSave : true}.
      await user.save({ validateBeforeSave: true });

      return { accessToken, refereshToken }
   } catch (error) {
      throw new APIError(500, "Something went Wrong while generate Referesh token and Access Token !");
   }
}

const RegisterUser = asyncHandlerPromises(async (req, res) => {
   // Get User Details from Request Body
   // Check Validation
   // Check if User Already Exists
   // Check for cover Image or Avatar
   // Upload them to Cloudinary
   // Create user Object - create entry in database
   // remove password and refreshToken from Response
   // Check for user creation response
   // Return Response

   const { fullName, email, username, password } = req.body;


   /**
    * 
    * @description Validation
    */
   //    if(fullName != ""){
   //     throw new APIError(400,"Full Name is Required")
   //    }

   if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
      throw new APIError(400, "All Fields are Required")
   }

   /**
    * Check User Existence
    */


   const existenceUser = await userModel.findOne({
      $or: [{ username, email }]
   });

   if (existenceUser) {
      throw new APIError(409, "User is Already Exists !");
   }

   const avatarImage = req.files?.avatar[0]?.path;
   let coverImage = "";
   if (req.files?.cover?.length) {
      coverImage = req.files?.cover[0]?.path;
   }

   if (!avatarImage) {
      throw new APIError(400, "Avatar Image is Required !");
   }

   const avatar = await handleFileUploading(avatarImage);
   let coverImagePath;
   if (coverImage != "") {
      coverImagePath = await handleFileUploading(coverImage);
   }

   if (!avatar) {
      throw new APIError(400, "File is Not Uploaded")
   }

   // await handleFileUploading(coverImage);

   const user = await userModel.create({
      fullName,
      email,
      username,
      avatar: avatar,
      coverImage: coverImagePath || "",
      password
   });

   const data = await userModel.findById(user._id).select(
      "-password -refereshToken"
   );

   if (!data) {
      throw new APIError(500, "Error in Creating Error .")
   }

   return res.status(201).json(
      new APIResponse(201, data, "User Registered Successfully !")
   );

});

const LoginUser = asyncHandlerPromises(async (req, res) => {
   // req.body => data
   // username or password
   // find user
   // password check
   // access and referesh token
   // send cookiee

   const { email, password } = req.body;
   if (!email) {
      throw new APIError(400, "password is required !");
   }

   const isUser = await userModel.findOne({ email: email });
   // if you want to check username or email

   //  const user = await userModel.findOne({$or:[{username},{email}]})

   if (!isUser) {
      throw new APIError(404, "User Does Not Exists !");
   }

   // Use of Custom Mongoose Methods
   const isPasswordValid = await isUser.isPasswordCorrect(password);

   if (!isPasswordValid) {
      throw new APIError(401, "Invalid user Crediantials !");
   }



   const { refereshToken, accessToken } = await generateAccessTokenandRefereshToken(isUser._id);

   const mainUserDetails = await userModel.findById(isUser._id).select("-password -refereshToken");;

   // Send Cookies 
   // 1. Generate Options
   const options = {
      httpOnly: true, // It is Modifiable only from server
      secure: true // It is Modifiable only from server
   }

   return res.status(201).cookie("accessToken", accessToken, options).cookie("refereshToken", refereshToken, options).json(
      new APIResponse(201, {
         user: mainUserDetails,
         accessToken,
         refereshToken
      })
   )



});

const LogOutUser = asyncHandlerPromises(async (req, res) => {
   const user = await userModel.findByIdAndUpdate(
      req.user?._id,{
         $set:{
            refereshToken : null
         },
      },
      {
         new : true // It will Return Updated Record with Updated Fields
      }
   );

   const options = {
      httpOnly: true, // It is Modifiable only from server
      secure: true // It is Modifiable only from server
   };

   return res.status(201).clearCookie("accessToken",options).clearCookie("refereshToken",options).json(
      new APIResponse(201,{},"User Logged out !")
   );
});

const refereshAccessToken = asyncHandlerPromises(async (req,res) => {
   const incomingRefereshToken = req.cookies.refereshToken || req.body.refereshToken ;

   if(!incomingRefereshToken){
      throw new APIError(401,"Unauthorize Request !");
   }

   let token = jwt.verify(incomingRefereshToken,process.env.REFERESH_TOKEN_SECREATE);
   
   const user = await userModel.findById(token._id);

   if(!user){
      throw new APIError(401,"Invalid Token !");
   }

   if(incomingRefereshToken !== user.refereshToken){
      throw new APIError(401,"Referesh Token is Expired or Used !");
   }

   const options = {
      httpOnly: true, // It is Modifiable only from server
      secure: true // It is Modifiable only from server
   };

   const { refereshToken, accessToken } = await generateAccessTokenandRefereshToken(user._id);

   return res.status(201).cookie("accessToken",accessToken,options).cookie("refereshToken",refereshToken,options).json( new APIResponse(201,"New Referesh Token Generated !"));



});

export { RegisterUser, LoginUser, LogOutUser ,refereshAccessToken };
