import express from "express";
import userController from "../controllers/userController";
import { checkTokenWithCookie } from "../middleware/JWTAction";
import blogController from "../controllers/blogController";
const router = express.Router();

//blog
router.get("/blogs", blogController.getAllBlogsUser);
router.get("/blogs/:id", blogController.getBlogById);

//user
router.get("/getMe", checkTokenWithCookie, userController.getMe);
router.patch("/changePassword", userController.changePassword);
router.patch("/update/:id", userController.updateUserById);
router.get("/:id", userController.getUserById);

export default router;
