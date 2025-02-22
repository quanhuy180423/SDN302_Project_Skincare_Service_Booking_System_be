import _ from "lodash";
import Service from "../models/Service";
import APIError from "../utils/APIError";

const adminService = {
  getAllServices: async (query) => {
    const { sortBy, limit, page, fields, q, ...filter } = query;

    const newFilter = _.pick(filter, [
      "_id",
      "serviceName",
      "description",
      "available",
    ]);

    return await Service.paginate(newFilter, {
      sortBy,
      limit: limit ?? 20,
      page: page ?? 1,
      fields,
      allowSearchFields: ["serviceName", "id"],
      q: q ?? "",
    });
  },

  getServiceByIdByAdmin: async (id) => {
    if (!Service.findById(id)) {
      throw new APIError(404, "Service not found");
    }
    const service = await Service.findById(id);
    return service;
  },

  updateStatusByAdmin: async (id, status) => {
    const service = await Service.findById(id);
    if (!service) {
      throw new APIError(404, "Service not found");
    }
    service.available = status;
    await service.save();
    return service;
  },
  getAllSingleServices: async (query) => {
    const { sortBy, limit, page, q, ...rest } = query;
    const filter = { ...rest, category: "single" };
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
    const filter = { ...rest, category: "combo" };
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

export default adminService;
