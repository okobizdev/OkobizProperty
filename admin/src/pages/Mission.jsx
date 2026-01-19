import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MissionServices from "../services/mission.services";
import { truncateText } from "../utils/truncateText";

const {
  processAddMission,
  processDeleteMission,
  processEditMission,
  processGetMission,
} = MissionServices;

const Mission = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMission, setEditingMission] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const queryClient = useQueryClient();

  const { data: responseData, isPending } = useQuery({
    queryKey: ["missions"],
    queryFn: processGetMission,
  });

  const missions = responseData?.data || [];

  const { mutate: addMission, isPending: isAdding } = useMutation({
    mutationFn: processAddMission,
    onSuccess: () => {
      message.success("Mission added successfully");
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add mission");
    },
  });

  const { mutate: editMission, isPending: isEditing } = useMutation({
    mutationFn: ({ id, payload }) => processEditMission(id, payload),
    onSuccess: () => {
      message.success("Mission updated successfully");
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update mission");
    },
  });

  const { mutate: deleteMission, isPending: isDeleting } = useMutation({
    mutationFn: processDeleteMission,
    onSuccess: () => {
      message.success("Mission deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
    onError: () => {
      message.error("Failed to delete mission");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingMission(null);
  };

  const handleFormFinish = (values) => {
    if (editingMission) {
      editMission({ id: editingMission._id, payload: values });
    } else {
      addMission(values);
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
      title: "Mission Description",
      dataIndex: "missionDescription",
      key: "missionDescription",
      width: 400,
      render: (text, record) => {
        const isExpanded = expandedRows[record._id];
        const displayText = isExpanded ? text : truncateText(text, 100);
        return (
          <div>
            <div>{displayText}</div>
            {text.length > 100 && (
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
              setEditingMission(record);
              setIsModalVisible(true);
              form.setFieldsValue({
                missionDescription: record.missionDescription,
              });
            }}
            style={{ marginBottom: 4 }}
          />
          <Popconfirm
            title="Are you sure to delete this mission?"
            onConfirm={() => deleteMission(record._id)}
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
        <h1 className="text-2xl font-bold">Missions</h1>
        <Button
          className="custom-button"
          onClick={() => {
            setEditingMission(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={missions}
        columns={columns}
        rowKey="_id"
        loading={isPending || isDeleting}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingMission ? "Edit Mission" : "Create Mission"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFormFinish} layout="vertical">
          <Form.Item
            name="missionDescription"
            label="Mission Description"
            rules={[
              { required: true, message: "Please enter a mission description" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={isAdding || isEditing}
          >
            {editingMission ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Mission;
