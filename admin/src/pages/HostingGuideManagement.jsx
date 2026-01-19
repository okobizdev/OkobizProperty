import {
    Button,
    Form,
    Input,
    Modal,
    Table,
    Popconfirm,
    message,
    Tooltip,
} from "antd";
import { useState, } from "react";
import {
    EditOutlined,
    DeleteOutlined,
    PlusSquareOutlined,
    PlayCircleOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import HostingGuideServices from "../services/HostGuide.service";


const {
    processGetHostingGuide,
    processAddHostingGuide,
    processEditHostingGuide,
    processDeleteHostingGuide,
} = HostingGuideServices;

const HostingGuideManagement = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);

    const queryClient = useQueryClient();

    const {
        data: guideData,
        isLoading: isGuideLoading,
        // isError: isGuideError,
    } = useQuery({
        queryKey: ["hostingGuide"],
        queryFn: processGetHostingGuide,
    });

    // useEffect(() => {
    //     if (isGuideError) {
    //         message.error("No hosting guide available");
    //     }
    // }, [isGuideError]);

    const { mutate: addGuide, isLoading: isAdding } = useMutation({
        mutationFn: processAddHostingGuide,
        onSuccess: () => {
            message.success("Hosting guide added successfully");
            queryClient.invalidateQueries(["hostingGuide"]);
            handleModalCancel();
        },
        onError: () => {
            message.error("Failed to add hosting guide");
        },
    });

    const { mutate: editGuide, isLoading: isEditing } = useMutation({
        mutationFn: ({ id, data }) => processEditHostingGuide(id, data),
        onSuccess: () => {
            message.success("Hosting guide updated successfully");
            queryClient.invalidateQueries(["hostingGuide"]);
            handleModalCancel();
        },
        onError: () => {
            message.error("Failed to update hosting guide");
        },
    });

    const { mutate: deleteGuide, isLoading: isDeleting } = useMutation({
        mutationFn: processDeleteHostingGuide,
        onSuccess: () => {
            message.success("Hosting guide deleted successfully");
            queryClient.setQueryData(["hostingGuide"], null);
            queryClient.invalidateQueries(["hostingGuide"]);
        },
        onError: () => {
            message.error("Failed to delete hosting guide");
        },
    });

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingGuide(null);
    };



    const handleFormSubmit = async (values) => {
        try {

            const payload = {
                title: values.title,
                description: values.description,
                video: values.video,
            };

            if (editingGuide) {
                editGuide({ id: editingGuide._id, data: payload });
            } else {
                addGuide(payload);
            }
        } catch (err) {
            console.error("Error submitting hosting guide form:", err);
            message.error("Failed to submit hosting guide");
        }
    };

    const handleEdit = (record) => {
        setEditingGuide(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: record.title,
            description: record.description,
            video: record.video,
        });
    };


    const descriptionValue = Form.useWatch('description', form);

    const columns = [
        {
            title: "Video Preview",
            dataIndex: "video",
            key: "video",
            width: 200,
            render: (videoUrl) => {

                return (
                    <div className="relative">
                        {videoUrl ? (
                            <iframe
                                width="150"
                                height="84"
                                src={videoUrl}
                                title="YouTube video preview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded"
                            />
                        ) : (
                            <div className="w-[150px] h-[84px] bg-gray-200 rounded flex items-center justify-center">
                                <PlayCircleOutlined className="text-2xl text-gray-500" />
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 200,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 300,
            render: (text) => {
                const isTextLong = text && text?.length > 100;

                return (
                    <Tooltip title={isTextLong ? text : null} placement="topLeft">
                        <div
                            className="line-clamp-3 overflow-hidden text-ellipsis cursor-pointer"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxHeight: '72px',
                                lineHeight: '24px'
                            }}
                        >
                            {text}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: "Video URL",
            dataIndex: "video",
            key: "videoUrl",
            width: 250,
            render: (url) => (
                <Tooltip title={url} placement="topLeft">
                    <div className="truncate max-w-[200px]">
                        {url}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <div className="flex flex-col gap-1">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Are you sure to delete this hosting guide?"
                        onConfirm={() => deleteGuide(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];


    const tableData = guideData ? [guideData] : [];

    return (
        <div className="w-full bg-white my-6 p-8 rounded-md">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Hosting Guide Management</h1>

                {!guideData && (
                    <Button
                        onClick={() => setIsModalVisible(true)}
                        type="primary"
                    >
                        <PlusSquareOutlined /> Add Hosting Guide
                    </Button>
                )}
            </div>

            <Table
                dataSource={tableData}
                columns={columns}
                rowKey="_id"
                loading={isGuideLoading || isDeleting}
                scroll={{ x: "max-content" }}
                pagination={false}
                locale={{ emptyText: 'No hosting guide yet. Click "Add Hosting Guide" to create one.' }}
            />

            <Modal
                title={editingGuide ? "Edit Hosting Guide" : "Create Hosting Guide"}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please enter the title" }]}
                    >
                        <Input placeholder="Enter hosting guide title" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please enter the description" }]}
                        valuePropName="value"
                    >
                        <ReactQuill
                            value={descriptionValue || ''}
                            onChange={(content) => {
                                form.setFieldsValue({ description: content });
                            }}
                            placeholder="Enter description..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="video"
                        label="YouTube Video URL"
                        rules={[
                            { required: true, message: "Please enter the YouTube video URL" },
                        ]}
                    >
                        <Input placeholder="https://www.youtube.com/watch?v=..." />
                    </Form.Item>

                    <Button
                        htmlType="submit"
                        type="primary"
                        className="w-full"
                        loading={isAdding || isEditing}
                    >
                        {editingGuide ? "Update Hosting Guide" : "Create Hosting Guide"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default HostingGuideManagement;