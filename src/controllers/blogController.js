import { OK, NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from "../config/response.config";
import blogService from "../services/blogService";

const blogController = {
    // Tạo blog mới
    createBlog: async (req, res) => {
        try {
            const response = await blogService.createBlog(req.body);
            return OK(res, "Create blog success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },
    //lấy blog chưa xóa , đã confirm
    getAllBlogsUser: async (req, res) => {
        try {
            const response = await blogService.getAllBlogsUser();
            return OK(res, "Get all blogs success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },
    // Lấy tất cả blog chưa bị xóa mềm
    getAllBlogs: async (req, res) => {
        try {
            const response = await blogService.getAllBlogs();
            return OK(res, "Get all blogs success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Lấy chi tiết blog theo ID
    getBlogById: async (req, res) => {
        try {
            const { id } = req.params;
            const response = await blogService.getBlogById(id);
            if (!response.success) return NOT_FOUND(res, response.message);
            return OK(res, "Get blog success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Cập nhật blog theo ID
    updateBlog: async (req, res) => {
        try {
            const { id } = req.params;
            const response = await blogService.updateBlog(id, req.body);
            if (!response.success) return NOT_FOUND(res, response.message);
            return OK(res, "Update blog success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Xóa mềm blog theo ID
    deleteBlogStaff: async (req, res) => {
        try {
            const { id } = req.params;
            const response = await blogService.deleteBlogStaff(id);
            if (!response.success) return NOT_FOUND(res, response.message);
            return OK(res, "Delete blog success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    deleteBlogAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const response = await blogService.deleteBlogAdmin(id);
            if (!response.success) return NOT_FOUND(res, response.message);
            return OK(res, "Delete blog success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Lấy danh sách blog đã xác nhận
    getConfirmedBlogs: async (req, res) => {
        try {
            const response = await blogService.getConfirmedBlogs();
            return OK(res, "Get confirmed blogs success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Xác nhận bài viết theo ID
    confirmBlog: async (req, res) => {
        try {
            const { id } = req.params;
            const response = await blogService.confirmBlog(id);
            if (!response.success) return NOT_FOUND(res, response.message);
            return OK(res, "Confirm blog success", response);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    }
};

export default blogController;
