import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Upload,
  Form,
  Input,
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
import AmenityService from "../services/amenities.service";
import { baseUrl } from "../constants/env";

export default function AmenityManager() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [editingAmenity, setEditingAmenity] = useState(null);

  const { data: amenities, isLoading } = useQuery({
    queryKey: ["amenities"],
    queryFn: AmenityService.processGetAminity,
  });

  const { mutate: addAmenity, isPending: adding } = useMutation({
    mutationFn: AmenityService.processAddAminity,
    onSuccess: () => {
      message.success("Amenity added successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      handleCancel();
    },
    onError: () => {
      message.error("Failed to add amenity");
    },
  });

  const { mutate: updateAmenity, isPending: updating } = useMutation({
    mutationFn: ({ id, formData }) =>
      AmenityService.processUpdateAminity(id, formData),
    onSuccess: () => {
      message.success("Amenity updated successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      handleCancel();
    },
    onError: () => {
      message.error("Failed to update amenity");
    },
  });

  const { mutate: deleteAmenity } = useMutation({
    mutationFn: AmenityService.processDeleteAminity,
    onSuccess: () => {
      message.success("Amenity deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
    },
    onError: () => {
      message.error("Failed to delete amenity");
    },
  });

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setEditingAmenity(null);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("label", values.label);
      formData.append("isActive", values.isActive);
      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingAmenity) {
        updateAmenity({ id: editingAmenity._id, formData });
      } else {
        addAmenity(formData);
      }
    });
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    form.setFieldsValue({
      label: amenity.label,
      isActive: amenity.isActive,
    });
    if (amenity.image) {
      setFileList([
        {
          uid: "-1",
          name: "amenity.jpg",
          status: "done",
          url: `${baseUrl}${amenity.image}`,
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
          alt="amenity"
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
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
            title="Are you sure to delete this amenity?"
            onConfirm={() => deleteAmenity(record._id)}
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
        <h1 className="text-2xl font-bold">Amenity Management</h1>
        <Button
          onClick={() => setIsModalVisible(true)}
          className="!bg-primary-600"
          type="primary"
        >
          <PlusSquareOutlined /> Add Amenity
        </Button>
      </div>

      <Table
        dataSource={amenities || []}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingAmenity ? "Edit Amenity" : "Add Amenity"}
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
            {editingAmenity ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="label"
            label="Amenity Label"
            rules={[{ required: true, message: "Please enter amenity label" }]}
          >
            <Input />
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
