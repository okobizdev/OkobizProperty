import { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Select,
  Checkbox,
  message,
  Table,
  Space,
  Popconfirm,
  Tag,
  Card,
} from "antd";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import subCategoryService from "../services/subCategories.service";
import AmenityServies from "../services/amenities.service";
import AminitiesConfigServices from "../services/aminitiesConfig.service";
import { baseUrl } from "../constants/env";

export default function AmenityConfigManager() {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form] = Form.useForm();

  const { data: configurations, isLoading: configLoading } = useQuery({
    queryKey: ["configuration"],
    queryFn: AminitiesConfigServices.processGetConfiguration,
  });

  const { data: subCategories } = useQuery({
    queryKey: ["subCategories"],
    queryFn: subCategoryService.processGetSubCategory,
  });

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: AmenityServies.processGetAminity,
  });
  console.log("configurations", configurations);

  const { mutate: addConfig, isPending: adding } = useMutation({
    mutationFn: AminitiesConfigServices.processAddConfiguration,
    onSuccess: () => {
      message.success("Amenity configuration saved successfully");
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
      handleModalClose();
    },
    onError: () => {
      message.error("Failed to save configuration");
    },
  });

  const { mutate: updateConfig, isPending: updating } = useMutation({
    mutationFn: ({ id, data }) =>
      AminitiesConfigServices.processUpdateConfiguration(id, data),
    onSuccess: () => {
      message.success("Configuration updated successfully");
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
      handleModalClose();
    },
    onError: () => {
      message.error("Failed to update configuration");
    },
  });

  const { mutate: deleteConfig } = useMutation({
    mutationFn: AminitiesConfigServices.processDeleteConfiguration,
    onSuccess: () => {
      message.success("Configuration deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
    },
    onError: () => {
      message.error("Failed to delete configuration");
    },
  });

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingConfig(null);
    form.resetFields();
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setIsModalVisible(true);
    form.setFieldsValue({
      subcategory: config.subcategory?._id || config.subcategory,
      availableAmenities: config.availableAmenities.map((amenity) =>
        typeof amenity === "object" ? amenity._id : amenity
      ),
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("subcategory", values.subcategory);
      values.availableAmenities.forEach((id) => {
        formData.append("availableAmenities[]", id);
      });

      if (editingConfig) {
        updateConfig({ id: editingConfig._id, data: formData });
      } else {
        addConfig(formData);
      }
    });
  };

  const handleDelete = (configId) => {
    deleteConfig(configId);
  };

  const allSubcategoriesConfigured = () => {
    if (!subCategories || !configurations) return false;

    const configuredSubcategoryIds = configurations
      .filter((config) => config.subcategory)
      .map((config) => config.subcategory._id || config.subcategory);

    return subCategories.every((sub) =>
      configuredSubcategoryIds.includes(sub._id)
    );
  };

  const getAvailableSubcategories = () => {
    if (!subCategories || !configurations) return subCategories || [];

    const usedSubcategoryIds = configurations
      .filter((config) => config.subcategory)
      .map((config) => config.subcategory._id || config.subcategory);

    if (editingConfig) {
      return subCategories.filter(
        (sub) =>
          !usedSubcategoryIds.includes(sub._id) ||
          sub._id ===
            (editingConfig.subcategory?._id || editingConfig.subcategory)
      );
    }

    return subCategories.filter((sub) => !usedSubcategoryIds.includes(sub._id));
  };

  const columns = [
    {
      title: "Subcategory",
      dataIndex: ["subcategory", "name"],
      key: "name",
    },
    {
      title: "Available Amenities",
      dataIndex: "availableAmenities",
      key: "availableAmenities",
      render: (amenities) => (
        <div>
          {amenities?.map((amenity) => (
            <Tag
              key={amenity._id || amenity}
              color="blue"
              style={{ marginBottom: 4 }}
            >
              {amenity.label || amenity.name || amenity}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this configuration?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-8 rounded-md my-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Amenity Configuration Management</h1>
        {!allSubcategoriesConfigured() && (
          <Button
            onClick={() => setIsModalVisible(true)}
            className="!bg-primary-600"
            type="primary"
            icon={<PlusSquareOutlined />}
          >
            Add Configuration
          </Button>
        )}
        {allSubcategoriesConfigured() && (
          <div className="text-green-600 font-medium">
            All subcategories have been configured ✓
          </div>
        )}
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={configurations}
          loading={configLoading}
          rowKey="_id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={
          editingConfig
            ? "Edit Amenity Configuration"
            : "Add Amenity Configuration"
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="!bg-primary-600"
            loading={adding || updating}
            onClick={handleSubmit}
          >
            {editingConfig ? "Update" : "Submit"}
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Subcategory"
            name="subcategory"
            rules={[{ required: true, message: "Please select a subcategory" }]}
          >
            <Select
              placeholder="Select subcategory"
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase()?.indexOf(input.toLowerCase()) >=
                0
              }
            >
              {getAvailableSubcategories()?.map((sub) => (
                <Select.Option key={sub._id} value={sub._id}>
                  {sub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Available Amenities"
            name="availableAmenities"
            rules={[{ required: true, message: "Please select amenities" }]}
          >
            <Checkbox.Group className="grid grid-cols-2 gap-2">
              {amenities?.map((item) => (
                <Checkbox key={item._id} value={item._id}>
                  <div className="flex items-center gap-2">
                    {item.image && (
                      <img
                        src={`${baseUrl}${item?.image}`}
                        alt={item.name || item.label}
                        className="w-4 h-4 object-cover"
                      />
                    )}
                    {item.name || item.label}
                  </div>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
