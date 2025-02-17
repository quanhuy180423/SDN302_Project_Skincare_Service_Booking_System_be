import express from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import { checkTokenWithCookie, checkAuthentication } from "../Middleware/JWTAction";
require('dotenv').config();
let router = express.Router();
let initWebRount = (app) => {

    

    // Public routes
    router.post("/register", authController.register);
    router.post("/login", authController.login);
    router.post("/logout", authController.logout);

    // Protected routes
    router.all("*", checkTokenWithCookie, checkAuthentication);
    // router.post("/user", userController.createUser);
    router.get("/user", userController.getUser);

    return app.use("/api/", router);
}
export default initWebRount;