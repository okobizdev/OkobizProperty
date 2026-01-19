import { useState } from "react";
import { Button, Table, message, Modal, Form, Input, Popconfirm } from "antd";
import {
    EditOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CompanyContactServices from "../services/companyContact.service";

export default function CompanyContactsManager() {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [modalMode, setModalMode] = useState("create");

    const { data: contacts, isLoading: loadingContacts } = useQuery({
        queryKey: ["companyContacts"],
        queryFn: CompanyContactServices.processGetCompanyContacts,
    });

    const { mutate: createContact, isPending: creating } = useMutation({
        mutationFn: CompanyContactServices.processCreateCompanyContacts,
        onSuccess: () => {
            message.success("Contact created successfully");
            queryClient.invalidateQueries({ queryKey: ["companyContacts"] });
            handleModalCancel();
        },
        onError: (error) => {
            message.error(error?.message || "Failed to create contact");
        },
    });

    const { mutate: updateContact, isPending: updating } = useMutation({
        mutationFn: ({ id, payload }) => CompanyContactServices.processUpdateCompanyContacts(id, payload),
        onSuccess: () => {
            message.success("Contact information updated successfully");
            queryClient.invalidateQueries({ queryKey: ["companyContacts"] });
            handleModalCancel();
        },
        onError: (error) => {
            message.error(error?.message || "Failed to update contact information");
        },
    });

    const { mutate: deleteContact, isPending: deleting } = useMutation({
        mutationFn: CompanyContactServices.processDeleteCompanyContacts,
        onMutate: async (contactId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["companyContacts"] });

            // Snapshot the previous value
            const previousContacts = queryClient.getQueryData(["companyContacts"]);

            // Optimistically remove the contact from the list
            queryClient.setQueryData(["companyContacts"], (old) =>
                old ? old.filter(contact => contact._id !== contactId) : []
            );

            // Return context with the previous value
            return { previousContacts };
        },
        onSuccess: () => {
            message.success("Contact deleted successfully");
            // Refetch to ensure data is up to date
            queryClient.invalidateQueries({ queryKey: ["companyContacts"] });
        },
        onError: (error, contactId, context) => {
            // Rollback on error
            queryClient.setQueryData(["companyContacts"], context.previousContacts);
            message.error(error?.message || "Failed to delete contact");
        },
        onSettled: () => {
            // Always refetch after mutation settles
            queryClient.invalidateQueries({ queryKey: ["companyContacts"] });
        },
    });

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingContact(null);
        setModalMode("create");
        form.resetFields();
    };

    const handleCreateContact = () => {
        if (contacts && contacts.length > 0) {
            setModalMode("edit");
            setEditingContact(contacts[0]);
            form.setFieldsValue(contacts[0]);
        } else {
            setModalMode("create");
            setEditingContact(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };


    const handleDeleteContact = (contactId) => {
        deleteContact(contactId);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (modalMode === "create") {
                createContact(values);
            } else {
                updateContact({ id: editingContact._id, payload: values });
            }
        } catch (error) {
            console.error("Form validation failed:", error);
        }
    };

    const columns = [
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            render: (mobile) => mobile ? (
                <span className="flex items-center gap-1">
                    <PhoneOutlined className="text-blue-500" />
                    {mobile}
                </span>
            ) : "N/A",
        },
        {
            title: "WhatsApp",
            dataIndex: "whatsapp",
            key: "whatsapp",
            render: (whatsapp) => whatsapp ? (
                <span className="flex items-center gap-1">
                    <PhoneOutlined className="text-green-500" />
                    {whatsapp}
                </span>
            ) : "N/A",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => email ? (
                <span className="flex items-center gap-1">
                    <MailOutlined className="text-green-500" />
                    {email}
                </span>
            ) : "N/A",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (address) => address ? (
                <span className="flex items-center gap-1">
                    <EnvironmentOutlined className="text-red-500" />
                    <span className="max-w-xs truncate" title={address}>
                        {address}
                    </span>
                </span>
            ) : "N/A",
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) =>
                date ? new Date(date).toLocaleDateString() : "Unknown",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Popconfirm
                        title="Delete Contact"
                        description="Are you sure you want to delete this contact? This action cannot be undone."
                        onConfirm={() => handleDeleteContact(record._id)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okType="danger"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        placement="topRight"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            loading={deleting}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full bg-white my-6 p-8 rounded-md">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Company Contact Information</h1>
                <Button type="primary" onClick={handleCreateContact}>
                    <EditOutlined />
                    {contacts && contacts.length > 0 ? "Edit Contact Info" : "Add Contact Info"}
                </Button>
            </div>

            <Table
                dataSource={contacts || []}
                columns={columns}
                rowKey="_id"
                loading={loadingContacts}
                scroll={{ x: "max-content" }}
                pagination={false}
            />

            <Modal
                title={contacts && contacts.length > 0 ? "Edit Company Contact Information" : "Add Company Contact Information"}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={creating || updating}
                        onClick={handleSubmit}
                    >
                        {contacts && contacts.length > 0 ? "Update Contact Info" : "Add Contact Info"}
                    </Button>,
                ]}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Mobile Number"
                            name="mobile"
                            rules={[
                                { required: true, message: "Please enter mobile number" },
                                {
                                    message: "Please enter a valid mobile number"
                                }
                            ]}
                        >
                            <Input
                                placeholder="Enter mobile number"
                                prefix={<PhoneOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            label="WhatsApp Number"
                            name="whatsapp"
                            rules={[
                                { required: true, message: "Please enter WhatsApp number" },
                                {
                                    message: "Please enter a valid WhatsApp number"
                                }
                            ]}
                        >
                            <Input
                                placeholder="Enter WhatsApp number"
                                prefix={<PhoneOutlined />}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter email address" },
                            { type: "email", message: "Please enter a valid email address" }
                        ]}
                    >
                        <Input
                            placeholder="Enter email address"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            { required: true, message: "Please enter address" },
                            { min: 5, message: "Address must be at least 5 characters" }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Enter company address"
                            rows={3}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}