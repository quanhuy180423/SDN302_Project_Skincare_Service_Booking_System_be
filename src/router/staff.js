import express from "express";
import blogController from "../controllers/blogController";

const staffRouter = express.Router();

staffRouter.get("/blogs", blogController.getAllBlogs);
staffRouter.get("/blogs/:id", blogController.getBlogById);
staffRouter.post("/blogs", blogController.createBlog);
staffRouter.put("/blogs/:id", blogController.updateBlog);
staffRouter.delete("/blogs/:id", blogController.deleteBlogStaff);

export default staffRouter;
