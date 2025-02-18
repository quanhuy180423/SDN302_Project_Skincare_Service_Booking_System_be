import User from "../models/User";
import bcrypt from "bcryptjs";
const userService = {
    createUser: async (data) => {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                return {
                    success: false,
                    statusCode: 409,
                    message: "Email already exists",
                    data: null
                };
            }

            // Hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(data.password, salt);

            // Create new user
            const newUser = await User.create({
                ...data,
                password: hashedPassword,
                id: Date.now(), // Simple way to generate unique id
            });

            return {
                success: true,
                statusCode: 201,
                message: "User registered successfully",
                data: {
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        phone: newUser.phone,
                        role: newUser.role
                    }
                }
            }
        } catch (error) {
            console.log('Register error:', error);
            return {
                success: false,
                statusCode: 500,
                message: "Internal server error",
                data: null
            };
        }
    },

    getAllUser: async () => {
        try {
            let user = await User.find();
            return {
                EC: 200,
                EM: "Success",
                DT: user
            };
        } catch (error) {
            return {
                EC: 500,
                EM: "Error from server",
                DT: ""
            };
        }
    },

    getUserById: async (id) => {
        try {
            let user = await User.findById(id);
            if (user && !user.isDeleted) {
                return {
                    EC: 200,
                    EM: "Success",
                    DT: user
                };
            }
            return {
                EC: 404,
                EM: "User not found",
                DT: ""
            };
        } catch (error) {
            return {
                EC: 500,
                EM: "Error from server",
                DT: ""
            };
        }
    },

    updateUserById: async (id, data) => {
        try {
            let user = await User.findByIdAndUpdate(id, data, { new: true });
            if (user && !user.isDeleted) {
                return {
                    EC: 200,
                    EM: "User updated successfully",
                    DT: user
                };
            }
            return {
                EC: 404,
                EM: "User not found",
                DT: ""
            };
        } catch (error) {
            return {
                EC: 500,
                EM: "Error from server",
                DT: ""
            };
        }
    },

    updateStatusUserById: async (id, status) => {
        try {
            let user = await User.findByIdAndUpdate(id, { status }, { new: true });
            if (user && !user.isDeleted) {
                return {
                    EC: 200,
                    EM: "User status updated successfully",
                    DT: user
                };
            }
            return {
                EC: 404,
                EM: "User not found",
                DT: ""
            };
        } catch (error) {
            return {
                EC: 500,
                EM: "Error from server",
                DT: ""
            };
        }
    },

    changePassword: async ({ id, oldPassword, newPassword }) => {
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) throw new Error("Old password is incorrect");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return { id: user._id, message: "Password changed successfully" };
    },

    deleteUserById: async (id) => {
        try {
            let user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            if (user) {
                return {
                    EC: 204,
                    EM: "User soft deleted successfully",
                };
            }
            return {
                EC: 404,
                EM: "User not found",
                DT: ""
            };
        } catch (error) {
            return {
                EC: 500,
                EM: "Error from server",
                DT: ""
            };
        }
    }
};

export default userService;
