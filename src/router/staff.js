import express from "express";
import blogController from "../controllers/blogController";
import appoinmentController from "../controllers/appointmentController";

const staffRouter = express.Router();

staffRouter.get("/blogs", blogController.getAllBlogs);
staffRouter.get("/blogs/:id", blogController.getBlogById);
staffRouter.post("/blogs", blogController.createBlog);
staffRouter.put("/blogs/:id", blogController.updateBlog);
staffRouter.delete("/blogs/:id", blogController.deleteBlogStaff);

staffRouter.get("/appointments", appoinmentController.getAllAppointments);
staffRouter.get("/appointments/:id", appoinmentController.getAppointmentById);
staffRouter.patch(
  "/appointments/edit/:id",
  appoinmentController.changeAppointmentStatus
);

export default staffRouter;
