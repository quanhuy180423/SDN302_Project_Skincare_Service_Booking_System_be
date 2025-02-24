import User from '../models/User';

const permissionService = {
    // Cập nhật role cho user
    updateUserRole: async (userId, newRole) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "User not found"
                };
            }

            user.role = newRole;
            await user.save(); // This will trigger the pre-save middleware to update permissions

            return {
                success: true,
                statusCode: 200,
                message: "Role updated successfully",
                data: user
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: error.message
            };
        }
    },

    // Thêm permissions cho user
    addPermissions: async (userId, newPermissions) => {

        console.log("userId", userId);
        console.log("newPermissions", newPermissions);
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "User not found"
                };
            }

            console.log("user", user);

            // Lọc ra các permissions hợp lệ từ enum
            const validPermissions = newPermissions.filter(permission => 
                User.schema.path('permissions.0').enumValues.includes(permission)
            );
            console.log("validPermissions", validPermissions);

            // Kiểm tra xem user.permissions có tồn tại không
            if (!user.permissions) {
                user.permissions = [];
            }

            // Log để debug
            console.log("Current permissions:", user.permissions);
            console.log("Valid permissions to add:", validPermissions);

            // Thêm permissions mới và loại bỏ các giá trị trùng lặp
            // Thêm permissions mới vào mảng hiện tại
            user.permissions = [...new Set([...user.permissions, ...validPermissions])];
            
        

            // Lưu và kiểm tra lỗi
            try {
                await user.save();
            } catch (err) {
                console.error("Error saving permissions:", err);
                throw err;
            }

            return {
                success: true,
                statusCode: 200,
                message: "Permissions added successfully",
                data: user
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: error.message
            };
        }
    },

    // Xóa permissions của user
    removePermissions: async (userId, permissionsToRemove) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "User not found"
                };
            }

            user.permissions = user.permissions.filter(
                permission => !permissionsToRemove.includes(permission)
            );
            await user.save();

            return {
                success: true,
                statusCode: 200,
                message: "Permissions removed successfully",
                data: user
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: error.message
            };
        }
    },

    // Lấy danh sách tất cả permissions có thể
    getAllPossiblePermissions: () => {
        return User.schema.path('permissions.0').enumValues;
    },

    // Kiểm tra permissions của user
    checkUserPermissions: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "User not found"
                };
            }

            return {
                success: true,
                statusCode: 200,
                data: {
                    role: user.role,
                    permissions: user.permissions
                }
            };
        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: error.message
            };
        }
    }
};

export default permissionService; 