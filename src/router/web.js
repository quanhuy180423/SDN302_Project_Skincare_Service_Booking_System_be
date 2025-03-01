import express from "express";
import userRouter from "./user";
import authRouter from "./auth";
import serviceRouter from "./service";
import reviewRouter from "./review";
import adminRouter from "./admin";

import { checkRole } from "../Middleware/authMiddleware";
import blogRouter from "./blog";
require("dotenv").config();
let router = express.Router();
let initWebRount = (app) => {
  // Public routes
  router.use("/", authRouter);
  router.use("/user", userRouter);
  router.use("/service", serviceRouter);
  router.use("/review", reviewRouter);
  router.use("/blog", blogRouter)
  //only admin can access
  router.use("/admin", checkRole(['admin']), adminRouter);


  return app.use("/api/", router);
};
export default initWebRount;
