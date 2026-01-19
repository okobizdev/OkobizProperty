"use client";

import { useState, useEffect } from "react";
import { Pagination, Spin, Typography, Empty, message } from "antd";
import { Blog } from "@/types/blogTypes/blogTypes";
import { BlogList } from "@/components/blog/BlogList";
import { fetchBlogsService } from "@/components/blog/fetchblog";



const { Title, Paragraph } = Typography;

const BlogComponent = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [pageSize] = useState(8);

    const fetchBlogs = async (page = 1) => {
        try {
            setLoading(true);
            const { blogs, total, currentPage } = await fetchBlogsService(page, pageSize);

            setBlogs(blogs);
            setTotalBlogs(total);
            setCurrentPage(currentPage);
        } catch (error) {
            console.error("error is occurred:", error);
            message.error("Something went wrong while fetching blogs");
            setBlogs([]);
            setTotalBlogs(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <div className="text-center mb-12">
                <Title
                    level={1}
                    className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                    Our Latest Blogs
                </Title>
                <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover insights, stories, and expertise from our team. Stay updated with the latest trends and knowledge.
                </Paragraph>
            </div>

            {/* Blog Grid */}
            {blogs.length === 0 ? (
                <Empty
                    description="No blogs found"
                    className="my-12"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <>
                    <BlogList blogs={blogs} />

                    {/* Pagination */}
                    {totalBlogs > pageSize && (
                        <div className="flex justify-center mt-12">
                            <Pagination
                                current={currentPage}
                                total={totalBlogs}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `Showing ${range[0]}-${range[1]} of ${total} blogs`
                                }
                                className="custom-pagination"
                                size="default"
                                responsive
                            />
                        </div>
                    )}
                </>
            )}

            {/* Global Pagination Styles */}
            <style jsx global>{`
        .custom-pagination .ant-pagination-item-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }

        .custom-pagination .ant-pagination-item:hover {
          border-color: #667eea;
        }

        .custom-pagination .ant-pagination-item:hover a {
          color: #667eea;
        }
      `}</style>
        </div>
    );
};

export default BlogComponent;
