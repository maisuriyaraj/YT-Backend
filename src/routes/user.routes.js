import { Router } from "express";
import { LoginUser, LogOutUser, refereshAccessToken, RegisterUser } from "../controllers/users.controller.js";
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

// Secured Routes 
routes.route('/logout').post(verifyJWT,LogOutUser);

routes.route('/refereshAccessToken').post(refereshAccessToken)

export default routes;