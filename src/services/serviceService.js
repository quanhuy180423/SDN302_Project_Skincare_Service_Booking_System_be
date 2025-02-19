import Service from "../models/Service";

const serviceService = {
  getAllServices: async () => {
    try {
      const services = await Service.find({ available: true });
      return services;
    } catch (error) {
      throw new Error("Error fetching services");
    }
  },
  getServiceById: async (id) => {
    try {
      const service = await Service.findOne({ _id: id, available: true });
      return service;
    } catch (error) {
      throw new Error("Service not found");
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
      throw new Error("Một hoặc nhiều subServices không thuộc loại 'single'.");
    }
  },
  updateService: async (id, service) => {
    if (service.subServices && service.subServices.length > 0) {
      const subServiceDocs = await Service.find({
        _id: { $in: service.subServices },
      });
      const invalidSubServices = subServiceDocs.filter(
        (sub) => sub.category !== "single"
      );
      if (invalidSubServices.length > 0) {
        throw new Error(
          "Một hoặc nhiều subServices không thuộc loại 'single'."
        );
      }
    }

    const updateService = await Service.findByIdAndUpdate(
      id,
      { $set: service },
      { new: true }
    );
    return updateService;
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
      throw new Error("Error deleting service");
    }
  },
  getAllServicesByAdmin: async () => {
    try {
      const services = await Service.find();
      return services;
    } catch (error) {
      throw new Error("Error fetching services");
    }
  },
  getServiceByIdByAdmin: async (id) => {
    try {
      if (!Service.findById(id)) {
        throw new Error("Service not found");
      }
      const service = await Service.findById(id);
      return service;
    } catch (error) {
      throw new Error("Error fetching service");
    }
  },
  updateStatusByAdmin: async (id, status) => {
    try {
      const service = await Service.findById(id);
      if (!service) {
        throw new Error("Service not found");
      }
      service.available = status;
      await service.save();
      return service;
    } catch (error) {
      throw new Error("Error updating status");
    }
  },
  getAllSingleServices: async () => {
    try {
      const services = await Service.find({ category: "single" });
      return services;
    } catch (error) {
      throw new Error("Error fetching services");
    }
  },
  getAllComboServices: async () => {
    try {
      const services = await Service.find({ category: "combo" });
      return services;
    } catch (error) {
      throw new Error("Error fetching services");
    }
  },
};
export default serviceService;
