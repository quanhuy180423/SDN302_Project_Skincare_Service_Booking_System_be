import { OK } from "../config/response.config";
import Service from "../models/Service";
import adminService from "../services/adminService";
import catchAsync from "../utils/catchAsync";
import { query } from "express";

const adminController = {
  getAllServices: catchAsync(async (req, res) => {
    const services = await adminService.getAllServices(req.query);
    return OK(res, "Get all services successfully", services);
  }),

  getServiceByIdByAdmin: catchAsync(async (req, res) => {
    const service = await adminService.getServiceByIdByAdmin(req.params.id);
    return OK(res, "Get service successfully", service);
  }),

  updateStatusByAdmin: catchAsync(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const updateStatus = await adminService.updateStatusByAdmin(id, status);
    if (!updateStatus) {
      return NOT_FOUND(res, "Service not found");
    }
    return OK(res, "Update status successfully", updateStatus);
  }),

  getAllSingleServices: catchAsync(async (req, res) => {
    const services = await adminService.getAllSingleServices(req.query);
    if (!services) {
      return NOT_FOUND(res, "Service not found");
    }
    return OK(res, "Get all services successfully", services);
  }),

  getAllComboServices: catchAsync(async (req, res) => {
    const services = await adminService.getAllComboServices(req.query);
    if (!services) {
      return NOT_FOUND(res, "Service not found");
    }
    return OK(res, "Get all services successfully", services);
  }),

  searchService: catchAsync(async (req, res) => {
    const keyword = req.params.key;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const services = await Service.find({
      $or: [
        { serviceName: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    });

    if (services.length > 0) {
      res.setHeader("Cache-Control", "no-cache");
      return res.status(200).json({ message: "Services found", services });
    } else {
      res.setHeader("Cache-Control", "no-cache");
      return res
        .status(200)
        .json({ message: "No services found", services: [] });
    }
  }),
};

export default adminController;
