import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Upload,
  Popconfirm,
  message,
  Image,
  Tooltip,
} from "antd";
import { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlogServices from "../services/blog.services";
import { baseUrl } from "../constants/env";
import DOMPurify from "dompurify";

const {
  processAddBlog,
  processDeleteBlog,
  processEditBlog,
  processEditBlogField,
  processGetBlogs,
} = BlogServices;




const BlogManagement = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();



  const {
    data: blogRes,
    isLoading: isBlogLoading,
    isError: isBlogError,
  } = useQuery({
    queryKey: ["blogs", currentPage, pageSize],
    queryFn: () => processGetBlogs(currentPage, pageSize),
    keepPreviousData: true,
  });
  const blogs = blogRes?.data || [];
  const totalBlogs = blogRes?.totalBlogs || 0;

  useEffect(() => {
    if (isBlogError) {
      message.error("Error fetching blogs");
    }
  }, [isBlogError]);


  const { mutate: addBlog, isLoading: isAdding } = useMutation({
    mutationFn: processAddBlog,
    onSuccess: () => {
      message.success("Blog added successfully");
      queryClient.invalidateQueries(["blogs"]);
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add blog");
    },
  });

  const { mutate: editBlog, isLoading: isEditing } = useMutation({
    mutationFn: ({ id, data }) => processEditBlog(id, data),
    onSuccess: () => {
      message.success("Blog updated successfully");
      queryClient.invalidateQueries(["blogs"]);
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update blog");
    },
  });

  const { mutate: editBlogField } = useMutation({
    mutationFn: ({ id, data }) => processEditBlogField(id, data),
    onSuccess: () => {
      message.success("Blog field updated successfully");
      queryClient.invalidateQueries(["blogs"]);
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update blog field");
    },
  });

  const { mutate: deleteBlog, isLoading: isDeleting } = useMutation({
    mutationFn: processDeleteBlog,
    onSuccess: () => {
      message.success("Blog deleted successfully");
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: () => {
      message.error("Failed to delete blog");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
    setEditingBlog(null);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    return false;
  };

  const handleFormSubmit = async (values) => {
    try {
      const isImageUpdated = fileList.length > 0 && fileList[0].originFileObj;

      if (editingBlog) {
        if (isImageUpdated) {
          const formData = new FormData();
          formData.append("blogTitle", values.blogTitle);
          formData.append("blogDescription", values.blogDescription || "");
          values.tags?.forEach((tag) => formData.append("tags", tag));
          formData.append("blogImage", fileList[0].originFileObj);
          editBlog({ id: editingBlog._id, data: formData });
        } else {
          const payload = {
            blogTitle: values.blogTitle,
            blogDescription: values.blogDescription,
            tags: values.tags,
          };
          editBlogField({ id: editingBlog._id, data: payload });
        }
      } else {
        const formData = new FormData();
        formData.append("blogTitle", values.blogTitle);
        formData.append("blogDescription", values.blogDescription || "");
        values.tags?.forEach((tag) => formData.append("tags", tag));
        if (fileList.length > 0 && fileList[0].originFileObj) {
          formData.append("blogImage", fileList[0].originFileObj);
        }

        addBlog(formData);
      }
    } catch (err) {
      console.error("Error submitting blog form:", err);
      message.error("Failed to submit blog");
    }
  };

  const handleEdit = (record) => {
    setEditingBlog(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      blogTitle: record.blogTitle,
      blogDescription: record.blogDescription,
      feature: record.feature?._id,
      tags: record.tags,
    });

    if (record.blogImage) {
      setFileList([
        {
          uid: "-1",
          name: record.blogImage,
          status: "done",
          url: `${baseUrl}${record.blogImage}`,
        },
      ]);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "blogImage",
      key: "blogImage",
      render: (imgUrl) => (
        <Image
          src={`${baseUrl}${imgUrl}`}
          width={100}
          alt="blog"
          className="w-[200px] rounded"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "blogTitle",
      key: "blogTitle",
    },
    {
  title: "Description",
  dataIndex: "blogDescription",
  key: "blogDescription",
  width: 300,
  render: (text) => {
    if (!text) return null;

    const cleanHtml = DOMPurify.sanitize(text);
    const plainText = cleanHtml.replace(/<[^>]+>/g, ""); // strip tags for tooltip
    const isTextLong = plainText.length > 100;

    return (
      <Tooltip
        title={isTextLong ? (
          <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
        ) : null}
        placement="topLeft"
      >
        <div
          className="line-clamp-3 overflow-hidden text-ellipsis cursor-pointer text-gray-700"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: "72px",
            lineHeight: "24px",
          }}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </Tooltip>
    );
  },
}
,
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => tags?.join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => deleteBlog(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button onClick={() => setIsModalVisible(true)}>
          <PlusSquareOutlined /> Add Blog
        </Button>
      </div>

      <Table
        dataSource={blogs}
        columns={columns}
        rowKey="_id"
        loading={isBlogLoading || isDeleting}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalBlogs,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          showQuickJumper: true,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} blogs`,
        }}
      />

      <Modal
        title={editingBlog ? "Edit Blog" : "Create Blog"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="blogTitle"
            label="Blog Title"
            rules={[{ required: true, message: "Please enter the blog title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="blogDescription" label="Blog Description">
            <ReactQuill />
          </Form.Item>



          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Enter tags" />
          </Form.Item>

          <Form.Item label="Blog Image">
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              onRemove={handleRemoveImage}
              multiple={false}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            className="w-full"
            loading={isAdding || isEditing}
          >
            {editingBlog ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
