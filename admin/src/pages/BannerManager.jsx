import { useState } from "react";
import { Upload, Button, Table, Image, message, Popconfirm, Modal } from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BannerServices from "../services/banner.service";
import { baseUrl } from "../constants/env";

export default function BannerManager() {
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: banners, isLoading: loadingBanners } = useQuery({
    queryKey: ["banners"],
    queryFn: BannerServices.processGetBanners,
  });

  const { mutate: uploadBanner, isPending: uploading } = useMutation({
    mutationFn: BannerServices.processAddBanner,
    onSuccess: () => {
      message.success("Banner uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to upload banner");
    },
  });

  const { mutate: deleteBanner, isPending: deleting } = useMutation({
    mutationFn: BannerServices.processDeleteBanner,
    onSuccess: () => {
      message.success("Banner deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: () => {
      message.error("Failed to delete banner");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    return false;
  };

  const handleUpload = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.error("Please select an image to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("bannerImage", fileList[0].originFileObj);
      uploadBanner(formData);
    } catch (err) {
      console.error("Error uploading banner:", err);
      message.error("Failed to upload banner");
    }
  };

  const columns = [
    {
      title: "Banner Image",
      dataIndex: "bannerImage",
      key: "bannerImage",
      render: (bannerImage) => (
        <Image
          src={`${baseUrl}${bannerImage}`}
          width={150}
          height={80}
          alt="banner"
          className="rounded object-cover"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Upload Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "Unknown",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this banner?"
          onConfirm={() => deleteBanner(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <Button onClick={() => setIsModalVisible(true)}>
          <PlusSquareOutlined /> Add Banner
        </Button>
      </div>

      <Table
        dataSource={banners || []}
        columns={columns}
        rowKey="_id"
        loading={loadingBanners || deleting}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Upload Banner"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            onClick={handleUpload}
            disabled={fileList.length === 0}
          >
            Upload Banner
          </Button>,
        ]}
      >
        <Upload
          listType="picture-card"
          beforeUpload={() => false}
          fileList={fileList}
          onChange={handleFileChange}
          onRemove={handleRemoveImage}
          multiple={false}
          accept="image/*"
        >
          {fileList.length >= 1 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Modal>
    </div>
  );
}
