const express = require("express");
import appointmentController from "../controllers/appointmentController";
const router = express.Router();

router.get("/", appointmentController.getMyAppointments);
router.post("/", appointmentController.createAppointment);
router.get("/:id", appointmentController.getAppointmentById);
router.patch("/:id", appointmentController.changeAppointmentStatus);

export default router;
