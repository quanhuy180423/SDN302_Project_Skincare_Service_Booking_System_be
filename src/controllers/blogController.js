import { OK } from "../config/response.config";
import blogService from "../services/blogService";

const blogController = {
    createBlog: async (req, res) => {
        const response = await blogService.createBlog(req.body)
        return OK(res, "Create blog success", response);

    }
}
export default blogController;