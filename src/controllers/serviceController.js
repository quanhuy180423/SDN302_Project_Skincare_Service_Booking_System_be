import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../config/response.config";
import serviceService from "../services/serviceService";
import catchAsync from "../utils/catchAsync";
import APIError from "../utils/APIError";
import { query } from "express";

const serviceController = {
  getAllServices: catchAsync(async (req, res) => {
    const services = await serviceService.getAllServices(req.query);

    return OK(res, "Get all services successfully", services);
  }),
  getServiceById: catchAsync(async (req, res) => {
    const service = await serviceService.getServiceById(req.params.id);

    if (!service) {
      throw new APIError(404, "Service not found");
    }

    return OK(res, "Get service successfully", service);
  }),
  createService: catchAsync(async (req, res) => {
    const newService = await serviceService.createService(req.body);

    if (!newService) {
      throw new APIError(404, "Create new service failed");
    }

    return CREATED(res, "Create service successfully", newService);
  }),
  updateService: catchAsync(async (req, res) => {
    const serviceID = req.params.id;
    const updateData = req.body;
    const result = await serviceService.updateService(serviceID, updateData);

    return OK(res, "Update service successfully", result);
  }),
  deleteService: catchAsync(async (req, res) => {
    const serviceID = req.params.id;
    const result = await serviceService.deleteService(serviceID);

    return OK(res, "Delete service successfully", result);
  }),
  getAllServicesByAdmin: catchAsync(async (req, res) => {
    const services = await serviceService.getAllServicesByAdmin(req.query);
    return OK(res, "Get all services successfully", services);
  }),
  getServiceByIdByAdmin: catchAsync(async (req, res) => {
    const service = await serviceService.getServiceByIdByAdmin(req.params.id);
    return OK(res, "Get service successfully", service);
  }),
  updateStatusByAdmin: catchAsync(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const updateStatus = await serviceService.updateStatusByAdmin(id, status);
    if (!updateStatus) {
      return NOT_FOUND(res, "Service not found");
    }
    return OK(res, "Update status successfully", updateStatus);
  }),
  getAllSingleServices: catchAsync(async (req, res) => {
    const services = await serviceService.getAllSingleServices(query);
    if (!services) {
      return NOT_FOUND(res, "Service not found");
    }
    return OK(res, "Get all services successfully", services);
  }),
  getAllComboServices: catchAsync(async (req, res) => {
    const services = await serviceService.getAllComboServices(query);
    if (!services) {
      return NOT_FOUND(res, "Service not found");
    }
    return OK(res, "Get all services successfully", services);
  }),
};

export default serviceController;
