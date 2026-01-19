import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Upload,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Image,
  Popconfirm,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoryService from "../services/categories.service";
import { baseUrl } from "../constants/env";

export default function CategoryManager() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.processGetCategory,
  });

  const { mutate: addCategory, isPending: adding } = useMutation({
    mutationFn: CategoryService.processAddCategory,
    onSuccess: () => {
      message.success("Category added successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleCancel();
    },
    onError: () => {
      message.error("Failed to add category");
    },
  });

  const { mutate: updateCategory, isPending: updating } = useMutation({
    mutationFn: ({ id, formData }) =>
      CategoryService.processUpdateCategory(id, formData),
    onSuccess: () => {
      message.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleCancel();
    },
    onError: () => {
      message.error("Failed to update category");
    },
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: CategoryService.processDeleteCategory,
    onSuccess: () => {
      message.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("Failed to delete category");
    },
  });

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("isActive", values.isActive);
      formData.append("displayOrder", values.displayOrder);
      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingCategory) {
        updateCategory({ id: editingCategory._id, formData });
      } else {
        addCategory(formData);
      }
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      displayOrder: category.displayOrder,
    });
    if (category.image) {
      setFileList([
        {
          uid: "-1",
          name: "category.jpg",
          status: "done",
          url: `${baseUrl}${category.image}`,
        },
      ]);
    }
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          width={80}
          height={50}
          src={`${baseUrl}${image}`}
          alt="category"
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Display Order",
      dataIndex: "displayOrder",
      key: "displayOrder",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => deleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];
  console.log(categories);
  return (
    <div className="bg-white p-8 rounded-md my-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button
          onClick={() => setIsModalVisible(true)}
          className="!bg-primary-600"
          type="primary"
        >
          <PlusSquareOutlined /> Add Category
        </Button>
      </div>

      <Table
        dataSource={categories || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="!bg-primary-600"
            loading={adding || updating}
            onClick={handleSubmit}
          >
            {editingCategory ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="Display Order"
            rules={[{ required: true, message: "Please set display order" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={() => setFileList([])}
              accept="image/*"
              maxCount={1}
            >
              {fileList.length < 1 && (
                <Button icon={<UploadOutlined />}>Select Image</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
