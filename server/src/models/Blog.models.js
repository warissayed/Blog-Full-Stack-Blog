import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const BlogModel = mongoose.model("Blog", blogSchema);
export default BlogModel;
