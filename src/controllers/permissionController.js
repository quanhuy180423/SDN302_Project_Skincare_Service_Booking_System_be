import permissionService from '../services/permissionService';
import { BAD_REQUEST, OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from '../config/response.config';

const permissionController = {
    // Cập nhật role cho user
    updateRole: async (req, res) => {
        try {
            const { userId } = req.params;

            console.log("userId", userId);
            // Lấy role từ request body được gửi lên từ form hoặc JSON payload
            // Frontend có thể gửi dữ liệu thông qua:
            // 1. Form data: <form method="PUT">
            // 2. Fetch/Axios request với body: { role: "staff" }
            const { role } = req.body;

            if (!['admin', 'staff', 'guest'].includes(role)) {
                return BAD_REQUEST(res, "Invalid role");
            }

            const result = await permissionService.updateUserRole(userId, role);
            if (!result.success) {
                return NOT_FOUND(res, result.message);
            }

            return OK(res, result.message, result.data);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Thêm permissions cho user
    addPermissions: async (req, res) => {
        try {
            const { userId } = req.params;
            const { permissions } = req.body;

            if (!Array.isArray(permissions)) {
                return BAD_REQUEST(res, "Permissions must be an array");
            }

            const result = await permissionService.addPermissions(userId, permissions);
            if (!result.success) {
                return NOT_FOUND(res, result.message);
            }

            return OK(res, result.message, result.data);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Xóa permissions của user
    removePermissions: async (req, res) => {
        try {
            const { userId } = req.params;
            const { permissions } = req.body;

            if (!Array.isArray(permissions)) {
                return BAD_REQUEST(res, "Permissions must be an array");
            }

            const result = await permissionService.removePermissions(userId, permissions);
            if (!result.success) {
                return NOT_FOUND(res, result.message);
            }

            return OK(res, result.message, result.data);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Lấy danh sách tất cả permissions có thể
    getAllPermissions: async (req, res) => {
        try {
            const permissions = permissionService.getAllPossiblePermissions();
            return OK(res, "Permissions retrieved successfully", permissions);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    },

    // Kiểm tra permissions của user
    getUserPermissions: async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await permissionService.checkUserPermissions(userId);
            
            if (!result.success) {
                return NOT_FOUND(res, result.message);
            }

            return OK(res, "User permissions retrieved successfully", result.data);
        } catch (error) {
            return INTERNAL_SERVER_ERROR(res, error.message);
        }
    }
};

export default permissionController; 