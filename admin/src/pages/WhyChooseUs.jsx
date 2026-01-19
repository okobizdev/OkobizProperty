import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
  message,
  Image,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { truncateText } from "../utils/truncateText";
import WhyChooseUsServices from "../services/whyChooseUs.services";
import { baseUrl } from "../constants/env";

const {
  processAddWhyChooseUs,
  processDeleteWhyChooseUs,
  processEditWhyChooseUs,
  processGetWhyChooseUs,
  processEditWhyChooseUsField,
} = WhyChooseUsServices;

const WhyChooseUs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [fileList, setFileList] = useState([]);
  const queryClient = useQueryClient();

  const { data: res, isPending } = useQuery({
    queryKey: ["whyChooseUs"],
    queryFn: processGetWhyChooseUs,
  });

  const whyChooseUsList = res?.data || [];

  const { mutate: addItem, isPending: isAdding } = useMutation({
    mutationFn: processAddWhyChooseUs,
    onSuccess: () => {
      message.success("Added successfully");
      queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add");
    },
  });

  const { mutate: editItem, isPending: isEditing } = useMutation({
    mutationFn: ({ id, payload }) => processEditWhyChooseUs(id, payload),
    onSuccess: () => {
      message.success("Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update");
    },
  });

  const { mutate: editItemField } = useMutation({
    mutationFn: ({ id, payload }) => processEditWhyChooseUsField(id, payload),
    onSuccess: () => {
      message.success("Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update");
    },
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: processDeleteWhyChooseUs,
    onSuccess: () => {
      message.success("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] });
    },
    onError: () => {
      message.error("Failed to delete");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
    setEditingItem(null);
  };

  const handleFormFinish = async () => {
    try {
      const values = await form.validateFields();
      const isImageUpdated = fileList.length > 0 && fileList[0].originFileObj;

      if (editingItem) {
        if (isImageUpdated) {
          const formData = new FormData();
          formData.append("whyChooseUsTitle", values.whyChooseUsTitle);
          formData.append(
            "whyChooseUsDescription",
            values.whyChooseUsDescription
          );
          formData.append("whyChooseUsIcon", fileList[0].originFileObj);
          editItem({ id: editingItem._id, payload: formData });
        } else {
          editItemField({
            id: editingItem._id,
            payload: {
              whyChooseUsTitle: values.whyChooseUsTitle,
              whyChooseUsDescription: values.whyChooseUsDescription,
            },
          });
        }
      } else {
        const formData = new FormData();
        formData.append("whyChooseUsTitle", values.whyChooseUsTitle);
        formData.append(
          "whyChooseUsDescription",
          values.whyChooseUsDescription
        );
        if (isImageUpdated) {
          formData.append("whyChooseUsIcon", fileList[0].originFileObj);
        }
        addItem(formData);
      }
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      whyChooseUsTitle: record.whyChooseUsTitle,
      whyChooseUsDescription: record.whyChooseUsDescription,
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "whyChooseUsTitle",
      key: "whyChooseUsTitle",
      ellipsis: true,
      render: (text) => (
        <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "whyChooseUsDescription",
      key: "whyChooseUsDescription",
      ellipsis: true,
      render: (text, record) => {
        const isExpanded = expandedRows[record._id];
        const displayedText = isExpanded ? text : truncateText(text, 100);
        return (
          <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
            {displayedText}
            {text.length > 100 && (
              <Button
                type="link"
                onClick={() => toggleExpand(record._id)}
                style={{ padding: 0 }}
              >
                {isExpanded ? "See less" : "See more"}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Icon",
      dataIndex: "whyChooseUsIcon",
      key: "whyChooseUsIcon",
      render: (src) =>
        src ? (
          <Image
            src={baseUrl + src}
            alt="icon"
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
          />
        ) : (
          "N/A"
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
            title="Are you sure to delete this entry?"
            onConfirm={() => deleteItem(record._id)}
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
        <h1 className="text-2xl font-bold">Why Choose Us</h1>
        <Button
          className="custom-button"
          onClick={() => {
            form.resetFields();
            setFileList([]);
            setEditingItem(null);
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={whyChooseUsList}
        columns={columns}
        rowKey="_id"
        loading={isPending || isDeleting}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? "Edit Entry" : "Create Entry"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            name="whyChooseUsTitle"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="whyChooseUsDescription"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          

          <Form.Item label="Icon"
           name="image"
  rules={[
    {
      required: true,
      message: 'Please upload an image!',
    },
  ]}
          >
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={(file) => {
                setFileList((prev) =>
                  prev.filter((item) => item.uid !== file.uid)
                );
                return false;
              }}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={isAdding || isEditing}
          >
            {editingItem ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default WhyChooseUs;
