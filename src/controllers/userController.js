import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from "../config/response.config";
import userService from "../services/userService";
import regexPatterns, { phoneVN } from "../utils/toRegex";

const userController = {
    createUser: async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;
            if (!email || !password || !name || !phone) {
                return BAD_REQUEST(res, "Missing required fields");
            } else if (!regexPatterns.email(email)) {
                return BAD_REQUEST(res, "Invalid email format");
            } else if (password.length < 6) {
                return BAD_REQUEST(res, "Password must be at least 6 characters long");
            }
            const response = await userService.createUser({ name, email, password, phone });
            if (!response.success) {
                // Xử lý các trường hợp lỗi khác nhau
                switch (response.statusCode) {
                    case 409:
                        return BAD_REQUEST(res, "Email already exists");
                    case 500:
                        return INTERNAL_SERVER_ERROR(res);
                    default:
                        return BAD_REQUEST(res, response.message);
                }
            }

            return CREATED(res, "User registered successfully", response.data);


        } catch (error) {
            console.log(error);
            return INTERNAL_SERVER_ERROR(res, "Error from server");
        }
    },

    getAllUsers: async (req, res) => {
        const result = await userService.getAllUser();
        return res.status(result.EC).json(result);
    },

    getUserById: async (req, res) => {
        const { id } = req.params;
        const result = await userService.getUserById(id);
        return res.status(result.EC).json(result);
    },

    updateUserById: async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const result = await userService.updateUserById(id, data);
        return res.status(result.EC).json(result);
    },

    updateStatusUserById: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const result = await userService.updateStatusUserById(id, status);
        return res.status(result.EC).json(result);
    },

    changePassword: async (req, res) => {
        const { id, oldPassword, newPassword } = req.body;
        try {
            const result = await userService.changePassword({ id, oldPassword, newPassword });
            return res.status(200).json({ EC: 200, EM: "Password changed successfully", DT: result });
        } catch (error) {
            return res.status(error.status || 500).json({ EC: error.status || 500, EM: error.message, DT: "" });
        }
    },

    deleteUserById: async (req, res) => {
        const { id } = req.params;
        const result = await userService.deleteUserById(id);
        return res.status(result.EC).json(result);
    }
};

export default userController;