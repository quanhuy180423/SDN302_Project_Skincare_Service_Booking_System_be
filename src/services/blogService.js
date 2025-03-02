import Blog from "../models/Blog";

const blogService = {
    // Tạo blog mới
    createBlog: async (data) => {
        try {
            const newBlog = new Blog(data);
            await newBlog.save();
            return { success: true, data: newBlog };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    getAllBlogsUser: async () => {
        try {
            return await Blog.find({ isDelete: false, isConfirm: true }).populate("author");
        } catch (error) {
            throw new Error(error.message);
        }
    },


    // Lấy tất cả blog (chỉ lấy blog chưa bị xóa mềm)
    getAllBlogs: async () => {
        try {
            const blogs = await Blog.find({ isDelete: false }).populate("author");
            return { success: true, data: blogs };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Lấy chi tiết blog theo ID (chỉ lấy blog chưa bị xóa mềm)
    getBlogById: async (id) => {
        try {
            const blog = await Blog.findOne({ _id: id, isDelete: false }).populate("author", "username email");
            if (!blog) return { success: false, message: "Blog not found" };
            return { success: true, data: blog };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Cập nhật blog (chỉ cập nhật nếu blog chưa bị xóa mềm)
    updateBlog: async (id, data) => {
        try {
            const updatedBlog = await Blog.findOneAndUpdate(
                { _id: id, isDelete: false, isConfirm: false },
                data,
                { new: true }
            );
            if (!updatedBlog) return { success: false, message: "Blog not found or deleted" };
            return { success: true, data: updatedBlog };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Xóa mềm blog (soft delete)
    deleteBlogStaff: async (id) => {
        try {
            const blog = await Blog.findById(id);
            if (!blog.isConfirm) {
                const deletedBlog = await Blog.findOneAndUpdate(
                    { _id: id },
                    { isDelete: true },
                    { new: true }
                );
                if (!deletedBlog) return { success: false, message: "Blog not found" };
                return { success: true, message: "Blog deleted successfully" };
            }
            return { success: false, message: "Cannot delete blog" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    deleteBlogAdmin: async (id) => {
        try {
            const deletedBlog = await Blog.findOneAndUpdate(
                { _id: id },
                { isDelete: true },
                { new: true }
            );
            if (!deletedBlog) return { success: false, message: "Blog not found" };
            return { success: true, message: "Blog deleted successfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Lấy danh sách blog đã xác nhận
    getConfirmedBlogs: async () => {
        try {
            const blogs = await Blog.find({ isConfirm: true, isDelete: false }).populate("author", "name email");
            return { success: true, data: blogs };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Xác nhận bài viết
    confirmBlog: async (id) => {
        try {
            const confirmedBlog = await Blog.findOneAndUpdate(
                { _id: id, isDelete: false },
                { isConfirm: true },
                { new: true }
            );
            if (!confirmedBlog) return { success: false, message: "Blog not found" };
            return { success: true, data: confirmedBlog };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

export default blogService;
