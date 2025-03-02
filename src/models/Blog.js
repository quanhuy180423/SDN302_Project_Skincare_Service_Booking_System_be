import mongoose, { Schema } from "mongoose";
// import { User } from "./User";

const blogSchema = mongoose.Schema(
    {
        title: { type: String, require: true },
        shortDescription: { type: String, require: true },
        image: { type: String, require: true },
        content: { type: String, require: true },
        isConfirm: { type: Boolean, default: false },
        author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        isDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
)

blogSchema.plugin(require("./plugin/index"));

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
