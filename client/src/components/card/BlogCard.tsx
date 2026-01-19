import { Card, Tag, Typography, } from 'antd';
import { CalendarOutlined, TagOutlined, EyeOutlined } from '@ant-design/icons';
import Image from "next/image";
import Link from 'next/link';
import { apiBaseUrl } from '@/config/config';

const { Title, Paragraph, Text } = Typography;
export interface Blog {
    _id: string;
    blogTitle: string;
    blogDescription: string;
    blogImage: string;
    tags?: string[];
    createdAt: string;
    slug: string;
}


export const BlogCard = ({ blog }: { blog: Blog; }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const stripHtml = (html: string) => {
        if (typeof window !== 'undefined') {
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
        }
        return html.replace(/<[^>]*>/g, '');
    };

    const truncateText = (text: string, maxLength = 150) => {
        const cleanText = stripHtml(text);
        return cleanText.length > maxLength
            ? cleanText.substring(0, maxLength) + '...'
            : cleanText;
    };

    return (
        <Link
            href={`/blog/${blog.slug}`}
            className=" font-medium transition-colors duration-200"
        >

            <Card
                hoverable
                className="h-full shadow-md hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden group"
                cover={
                    <div className="relative overflow-hidden h-48">
                        <Image
                            src={`${apiBaseUrl}${blog.blogImage}`}
                            alt={blog.blogTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                }
            >
                <div className="p-1">
                    {/* Tags */}
                    <div className="mb-3 flex flex-wrap gap-1">
                        {blog.tags?.slice(0, 3).map((tag: string, index: number) => (
                            <Tag
                                key={index}
                                color="blue"
                                className="text-xs rounded-full px-2 py-1"
                                icon={<TagOutlined />}
                            >
                                {tag.trim()}
                            </Tag>
                        ))}
                        {blog.tags && blog.tags.length > 3 && (
                            <Tag color="default" className="text-xs rounded-full px-2 py-1">
                                +{blog.tags.length - 3} more
                            </Tag>
                        )}
                    </div>

                    {/* Title */}
                    <Title
                        level={4}
                        className="mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
                        style={{ marginBottom: '8px', fontSize: '18px', lineHeight: '1.4' }}
                    >
                        {blog.blogTitle}
                    </Title>

                    {/* Description */}
                    <Paragraph
                        className="text-gray-600 mb-4 line-clamp-3"
                        style={{ marginBottom: '16px' }}
                    >
                        {truncateText(blog.blogDescription)}
                    </Paragraph>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                            <CalendarOutlined />
                            <Text className="text-xs">{formatDate(blog.createdAt)}</Text>
                        </div>

                        <div

                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                        >
                            <EyeOutlined />
                            <span className="text-xs">Read More</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};