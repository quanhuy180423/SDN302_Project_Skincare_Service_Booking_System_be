import express from "express";
import userRouter from "./user";
import authRouter from "./auth";
import serviceRouter from "./service";
import reviewRouter from "./review";
import {
  checkTokenWithCookie,
  checkAuthentication,
} from "../middleware/JWTAction";
require("dotenv").config();
let router = express.Router();
let initWebRount = (app) => {
  // Public routes
  router.use("/auth", authRouter);
  router.use("/user", userRouter);
  router.use("/service", serviceRouter);
  router.use("/review", reviewRouter);

  // Protected routes
  router.all("*", checkTokenWithCookie, checkAuthentication);
  // router.post("/user", userController.createUser);
  // router.get("/user", userController.getUser);

  return app.use("/api/", router);
};
export default initWebRount;
