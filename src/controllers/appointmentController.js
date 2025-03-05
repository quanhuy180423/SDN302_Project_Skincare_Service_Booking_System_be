import { CREATED, OK } from "../config/response.config.js";
import appointmentService from "../services/appointmentService.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyToken } from "../middleware/JWTAction.js";

const appoinmentController = {
  getMyAppointments: catchAsync(async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = verifyToken(token);
    const appointments = await appointmentService.getMyAppointments(
      user.id,
      req.query
    );
    return OK(res, "Get all appointments successfully", appointments);
  }),

  createAppointment: catchAsync(async (req, res) => {
    const appointments = await appointmentService.createAppointments(req.body);
    return CREATED(res, "Create appointment successfully", appointments);
  }),

  getAppointmentById: catchAsync(async (req, res) => {
    const appointments = await appointmentService.getAppointmentById(
      req.params.id
    );
    return OK(res, "Get appointment by ID successfully", appointments);
  }),

  getAllAppointments: catchAsync(async (req, res) => {
    const appointments = await appointmentService.getAllAppointments(req.query);
    return OK(res, "Get all appointments successfully", appointments);
  }),

  changeAppointmentStatus: catchAsync(async (req, res) => {
    const { status } = req.body;
    const appointments = await appointmentService.changeAppointmentStatus(
      req.params.id,
      status
    );
    return OK(res, "Confirm appointment successfully", appointments);
  }),
};

export default appoinmentController;
