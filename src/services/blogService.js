import { Blog } from "../models";

const blogService = {
    createBlog: async (data) => {
        const response = await Blog.create(date);
        return response;
    }
}
export default blogService;