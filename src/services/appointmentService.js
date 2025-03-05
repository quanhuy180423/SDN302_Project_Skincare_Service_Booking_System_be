import moment from "moment";
import Appointment from "../models/Appointment";
import Service from "../models/Service";
import User from "../models/User";
import APIError from "../utils/APIError";
import { populate } from "dotenv";

const appoinmentService = {
  getMyAppointments: async (customerId, query) => {
    const { sortBy, limit, page, fields, q, ...filter } = query;
    const newFilter = { ...filter, customer: customerId };
    const options = {
      sortBy: sortBy || "createdAt",
      limit: limit ? parseInt(limit) : 20,
      page: page ? parseInt(page) : 1,
      fields,
      q: q ?? "",
      populate: "customer service therapist",
    };

    const appointments = await Appointment.paginate(newFilter, options);

    if (!appointments) {
      throw new APIError(404, "Appointments not found");
    }
    return appointments;
  },
  createAppointments: async ({ customerId, serviceId, therapistId, dates }) => {
    if (!customerId || !serviceId || !therapistId) {
      throw new APIError(400, "Missing required fields");
    }

    const customer = await User.findById(customerId);
    const service = await Service.findById(serviceId);
    const therapist = await User.findById(therapistId);

    if (!customer) {
      throw new APIError(404, "Customer not found");
    }
    if (!service) {
      throw new APIError(404, "Service not found");
    }
    if (!therapist) {
      throw new APIError(404, "Therapist not found");
    }

    if (!Array.isArray(dates) || dates.length === 0) {
      throw new APIError(400, "Invalid dates array");
    }

    let formattedDates = [];

    // Lấy ngày đầu tiên từ request
    let firstDate = dates[0];
    if (!firstDate.day || !firstDate.time) {
      throw new APIError(400, "Each date object must contain 'day' and 'time'");
    }

    let currentDay = new Date(firstDate.day);
    if (isNaN(currentDay.getTime())) {
      throw new APIError(400, `Invalid day format: ${firstDate.day}`);
    }

    let currentTime = moment(firstDate.time, "HH:mm", true);
    if (!currentTime.isValid()) {
      throw new APIError(
        400,
        `Invalid time format: ${firstDate.time}. Expected format: HH:mm`
      );
    }

    formattedDates.push({ day: currentDay, time: currentTime.format("HH:mm") });

    // Nếu dịch vụ là combo, tự động thêm ngày tiếp theo dựa vào subServices
    if (
      service.category === "combo" &&
      Array.isArray(service.subServices) &&
      service.subServices.length > 0
    ) {
      for (let i = 1; i < service.subServices.length; i++) {
        currentDay = new Date(currentDay);
        currentDay.setDate(currentDay.getDate() + 1); // Tăng thêm 1 ngày cho mỗi dịch vụ con

        formattedDates.push({
          day: new Date(currentDay),
          time: currentTime.format("HH:mm"), // Giữ nguyên giờ
        });
      }
    }

    const appointment = await Appointment.create({
      customer: customerId,
      service: serviceId,
      therapist: therapistId,
      date: formattedDates,
    });

    return appointment;
  },
  getAppointmentById: async (id) => {
    const appointment = await Appointment.findById(id)
      .populate("customer")
      .populate("service")
      .populate("therapist")
      .exec();
    if (!appointment) {
      throw new APIError(404, "Appointment not found");
    }
    return appointment;
  },

  getAllAppointments: async (query) => {
    const { sortBy, limit, page, fields, q, ...filter } = query;
    const options = {
      sortBy: sortBy || "createdAt",
      limit: limit ? parseInt(limit) : 20,
      page: page ? parseInt(page) : 1,
      fields,
      q: q ?? "",
      populate: "customer service therapist",
    };
    const appointments = await Appointment.paginate(filter, options);
    if (!appointments) {
      throw new APIError(404, "Appointments not found");
    }
    return appointments;
  },

  changeAppointmentStatus: async (id, status) => {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new APIError(404, "Appointment not found");
    }
    appointment.status = status;
    await appointment.save();
    return appointment;
  },
};

export default appoinmentService;
