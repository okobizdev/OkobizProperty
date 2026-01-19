import {
  Button,
  Form,
  Image,
  Modal,
  Popconfirm,
  Table,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PartnersServices from "../services/partners.services";
import { baseUrl } from "../constants/env";

const {
  processAddPartner,
  processDeletePartner,
  processEditPartner,
  processGetPartners,
} = PartnersServices;

const Partners = () => {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPartner, setEditingPartner] = useState(null);
  const [fileList, setFileList] = useState([]);

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: processGetPartners,
  });

  const addMutation = useMutation({
    mutationFn: processAddPartner,
    onSuccess: () => {
      queryClient.invalidateQueries(["partners"]);
      handleModalCancel();
      message.success("Partner created successfully");
    },
    onError: () => {
      message.error("Failed to create partner");
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }) => processEditPartner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["partners"]);
      handleModalCancel();
      message.success("Partner updated successfully");
    },
    onError: () => {
      message.error("Failed to update partner");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: processDeletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries(["partners"]);
      message.success("Partner deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete partner");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingPartner(null);
    form.resetFields();
    setFileList([]);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    return false;
  };

  const handleEdit = (record) => {
    setEditingPartner(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
    setFileList([
      {
        uid: "-1",
        name: "Image",
        status: "done",
        url: `${baseUrl}${record.partnerImage}`,
      },
    ]);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleFormFinish = async () => {
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("partnerImage", file.originFileObj);
        }
      });

      if (editingPartner) {
        editMutation.mutate({ id: editingPartner._id, payload: formData });
      } else {
        addMutation.mutate(formData);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to submit");
    }
  };

  const columns = [
    {
      title: "Media",
      dataIndex: "partnerImage",
      key: "partnerImage",
      render: (_, record) =>
        record?.partnerImage ? (
          <Image
            width={100}
            src={`${baseUrl}${record.partnerImage}`}
            alt="Partner Media"
            className="w-[200px] rounded"
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this partner?"
            onConfirm={() => handleDelete(record._id)}
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
        <h1 className="text-2xl font-bold">Sister Concern</h1>
        <Button
          className="custom-button"
          onClick={() => {
            setEditingPartner(null);
            setFileList([]);
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={partners}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingPartner ? "Edit Partner" : "Create Partner"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item label="Partner Image">
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
            className="custom-button"
            htmlType="submit"
            loading={addMutation.isLoading || editMutation.isLoading}
          >
            {editingPartner ? "Update Partner" : "Create Partner"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Partners;
