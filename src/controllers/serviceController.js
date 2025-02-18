import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../config/response.config";
import serviceService from "../services/serviceService";
import catchAsync from "../utils/catchAsync";

const serviceController = {
  getAllServices: catchAsync(async (req, res) => {
    try {
      const services = await serviceService.getAllServices();
      return OK(res, "Get all services successfully", services);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  getServiceById: catchAsync(async (req, res) => {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      if (!service) {
        return NOT_FOUND(res, "Service not found");
      }
      return OK(res, "Get service successfully", service);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  createService: catchAsync(async (req, res) => {
    try {
      const newService = await serviceService.createService(req.body);
      return CREATED(res, "Create service successfully", newService);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  updateService: catchAsync(async (req, res) => {
    try {
      const updateService = await serviceService.updateService(
        req.params.id,
        req.body
      );
      return OK(res, "Update service successfully", updateService);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  deleteService: catchAsync(async (req, res) => {
    try {
      const deleteService = await serviceService.deleteService(req.params.id);
      return OK(res, "Delete service successfully", deleteService);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  getAllServicesByAdmin: catchAsync(async (req, res) => {
    try {
      const services = await serviceService.getAllServicesByAdmin();
      return OK(res, "Get all services successfully", services);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  getServiceByIdByAdmin: catchAsync(async (req, res) => {
    try {
      const service = await serviceService.getServiceByIdByAdmin(req.params.id);
      return OK(res, "Get service successfully", service);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  updateStatusByAdmin: catchAsync(async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const updateStatus = await serviceService.updateStatusByAdmin(id, status);
      if (!updateStatus) {
        return NOT_FOUND(res, "Service not found");
      }
      return OK(res, "Update status successfully", updateStatus);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  getAllSingleServices: catchAsync(async (req, res) => {
    try {
      const services = await serviceService.getAllSingleServices();
      if (!services) {
        return NOT_FOUND(res, "Service not found");
      }
      return OK(res, "Get all services successfully", services);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
  getAllComboServices: catchAsync(async (req, res) => {
    try {
      const services = await serviceService.getAllComboServices();
      if (!services) {
        return NOT_FOUND(res, "Service not found");
      }
      return OK(res, "Get all services successfully", services);
    } catch (error) {
      return BAD_REQUEST(res, error.message);
    }
  }),
};

export default serviceController;
