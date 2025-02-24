const { verifyToken } = require('../middleware/JWTAction');
const { User } = require('../models');

const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            // Get token from cookie or authorization header
            const token = req.cookies?.jwt || req.headers?.authorization?.split(' ')[1];
            
            console.log("token", token);
            if (!token) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "No authentication token found"
                });
            }

            // Verify token
            const decoded = verifyToken(token);

            console.log("decoded", decoded.id);
            if (!decoded) {
                // Clear invalid cookies
                res.clearCookie('jwt');
                res.clearCookie('refreshToken');
                
                return res.status(401).json({
                    success: false,
                    statusCode: 401, 
                    message: "Invalid or expired token"
                });
            }

            // Find user in database
            // Trong MongoDB, _id là trường mặc định được tạo tự động
            // Thay vì tìm theo id, chúng ta nên tìm theo _id hoặc email
            const user = await User.findOne({ email: decoded.email });
            console.log("decoded email:", decoded.email);
            console.log("user found:", user);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "User not found"
                });
            }

            // Check role
            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    statusCode: 403,
                    message: "Forbidden: Required role not found"
                });
            }

            // Save user info to request
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            next();
        } catch (error) {
            console.log('Role check error:', error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal server error"
            });
        }
    };
};

// Hàm checkPermission nhận vào một mảng các quyền cần kiểm tra
const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            // Kiểm tra token từ cookie hoặc authorization header
            const token = req.cookies?.jwt || req.headers?.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "No authentication token found"
                });
            }

            // Verify token
            const decoded = verifyToken(token);
            if (!decoded) {
                // Clear invalid cookies
                res.clearCookie('jwt');
                res.clearCookie('refreshToken');
                
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "Invalid or expired token"
                });
            }

            // Tìm thông tin user trong database
            const user = await User.findOne({ email: decoded.email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "User not found"
                });
            }

            // Lưu thông tin user vào request để sử dụng ở các middleware khác
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            };

            // Kiểm tra permissions
            if (requiredPermissions && requiredPermissions.length > 0) {
                // Kiểm tra user có permissions array không
                if (!user.permissions || !Array.isArray(user.permissions)) {
                    return res.status(403).json({
                        success: false,
                        statusCode: 403,
                        message: "User has no permissions"
                    });
                }

                // Kiểm tra từng permission yêu cầu
                const hasAllPermissions = requiredPermissions.every(
                    permission => user.permissions.includes(permission)
                );

                if (!hasAllPermissions) {
                    return res.status(403).json({
                        success: false,
                        statusCode: 403,
                        message: "Forbidden: Required permissions not found"
                    });
                }
            }

            next();
        } catch (error) {
            console.log('Permission check error:', error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal server error"
            });
        }
    };
};

module.exports = {
    checkRole,
    checkPermission
}; 