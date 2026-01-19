"use client";
import { useState, } from "react";
import { Table, Card, Input, Button, Select, Tag, Avatar, Dropdown, Popconfirm, message, Image, Row, Col, Modal, Form, InputNumber, Upload, Switch } from "antd";
import { DeleteOutlined, MoreOutlined, HomeOutlined, UserOutlined, EditOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import PropertyService from "../services/property.services";
import { baseUrl } from "../constants/env";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function PropertiesTable({ defaultListingType }) {

    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 9,
    });
    const [localProperties, setLocalProperties] = useState(undefined);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [editForm] = Form.useForm();
    const [isUpdating, setIsUpdating] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [galleryFileList, setGalleryFileList] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [updatingFeatured, setUpdatingFeatured] = useState([]);

   const { data: propertiesData, isLoading, refetch } = useQuery({
    queryKey: ["properties", defaultListingType, pagination.current, pagination.pageSize, searchText, selectedCategory, selectedStatus],
    queryFn: () => PropertyService.ProcessGetListedProperty(
        defaultListingType,
        pagination.current,
        pagination.pageSize,
        {
            search: searchText,
            category: selectedCategory,
            status: selectedStatus
        }
    ),
    refetchOnWindowFocus: false,
    keepPreviousData: true, // Important for smooth pagination transitions
});

    const properties = Array.isArray(localProperties)
        ? localProperties
        : Array.isArray(propertiesData?.properties)
            ? propertiesData.properties
            : [];

    // const filteredProperties = (properties || []).filter((property) => {
    //     const matchesSearch =
    //         property.title?.toLowerCase().includes((searchText || "").toLowerCase()) ||
    //         property.description?.toLowerCase().includes((searchText || "").toLowerCase()) ||
    //         property.location?.toLowerCase().includes((searchText || "").toLowerCase());

    //     const matchesCategory = !selectedCategory || property.category?.name === selectedCategory;
    //     const matchesStatus = !selectedStatus || property.publishStatus === selectedStatus;

    //     return matchesSearch && matchesCategory && matchesStatus;
    // });

    const handleSwitchChange = (value) => {

        editForm.setFieldsValue({ airConditioning: value });
    };

    const handleToggleFeatured = async (record, checked) => {
        const currentFeaturedCount = (properties || []).filter(p => p.isFeatured).length;
        if (checked && !record.isFeatured && currentFeaturedCount >= 9) {
            message.error('Maximum of 9 featured properties allowed');
            return;
        }
        setUpdatingFeatured(prev => [...prev, record._id]);
        setLocalProperties(prev => {
            if (!Array.isArray(prev)) return prev;
            return prev.map(p => p._id === record._id ? { ...p, isFeatured: checked } : p);
        });

        try {
            const res = await PropertyService.ProcessUpdatePropertyFeaturedStatus(record._id, checked);
            const data = res && res.data ? res.data : res;
            if (data && (data.error || data.message)) {
                const msg = data.error || data.message;
                setLocalProperties(prev => {
                    if (!Array.isArray(prev)) return prev;
                    return prev.map(p => p._id === record._id ? { ...p, isFeatured: record.isFeatured } : p);
                });
                message.error(msg);
                return;
            }
            message.success('Featured status updated');
            setLocalProperties(undefined);
            refetch();
        } catch (err) {

            setLocalProperties(prev => {
                if (!Array.isArray(prev)) return prev;
                return prev.map(p => p._id === record._id ? { ...p, isFeatured: record.isFeatured } : p);
            });
            const serverMsg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.data?.error ||
                err?.data?.message ||
                err?.data ||
                err?.message ||
                String(err);

            // If server returned a JSON error like { error: '...' } we show that; otherwise fallback
            message.error(serverMsg || (checked ? 'Failed to mark as featured' : 'Failed to unmark featured'));
        } finally {
            setUpdatingFeatured(prev => prev.filter(id => id !== record._id));
        }
    };

    const getListingTypeColor = (type) => {
        return type === "RENT" ? "cyan" : "purple";
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        editForm.setFieldsValue({
            title: property.title,
            description: property.description || '',
            price: property.price,
            priceUnit: property.priceUnit,
            location: property.location,
            size: property.size,
            sizeUnit: property.sizeUnit,
            numberOfRooms: property.numberOfRooms,
            numberOfBalconies: property.numberOfBalconies,
            numberOfWashrooms: property.numberOfWashrooms,
            numberOfGuests: property.numberOfGuests,
            numberOfBedrooms: property.numberOfBedrooms,
            airConditioning: property.airConditioning || false,
            listingType: property.listingType,
            videoUrl: property.videoUrl || '',
            bedType: property.bedType || '',
            smokingAllowed: property.smokingAllowed || false,
        });

        // Set cover image if exists
        if (property.coverImage) {
            setFileList([{
                uid: '1',
                name: 'images',
                status: 'done',
                url: baseUrl + property?.coverImage,
                response: property.coverImage
            }]);
        } else {
            setFileList([]);
        }

        // Set gallery images if exist
        if (property.images && property.images.length > 0) {
            const galleryFiles = property.images.map((img, index) => ({
                uid: `gallery-${index}`,
                name: `gallery-image-${index}`,
                status: 'done',
                url: baseUrl + img,
                response: img
            }));
            setGalleryFileList(galleryFiles);
        } else {
            setGalleryFileList([]);
        }
        setImagesToDelete([]);

        setIsEditModalVisible(true);
    };


    const handleUpdateProperty = async (values) => {
        if (!editingProperty) return;

        setIsUpdating(true);
        try {
            const formData = new FormData();

            // Add text fields
            Object.keys(values).forEach(key => {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            // Add cover image if changed
            const coverImageFile = fileList.find(file => file.originFileObj);
            if (coverImageFile) {
                formData.append('images', coverImageFile.originFileObj);
            }

            // Add gallery images if changed
            const galleryFiles = galleryFileList.filter(file => file.originFileObj);
            if (galleryFiles.length > 0) {
                galleryFiles.forEach(file => {
                    formData.append('images', file.originFileObj);
                });
            }

            // Add images to delete
            if (imagesToDelete.length > 0) {
                imagesToDelete.forEach(img => formData.append('imagesToDelete', img));
            }

            const result = await PropertyService.ProcessUpdateProperty(editingProperty._id, formData);
            if (!result) {
                throw new Error("Failed to update property");
            }

            message.success("Property updated successfully");
            setIsEditModalVisible(false);
            setEditingProperty(null);
            editForm.resetFields();
            setFileList([]);
            setGalleryFileList([]);
            setImagesToDelete([]);

            // Refetch to ensure data consistency
            refetch();
        } catch (error) {
            message.error("Failed to update property");
            console.error("Update error:", error);
        } finally {
            setIsUpdating(false);
        }
    };
    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
        setEditingProperty(null);
        editForm.resetFields();
    };

    const handleDelete = async (property) => {
        try {
            const result = await PropertyService.ProcessDeleteProperty(property._id);
            if (!result) {
                throw new Error("Failed to delete property");
            }
            message.success("Property deleted successfully");
            refetch();
        } catch {
            message.error("Failed to delete property");
        }
    };

    const getActionMenuItems = (property) => [
        {
            key: "edit",
            label: (
                <span
                    onClick={() => handleEdit(property)}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <EditOutlined style={{ marginRight: 4 }} /> Edit
                </span>
            ),
        },
        {
            key: "delete",
            label: (
                <Popconfirm
                    title="Are you sure you want to delete this property?"
                    description={`This will permanently delete "${property.title}"`}
                    okText="Yes, Delete"
                    okType="danger"
                    cancelText="Cancel"
                    onConfirm={() => handleDelete(property)}
                >
                    <span style={{ color: '#ff4d4f', display: 'flex', alignItems: 'center' }} className="hover:!text-white">
                        <DeleteOutlined style={{ marginRight: 4 }} /> Delete
                    </span>
                </Popconfirm>
            ),
            danger: true,
        },
    ];

    // Status options
    const statusOptions = [
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "PUBLISHED", label: "Published" },
        { value: "SOLD", label: "Sold" },
        { value: "RENTED", label: "Rented" },
        { value: "DRAFT", label: "Draft" },
        { text: "Rejected", value: "REJECTED" },
    ];

    // Table columns
    const columns = [
        {
            title: "Property",
            key: "property",
            width: 300,
            render: (_, record) => (
                <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {record.coverImage ? (
                            <Image
                                src={baseUrl + record.coverImage}
                                alt={record.title}
                                width={64}
                                height={64}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                preview={false}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <HomeOutlined className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {record.title}
                        </h4>
                        <p
  className="text-sm text-gray-600 mb-2 line-clamp-2"
  dangerouslySetInnerHTML={{ __html: record.description }}
/>
                        <div className="flex items-center text-xs text-gray-500">
                            <Tag color={getListingTypeColor(record.listingType)} size="small">
                                {record.listingType}
                            </Tag>
                            <span className="ml-2">{record.category?.name || "-"} • {record.subcategory?.name || "-"}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Featured",
            key: "featured",
            width: 100,
            render: (_, record) => (
                <div className="text-center">
                    <Switch
                        checked={Boolean(record.isFeatured)}
                        loading={updatingFeatured.includes(record._id)}
                        onChange={(checked) => handleToggleFeatured(record, checked)}
                    />
                </div>
            ),
        },
        {
            title: "Price",
            key: "price",
            width: 120,
            sorter: (a, b) => a.price - b.price,
            render: (_, record) => (
                <div className="text-center">
                    <div className="font-bold text-lg text-green-600">
                        {record.priceUnit === "BDT" ? "৳" : "$"}
                        {record.price?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                        {record.priceUnit}
                    </div>
                </div>
            ),
        },
        {
            title: "Details",
            key: "details",
            width: 150,
            render: (_, record) => (
                <div className="space-y-1">
                    {record.size && (
                        <div className="text-sm">
                            <span className="font-medium">{record.size}</span> {record.sizeUnit}
                        </div>
                    )}
                    {record.numberOfRooms && (
                        <div className="text-xs text-gray-600">
                            {record.numberOfRooms} Rooms
                        </div>
                    )}
                    {record.numberOfBedrooms && (
                        <div className="text-xs text-gray-600">
                            {record.numberOfBedrooms} Bedrooms
                        </div>
                    )}
                    {record.numberOfWashrooms && (
                        <div className="text-xs text-gray-600">
                            {record.numberOfWashrooms} Bathrooms
                        </div>
                    )}
                    {record.numberOfBalconies && (
                        <div className="text-xs text-gray-600">
                            {record.numberOfBalconies} Balconies
                        </div>
                    )}
                    {record.numberOfGuests && (
                        <div className="text-xs text-gray-600">
                            Max {record.numberOfGuests} Guests
                        </div>
                    )}
                    {record.location && (
                        <div className="text-xs text-gray-500 truncate">
                            📍 {record.location}
                        </div>
                    )}
                    {record.bedType && (
                        <div className="text-xs text-gray-600">
                            Bed Type: {record.bedType}
                        </div>
                    )}
                    <div className="text-xs text-gray-600">
                        Air Conditioning: {record.airConditioning ? "Yes" : "No"}
                    </div>
                    <div className="text-xs text-gray-600">
                        Smoking Allowed: {record.smokingAllowed ? "Yes" : "No"}
                    </div>

                </div>
            ),
        },
        {
            title: "Property Owner",
            key: "host",
            width: 120,
            render: (_, record) => (
                <div className="flex items-center space-x-2">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div>
                        <div className="text-sm font-medium truncate">
                            {record?.host?.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {record?.host?.email}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {record?.host?.phone || "N/A"}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Change Status By Admin",
            key: "status",
            width: 160,
            filters: [
                { text: "Published", value: "PUBLISHED" },
                { text: "In Progress", value: "IN_PROGRESS" },
                { text: "Draft", value: "DRAFT" },
                { value: "SOLD", label: "Sold" },
                { text: "Rejected", value: "REJECTED" },
            ],
            onFilter: (value, record) => record.publishStatus === value,
            render: (_, record) => (
                <div className="text-center">
                    <Select
                        value={record.publishStatus || "IN_PROGRESS"}
                        style={{ minWidth: 120 }}
                        onChange={async (value) => {
                            setLocalProperties((prev) => {
                                if (!Array.isArray(prev)) return [];
                                return prev.map((p) =>
                                    p._id === record._id ? { ...p, publishStatus: value } : p
                                );
                            });
                            const result = await PropertyService.ProcessChangePropertyStatus(record._id, value);
                            if (!result) {
                                message.error("Failed to change status");
                                setLocalProperties((prev) => {
                                    if (!Array.isArray(prev)) return [];
                                    return prev.map((p) =>
                                        p._id === record._id ? { ...p, publishStatus: record.publishStatus } : p
                                    );
                                });
                            } else {
                                message.success("Status updated");
                                setLocalProperties(undefined);
                                refetch();
                            }
                        }}
                        size="small"
                    >
                        {statusOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                    {record.isSold && (
                        <div className="mt-1">
                            <Tag color="red" size="small">SOLD</Tag>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Created",
            key: "created",
            width: 100,
            sorter: (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (_, record) => (
                <div className="text-xs text-gray-600">
                    {dayjs(record.createdAt).format("MMM DD, YYYY")}
                </div>
            ),
        },

        {
            title: "Actions",
            key: "actions",
            width: 80,
            fixed: "right",
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getActionMenuItems(record) }}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Main Table Card */}
            <Card
                className="shadow-lg border-0 rounded-xl"
                title={
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Property Management
                        </h3>
                    </div>
                }
            >
                {/* Filters */}
                <div className="mb-4 space-y-4">
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Search properties..."
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full"
                            />
                        </Col>

                        <Col xs={24} sm={6} md={4}>
                            <Select
                                placeholder="Category"
                                allowClear
                                value={selectedCategory || undefined}
                                onChange={setSelectedCategory}
                                className="w-full"
                            >
                                {Array.from(new Set((properties || []).map((p) => p.category?.name).filter(Boolean)))
                                    .map(category => (
                                        <Option key={category} value={category}>{category}</Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        <Col xs={24} sm={6} md={4}>
                            <Select
                                placeholder="Status"
                                allowClear
                                value={selectedStatus || undefined}
                                onChange={setSelectedStatus}
                                className="w-full"
                            >
                                <Option value="PUBLISHED">Published</Option>
                                <Option value="IN_PROGRESS">In Progress</Option>
                                <Option value="DRAFT">Draft</Option>
                                <Option value="REJECTED">Rejected</Option>
                                <Option value="SOLD">Sold</Option>
                                <Option value="RENTED">Rented</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                {/* Table */}
                <Table
    columns={columns}
    dataSource={propertiesData?.properties || []}
    rowKey="_id"
    loading={isLoading}
    scroll={{ x: 1200 }}
    pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: propertiesData?.total || 0, // Backend should return total count
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} properties`,
        onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize: pageSize || 10 });
        },
    }}
    rowClassName={(record) => record.isSold ? "opacity-60" : ""}
    className="custom-table"
/>
            </Card>

            {/* Edit Property Modal */}
            <Modal
                title={
                    <div className="flex items-center">
                        <EditOutlined className="mr-2" />
                        Edit Property
                    </div>
                }
                open={isEditModalVisible}
                onCancel={handleCancelEdit}
                width={800}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleUpdateProperty}
                    initialValues={{
                        priceUnit: "BDT",
                        sizeUnit: "sqft",
                        listingType: "RENT"
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Cover Image">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={({ fileList }) => setFileList(fileList)}
                                    beforeUpload={() => false}
                                    maxCount={1}
                                >
                                    {fileList.length < 1 && (
                                        <div>
                                            <span style={{ fontSize: 24 }}>+</span>
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                                {/* Show current image preview if exists and no new upload */}
                                {fileList.length === 0 && editingProperty?.coverImage && (
                                    <div style={{ marginTop: 8 }}>
                                        <Image
                                            src={baseUrl + editingProperty.coverImage}
                                            alt="Current Cover"
                                            width={100}
                                            height={100}
                                            style={{ objectFit: 'cover', borderRadius: 8 }}
                                            preview={true}
                                        />
                                    </div>
                                )}
                            </Form.Item>
                        </Col>
                        {/* Gallery Images with Remove option and multi-upload */}
                        <Col span={24}>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>Gallery Images</div>
                            <Upload
                                multiple
                                listType="picture-card"
                                fileList={galleryFileList}
                                onChange={({ fileList }) => setGalleryFileList(fileList)}
                                beforeUpload={() => false}
                            >
                                <div>
                                    <span style={{ fontSize: 24 }}>+</span>
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                {galleryFileList.filter(file => !file.originFileObj).map(file => (
                                    <div key={file.uid} style={{ position: 'relative', display: 'inline-block' }}>
                                        <Image
                                            src={file.url}
                                            alt={file.name}
                                            width={80}
                                            height={80}
                                            style={{ objectFit: 'cover', borderRadius: 8 }}
                                            preview={true}
                                        />
                                        <Button
                                            type="primary"
                                            danger
                                            size="small"
                                            style={{ position: 'absolute', top: 2, right: 2, zIndex: 2 }}
                                            onClick={() => {
                                                setGalleryFileList(prev => prev.filter(f => f.uid !== file.uid));
                                                setImagesToDelete(prev => [...prev, file.response]);
                                            }}
                                        >Remove</Button>
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Property Title"
                                rules={[{ required: true, message: 'Please enter property title' }]}
                            >
                                <Input placeholder="Enter property title" />
                            </Form.Item>
                        </Col>

                     <Col span={24}>
    <Form.Item
  name="description"
  label="Description"
  rules={[{ required: true, message: 'Please enter description' }]}
  valuePropName="value"
  getValueFromEvent={(content, delta, source, editor) => editor.getHTML()}
>
  <ReactQuill
    theme="snow"
    placeholder="Enter property description"
    modules={{
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    }}
  />
</Form.Item>

</Col>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: 'Please enter price' }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Enter price"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="priceUnit"
                                label="Price Currency"
                                rules={[{ required: true, message: 'Please select currency' }]}
                            >
                                <Select placeholder="Select currency">
                                    <Option value="BDT">BDT (৳)</Option>
                                    <Option value="USD">USD ($)</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="location"
                                label="Location"
                                rules={[{ required: true, message: 'Please enter location' }]}
                            >
                                <Input placeholder="Enter location" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="size"
                                label="Size"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Enter size"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="sizeUnit"
                                label="Size Unit"
                            >
                                <Select placeholder="Select unit">
                                    <Option value="sqft">Square Feet</Option>
                                    <Option value="sqm">Square Meter</Option>
                                    <Option value="katha">Katha</Option>
                                    <Option value="bigha">Bigha</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* <Col span={8}>
                            <Form.Item
                                name="numberOfRooms"
                                label="Number of Rooms"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Rooms"
                                />
                            </Form.Item>
                        </Col> */}


                        <Col span={8}>
                            <Form.Item
                                name="numberOfBedrooms"
                                label="Number of Bedrooms"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Bedrooms"
                                />
                            </Form.Item>
                        </Col>




                        <Col span={8}>
                            <Form.Item
                                name="numberOfGuests"
                                label="Number of Guests (Max)"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Guests"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="numberOfBalconies"
                                label="Number of Balconies"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Balconies"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="numberOfWashrooms"
                                label="Number of Bathrooms"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Bathrooms"
                                />
                            </Form.Item>
                        </Col>


                        <Col span={8}>
                            <Form.Item
                                name="airConditioning"
                                label="Air Conditioning"
                            >
                                <Select
                                    placeholder="Select option"
                                    onChange={handleSwitchChange}
                                >
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="smokingAllowed"
                                label="Smoking Allowed"
                            >
                                <Select placeholder="Select option">
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="listingType"
                                label="Listing Type"
                                rules={[{ required: true, message: 'Please select listing type' }]}
                            >
                                <Select placeholder="Select type">
                                    <Option value="RENT">For Rent</Option>
                                    <Option value="SALE">For Sale</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="bedType"
                                label="Bed Type"
                            >
                                <Select placeholder="Select bed type" allowClear>
                                    <Option value="Single">Single</Option>
                                    <Option value="Double">Double</Option>
                                    <Option value="Queen">Queen</Option>
                                    <Option value="King">King</Option>
                                    <Option value="Sofa Bed">Sofa Bed</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button onClick={handleCancelEdit}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update Property'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Custom CSS */}
            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background-color: #f8fafc;
                    border-bottom: 2px solid #e2e8f0;
                    font-weight: 600;
                    color: #374151;
                }
                
                .custom-table .ant-table-tbody > tr:hover > td {
                    background-color: #f1f5f9 !important;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                }
                
                .ant-statistic-content-value {
                    font-size: 1.5rem !important;
                }
            `}</style>
        </div>
    );
}