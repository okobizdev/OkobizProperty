"use client";
import { BlogList } from "./BlogList";
import { Blog } from "@/types/blogTypes/blogTypes";
import Link from "next/link";
import SectionTitle from "@/utilits/SectionTitle";

interface BlogSectionProps {
    blogs: Blog[];
}

export const BlogSection = ({ blogs, }: BlogSectionProps) => {
    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-2 lg:px-2">
            <div className="text-center mb-4">
                <SectionTitle
                    title=" Our Latest Blogs"
                    subTitle="Discover insights, stories, and expertise from our team. Stay updated with the latest trends and knowledge."
                />
            </div>

            <BlogList blogs={blogs} />
            <div className="flex justify-center items-center">
                <Link href="/blog" className="inline-block px-3 py-0 border border-gray-200 rounded-md text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                    View All Blogs &rarr;
                </Link>
            </div>
        </div>
    );
};
