import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
    {
        Title: { type: String, require: true },
        shortDescription: { type: String, require: true },
        Image: { type: String, require: true },
        Content: { type: String, require: true },
        isDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
)

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
