import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LocationServices from "../services/location.services";

const { processAddLocation, processDeleteLocation, processEditLocation, processGetLocation } =
  LocationServices;

const Location = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingLocation, setEditingLocation] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const queryClient = useQueryClient();

  // Fetch locations with pagination
  const {
    data: locationRes,
    isPending,
  } = useQuery({
    queryKey: ["locations", page, limit],
    queryFn: () => processGetLocation({ page, limit }),
    keepPreviousData: true,
  });

  const locations = locationRes?.data || [];
  const total = locationRes?.totalContacts || 0;

  const { mutate: addLocation, isPending: isAdding } = useMutation({
    mutationFn: processAddLocation,
    onSuccess: () => {
      message.success("Location added successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add Location");
    },
  });

  const { mutate: editLocation, isPending: isEditing } = useMutation({
    mutationFn: ({ id, data }) => processEditLocation(data, id),
    onSuccess: () => {
      message.success("Location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update Location");
    },
  });

  const { mutate: deleteLocation, isPending: isDeleting } = useMutation({
    mutationFn: (id) => processDeleteLocation(id),
    onSuccess: () => {
      message.success("Location deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: () => {
      message.error("Failed to delete Location");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingLocation(null);
  };

  const handleFormFinish = async () => {
    try {
      const values = await form.validateFields();
      if (editingLocation) {
        editLocation({ id: editingLocation._id, data: values });
      } else {
        addLocation(values);
      }
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const handleEdit = (record) => {
    setEditingLocation(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      location: record.location,
    });
  };

  const columns = [
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      render: (text) => (
        <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginBottom: 4 }}
          />
          <Popconfirm
            title="Are you sure to delete this Location?"
            onConfirm={() => deleteLocation(record._id)}
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
        <h1 className="text-2xl font-bold">Location Management</h1>
        <Button
          className="custom-button"
          onClick={() => {
            form.resetFields();
            setEditingLocation(null);
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={locations}
        columns={columns}
        rowKey="_id"
        loading={isPending || isDeleting}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
      />

      <Modal
        title={editingLocation ? "Edit Location" : "Create Location"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter a location" }]}
          >
            <Input />
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={isAdding || isEditing}
          >
            {editingLocation ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Location;
