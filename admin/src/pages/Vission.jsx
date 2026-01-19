import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import VisionServices from "../services/vission.services";
import { truncateText } from "../utils/truncateText";

const {
  processAddVision,
  processDeleteVision,
  processEditVision,
  processGetVision,
} = VisionServices;

const Vision = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingVision, setEditingVision] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const queryClient = useQueryClient();

  const { data: responseData, isPending } = useQuery({
    queryKey: ["visions"],
    queryFn: processGetVision,
  });

  const visions = responseData?.data || []; // ✅ Use the data array as-is (no need to map anymore)

  const { mutate: addVision, isPending: isAdding } = useMutation({
    mutationFn: processAddVision,
    onSuccess: () => {
      message.success("Vision added successfully");
      queryClient.invalidateQueries({ queryKey: ["visions"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add vision");
    },
  });

  const { mutate: editVision, isPending: isEditing } = useMutation({
    mutationFn: ({ id, payload }) => processEditVision(id, payload),
    onSuccess: () => {
      message.success("Vision updated successfully");
      queryClient.invalidateQueries({ queryKey: ["visions"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update vision");
    },
  });

  const { mutate: deleteVision, isPending: isDeleting } = useMutation({
    mutationFn: processDeleteVision,
    onSuccess: () => {
      message.success("Vision deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["visions"] });
    },
    onError: () => {
      message.error("Failed to delete vision");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingVision(null);
  };

  const handleFormFinish = (values) => {
    if (editingVision) {
      editVision({ id: editingVision._id, payload: values });
    } else {
      addVision(values);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      title: "Vision Description",
      dataIndex: "vissionDescription", // ✅ Fixed: use the correct key from API response
      key: "vissionDescription",
      width: 400,
      render: (text, record) => {
        const isExpanded = expandedRows[record._id];
        const displayText = isExpanded ? text : truncateText(text, 100);
        return (
          <div>
            <div>{displayText}</div>
            {text?.length > 100 && (
              <Button
                type="link"
                onClick={() => toggleExpand(record._id)}
                className="p-0"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingVision(record);
              setIsModalVisible(true);
              form.setFieldsValue({
                vissionDescription: record.vissionDescription, // ✅ Fixed here too
              });
            }}
            style={{ marginBottom: 4 }}
          />
          <Popconfirm
            title="Are you sure to delete this vision?"
            onConfirm={() => deleteVision(record._id)}
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
        <h1 className="text-2xl font-bold">Visions</h1>
        <Button
          className="custom-button"
          onClick={() => {
            setEditingVision(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={visions}
        columns={columns}
        rowKey="_id"
        loading={isPending || isDeleting}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingVision ? "Edit Vision" : "Create Vision"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFormFinish} layout="vertical">
          <Form.Item
            name="vissionDescription" // ✅ Use correct field name
            label="Vision Description"
            rules={[
              { required: true, message: "Please enter a vision description" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={isAdding || isEditing}
          >
            {editingVision ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Vision;
