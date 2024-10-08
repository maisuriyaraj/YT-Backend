import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, LoginUser, LogOutUser, refereshAccessToken, RegisterUser } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const routes = Router();


routes.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount : 1
        },
        {
            name:"cover",
            maxCount: 1
        }
    ]),
    RegisterUser
);

routes.route('/login').post(LoginUser);
routes.route('/refereshAccessToken').post(refereshAccessToken)

// Secured Routes 
routes.route('/logout').post(verifyJWT,LogOutUser);
routes.route('/changePassword').post(verifyJWT,changeCurrentPassword);
routes.route('/getLoggedUserDetails').get(verifyJWT,getCurrentUser);


export default routes;