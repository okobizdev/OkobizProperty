import { HydratedDocument, model, Model, Schema } from "mongoose";
import IBlogInterfces from "./blog.interfaces";
import SlugUtils from "../../utils/slug.utils";

const { generateSlug } = SlugUtils;

const BlogSchema = new Schema<IBlogInterfces>(
  {
    blogTitle: { type: String, default: null },
    blogImage: { type: String, default: null },
    blogVideo: { type: String, default: null },
    blogDescription: { type: String, default: null },
    tags: { type: [String], default: [] },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

BlogSchema.pre("save", async function (next) {
  const blog = this as HydratedDocument<IBlogInterfces>;
  if ((blog.isModified("blogTitle") || blog.isNew) && blog.blogTitle) {
    try {
      blog.slug = generateSlug(blog?.blogTitle as string);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  next();
});

const Blog: Model<IBlogInterfces> = model<IBlogInterfces>("Blog", BlogSchema);

export default Blog;
