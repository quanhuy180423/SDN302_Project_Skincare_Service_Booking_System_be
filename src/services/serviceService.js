import Service from "../models/Service";
import APIError from "../utils/APIError";
import _ from "lodash";

const serviceService = {
  getAllServices: async (query) => {
    const { sortBy, limit, page, q, ...rest } = query;
    const filter = { ...rest, available: true };
    const options = {
      sortBy: sortBy || "createdAt",
      limit: limit ? parseInt(limit) : 20,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ["serviceName"],
      q: q ?? "",
    };
    return await Service.paginate(filter, options);
  },
  getServiceById: async (id) => {
    try {
      const service = await Service.findOne({ _id: id, available: true });
      return service;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  createService: async (service) => {
    try {
      // Kiểm tra nếu có subServices
      if (service.subServices && service.subServices.length > 0) {
        // Tìm tất cả các dịch vụ có ID trùng với subServices
        const subServiceDocs = await Service.find({
          _id: { $in: service.subServices },
        });

        // Kiểm tra xem tất cả các subServices có phải là "single"
        const invalidSubServices = subServiceDocs.filter(
          (sub) => sub.category !== "single"
        );

        if (invalidSubServices.length > 0) {
          throw new Error(
            "Một hoặc nhiều subServices không thuộc loại 'single'."
          );
        }
      }

      // Nếu kiểm tra hợp lệ, tạo service mới
      const newService = await Service.create(service);
      return newService;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateService: async (serviceID, updateData) => {
    try {
      if (updateData.subServices && updateData.subServices.length > 0) {
        const subServiceDocs = await Service.find({
          _id: { $in: updateData.subServices },
        });
        const invalidSubServices = subServiceDocs.filter(
          (sub) => sub.category !== "single"
        );
        if (invalidSubServices.length > 0) {
          throw new APIError(
            400,
            "Một hoặc nhiều subServices không thuộc loại 'single'."
          );
        }
      }

      const updateService = await Service.findByIdAndUpdate(
        serviceID,
        { $set: updateData },
        { new: true }
      );

      if (!updateService) {
        throw new APIError(404, "Service not found");
      }
      return updateService;
    } catch (error) {
      throw new APIError(404, error.message);
    }
  },
  deleteService: async (id) => {
    try {
      if (!Service.findById(id)) {
        throw new Error("Service not found");
      }
      const deleteService = await Service.findByIdAndUpdate(
        id,
        { available: false },
        { new: true }
      );
      return deleteService;
    } catch (error) {
      throw new APIError(404, error.message);
    }
  },
  getAllSingleServices: async (query) => {
    const { sortBy, limit, page, q, ...rest } = query;
    const filter = { ...rest, category: "single", available: true };
    const options = {
      sortBy: sortBy || "createdAt",
      limit: limit ? parseInt(limit) : 20,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ["serviceName"],
      q: q ?? "",
    };
    return await Service.paginate(filter, options);
  },
  getAllComboServices: async (query) => {
    const { sortBy, limit, page, q, ...rest } = query;
    const filter = { ...rest, category: "combo", available: true };
    const options = {
      sortBy: sortBy || "createdAt",
      limit: limit ? parseInt(limit) : 20,
      page: page ? parseInt(page) : 1,
      allowSearchFields: ["serviceName"],
      q: q ?? "",
    };
    return await Service.paginate(filter, options);
  },
};
export default serviceService;
