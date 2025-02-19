import User from "../models/User";
import bcrypt from "bcryptjs";
const _ = require('lodash');

const userService = {
    createUser: async (data) => {
        try {
            console.log(data)
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
                role: data.role,
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

    getAllUsers: async (query) => {
        const { sortBy, limit, page, fields, q, ...filter } = query;

        const newFilter = _.pick(filter, [
            '_id',
            'email',
            'role',
        ]);
        return await User.paginate(newFilter, {
            sortBy,
            limit: limit ?? 20,
            page: page ?? 1,
            fields,
            allowSearchFields: ['email'],
            q: q ?? '',
        });
    },

    getUserByRoleCustomer: async (query) => {
        const { sortBy, limit, page, q } = query;
        const filter = { role: 'user', isDeleted: false };

        return await User.paginate(filter, {
            sortBy: sortBy ?? 'createdAt',
            limit: limit ? parseInt(limit) : 20,
            page: page ? parseInt(page) : 1,
            allowSearchFields: ['email'],
            q: q ?? '',
        })
    },

    getUserByRoleStaff: async (query) => {
        const { sortBy, limit, page, q } = query;
        const filter = { role: 'staff', isDeleted: false };

        return await User.paginate(filter, {
            sortBy: sortBy ?? 'createdAt',
            limit: limit ? parseInt(limit) : 20,
            page: page ? parseInt(page) : 1,
            allowSearchFields: ['email'],
            q: q ?? '',
        })
    },
    getUserByRoleTherapist: async (query) => {
        const { sortBy, limit, page, q } = query;
        const filter = { role: 'therapist', isDeleted: false };

        return await User.paginate(filter, {
            sortBy: sortBy ?? 'createdAt',
            limit: limit ? parseInt(limit) : 20,
            page: page ? parseInt(page) : 1,
            allowSearchFields: ['email'],
            q: q ?? '',
        })
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
