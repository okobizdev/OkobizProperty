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
  Select,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../constants/env";
import subCategoryService from "../services/subCategories.service";
import CategoryService from "../services/categories.service";

export default function SubCategoryManager() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedListingType, setSelectedListingType] = useState(null);

  const { data: subCategories, isLoading } = useQuery({
    queryKey: ["subCategories"],
    queryFn: subCategoryService.processGetSubCategory,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.processGetCategory,
  });

  const { mutate: addSubCategory, isPending: adding } = useMutation({
    mutationFn: subCategoryService.processAddSubCategory,
    onSuccess: () => {
      message.success("Sub-category added successfully");
      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
      handleCancel();
    },
    onError: () => message.error("Failed to add sub-category"),
  });

  const { mutate: updateSubCategory, isPending: updating } = useMutation({
    mutationFn: ({ id, formData }) =>
      subCategoryService.processUpdateSubCategory(id, formData),
    onSuccess: () => {
      message.success("Sub-category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
      handleCancel();
    },
    onError: () => message.error("Failed to update sub-category"),
  });

  const { mutate: deleteSubCategory } = useMutation({
    mutationFn: subCategoryService.processDeleteSubCategory,
    onSuccess: () => {
      message.success("Sub-category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
    },
    onError: () => message.error("Failed to delete sub-category"),
  });

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setEditingSubCategory(null);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("category", values.category);
      formData.append("isActive", values.isActive ? "true" : "false");
      formData.append("displayOrder", values.displayOrder);
      formData.append(
        "requiresDateRange",
        values.requiresDateRange ? "true" : "false"
      );
      formData.append(
        "requiresGuestCount",
        values.requiresGuestCount ? "true" : "false"
      );
      values.allowedListingTypes.forEach((type, index) => {
        formData.append(`allowedListingTypes[${index}]`, type);
      });
      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingSubCategory) {
        updateSubCategory({ id: editingSubCategory._id, formData });
      } else {
        addSubCategory(formData);
      }
    });
  };

  const handleEdit = (sub) => {
    setEditingSubCategory(sub);
    form.setFieldsValue({
      name: sub.name,
      description: sub.description,
      category:
        typeof sub.category === "object" ? sub.category?._id : sub.category,
      isActive: sub.isActive,
      displayOrder: sub.displayOrder,
      allowedListingTypes: sub.allowedListingTypes,
      requiresDateRange: sub.requiresDateRange || false,
      requiresGuestCount: sub.requiresGuestCount || false,
    });
    if (sub.image) {
      setFileList([
        {
          uid: "-1",
          name: "sub.jpg",
          status: "done",
          url: `${baseUrl}${sub.image}`,
        },
      ]);
    }
    setIsModalVisible(true);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedListingType(null);
  };

  // Filter data based on both category and listing type
  const getFilteredData = () => {
    let filteredData = subCategories || [];

    // Filter by category
    if (selectedCategory) {
      filteredData = filteredData.filter((item) => {
        const categoryId =
          typeof item.category === "object"
            ? item.category?._id
            : item.category;
        return categoryId === selectedCategory;
      });
    }

    // Filter by listing type
    if (selectedListingType) {
      filteredData = filteredData.filter((item) => {
        return (
          item.allowedListingTypes &&
          item.allowedListingTypes.includes(selectedListingType)
        );
      });
    }

    return filteredData;
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
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) =>
        typeof category === "object" ? category?.name : category,
    },
    {
      title: "Listing Types",
      dataIndex: "allowedListingTypes",
      key: "allowedListingTypes",
      render: (types) => (
        <div className="flex flex-wrap gap-1">
          {(types || []).map((type, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {type}
            </span>
          ))}
        </div>
      ),
    },
    { title: "Display Order", dataIndex: "displayOrder", key: "displayOrder" },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (v) => (v ? "Yes" : "No"),
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
            title="Are you sure to delete this sub-category?"
            onConfirm={() => deleteSubCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-8 rounded-md my-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Sub-category Management</h1>
        <Button
          onClick={() => setIsModalVisible(true)}
          className="!bg-primary-600"
          type="primary"
        >
          <PlusSquareOutlined /> Add Sub-category
        </Button>
      </div>

      {/* Enhanced Filter Section */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Select
          allowClear
          style={{ width: 200 }}
          placeholder="Filter by Category"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
        >
          {(categories || []).map((cat) => (
            <Select.Option key={cat._id} value={cat._id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          allowClear
          style={{ width: 200 }}
          placeholder="Filter by Listing Type"
          value={selectedListingType}
          onChange={(value) => setSelectedListingType(value)}
        >
          <Select.Option value="SELL">Sell</Select.Option>
          <Select.Option value="RENT">Rent</Select.Option>
          <Select.Option value="LEASE">Lease</Select.Option>
        </Select>

        {(selectedCategory || selectedListingType) && (
          <Button onClick={clearAllFilters} size="small" type="link">
            Clear All Filters
          </Button>
        )}

        <div className="text-sm text-gray-500">
          Showing {getFilteredData().length} of {(subCategories || []).length}{" "}
          sub-categories
        </div>
      </div>

      <Table
        dataSource={getFilteredData()}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingSubCategory ? "Edit Sub-category" : "Add Sub-category"}
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
            {editingSubCategory ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Sub-category Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select Category">
              {(categories || []).map((cat) => (
                <Select.Option value={cat._id} key={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="allowedListingTypes"
            label="Allowed Listing Types"
            rules={[{ required: true, message: "Please select listing types" }]}
          >
            <Select mode="multiple" placeholder="Select Types">
              <Select.Option value="SELL">Sell</Select.Option>
              <Select.Option value="RENT">Rent</Select.Option>
              <Select.Option value="LEASE">Lease</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="requiresDateRange"
            label="Requires Date Range"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item
            name="requiresGuestCount"
            label="Requires Guest Count"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="Display Order"
            rules={[{ required: true, message: "Please set display order" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
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
