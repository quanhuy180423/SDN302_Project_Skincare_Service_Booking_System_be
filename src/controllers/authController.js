import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK, FORBIDDEN } from '../config/response.config';
import authService from '../services/authService';
import regexPatterns from '../utils/toRegex';

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return BAD_REQUEST(res, "Missing required fields");
        } else if (!regexPatterns.email(email)) {
            return BAD_REQUEST(res, "Invalid email format");
        }else if (password.length < 6) {
            return BAD_REQUEST(res, "Password must be at least 6 characters long");
        }
        const response = await authService.registerUser({ name, email, password });
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
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return BAD_REQUEST(res, "Missing email or password");
        }

        const result = await authService.loginUser(email, password);
        
        if (!result.success) {
            return BAD_REQUEST(res, result.message);
        }

        // Set JWT token in cookie if needed
        if (result.data?.tokens?.accessToken) {
            res.cookie('jwt', result.data.tokens.accessToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
        }

        return OK(res, result.message, result.data);
    } catch (error) {
        console.log(error);
        return INTERNAL_SERVER_ERROR(res);
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
        
        if (!refreshToken) {
            return BAD_REQUEST(res, "Refresh token is required");
        }

        const result = await authService.logoutUser(refreshToken);

        if (!result?.success) {
            switch (result?.statusCode) {
                case 400:
                    return BAD_REQUEST(res, result?.message);
                case 401:
                    return FORBIDDEN(res, result?.message);
                default:
                    return INTERNAL_SERVER_ERROR(res, result?.message);
            }
        }

        // Xóa cookies
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');

        return OK(res, result.message);
    } catch (error) {
        console.log('Logout controller error:', error);
        return INTERNAL_SERVER_ERROR(res);
    }
};

module.exports = {
    register,
    login,
    logout
}; 