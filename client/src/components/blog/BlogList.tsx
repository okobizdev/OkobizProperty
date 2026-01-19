"use client";

import { BlogCard } from "@/components/card/BlogCard";
import { Blog } from "@/types/blogTypes/blogTypes";


interface BlogListProps {
    blogs: Blog[];

}

export const BlogList = ({ blogs, }: BlogListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
            ))}
        </div>
    );
};
