"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Checkbox,
    Upload,
    message,
    Card,
    Divider,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl } from "@/config/config";
import { Subcategory } from "@/types/subcategories";
import useAuth from "@/hooks/useAuth";
import dayjs from "dayjs";
import Image from "next/image";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const { Option } = Select;

// Move ReactQuill dynamic import outside the component
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ListingFormProps {
    subcategoryId: string | null;
    onSubmitSuccess?: () => void;
}

export default function ListingForm({ subcategoryId, onSubmitSuccess }: ListingFormProps) {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [listingType, setListingType] = useState<string>("RENT");
    const [rentDurationType, setRentDurationType] = useState<string>("MONTHLY");

    const { data: subcategory, isLoading: subcategoryLoading } = useQuery<Subcategory | null>({
        queryKey: ["subcategory", subcategoryId],
        queryFn: async () => {
            if (!subcategoryId) return null;
            const res = await fetch(`${apiBaseUrl}/subcategories/${subcategoryId}`);
            if (!res.ok) throw new Error("Failed to fetch subcategory");
            return await res.json();
        },
        enabled: !!subcategoryId,
    });

    // Configure Quill modules
    const quillModules = {
          toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }], // <-- important
    ['link', 'clean']
  ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'color',
        'link'
    ];

    useEffect(() => {
        if (subcategory && subcategory.allowedListingTypes && subcategory.allowedListingTypes.length > 0) {
            setListingType(subcategory.allowedListingTypes[0]);
        }
    }, [subcategory]);

    if (!subcategoryId) {
        return null;
    }

    if (subcategoryLoading) {
        return (
            <Card className="text-center py-12">
                <LoadingOutlined className="text-2xl text-blue-500 mb-4" />
                <p className="text-gray-600">Loading subcategory details...</p>
            </Card>
        );
    }

    if (!subcategory) {
        return (
            <Card className="text-center py-12">
                <p className="text-red-600">Subcategory not found.</p>
            </Card>
        );
    }

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                const value = values[key];
                if (value !== null && value !== undefined && key !== "host") {
                    if (key === "amenities" && Array.isArray(value)) {
                        value.forEach((amenityId: string) =>
                            formData.append("amenities", amenityId)
                        );
                    } else if (key === "checkinDate" || key === "checkoutDate") {
                        if (value && dayjs.isDayjs(value)) {
                            formData.append(key, value.format("YYYY-MM-DD"));
                        }
                    } else if (key === "blockedDates" && Array.isArray(value)) {
                        if (value.length === 2 && value[0] && value[1]) {
                            const startDate = dayjs.isDayjs(value[0]) ? value[0] : dayjs(value[0]);
                            const endDate = dayjs.isDayjs(value[1]) ? value[1] : dayjs(value[1]);

                            let currentDate = startDate.clone();
                            while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
                                formData.append("blockedDates", currentDate.format("YYYY-MM-DD"));
                                currentDate = currentDate.add(1, 'day');
                            }
                        }
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            if (user && user.userId) {
                console.log("Adding host ID:", user.userId);
                formData.append("host", user.userId);
            }

            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            formData.append("publishStatus", "IN_PROGRESS");

            const response = await fetch(`${apiBaseUrl}/properties`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create property");
            }

            const result = await response.json();
            console.log("Property created:", result);

            message.success("Property created successfully!");
            form.resetFields();
            setImageFiles([]);

            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        } catch (error) {
            console.error("Error creating property:", error);
            message.error("Failed to create property");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <Card className="bg-blue-50 border-red-200">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                        {subcategory?.image ? (
                            <Image
                                src={apiBaseUrl + subcategory.image}
                                alt={subcategory.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                                {subcategory?.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-blue-900 truncate">
                            {(subcategory.category as any)?.name || 'Category'} - {subcategory.name}
                        </h3>
                        <p className="text-blue-700 text-xs sm:text-sm">Fill in the details for your {subcategory.name.toLowerCase()} listing</p>
                    </div>
                </div>
            </Card>

            <Card>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    className="space-y-4"
                >
                    <Form.Item
                        name="category"
                        initialValue={(subcategory.category as any)?._id || ''}
                        style={{ display: 'none' }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="subcategory"
                        initialValue={subcategory._id}
                        style={{ display: 'none' }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="host"
                        initialValue={user?.userId || ''}
                        style={{ display: 'none' }}
                    >
                        <Input />
                    </Form.Item>

                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    label="Listing Type"
                                    name="listingType"
                                    rules={[{ required: true, message: "Listing type is required" }]}
                                    initialValue={subcategory.allowedListingTypes[0]}
                                >
                                    <Select
                                        size="large"
                                        value={listingType}
                                        onChange={val => {
                                            setListingType(val);
                                            if (val !== "RENT") setRentDurationType("MONTHLY");
                                        }}
                                    >
                                        {subcategory.allowedListingTypes.map((type) => (
                                            <Option key={type} value={type}>{type}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Price Unit"
                                    name="priceUnit"
                                    rules={[{ required: true, message: "Price unit is required" }]}
                                    initialValue="BDT"
                                >
                                    <Select size="large">
                                        <Option value="BDT">BDT (৳)</Option>
                                        <Option value="USD">USD ($)</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            {listingType === "RENT" && (
                                <Form.Item
                                    label="Rent Duration Type"
                                    name="rentDurationType"
                                    rules={[{ required: true, message: "Rent duration type is required" }]}
                                    initialValue="MONTHLY"
                                >
                                    <Select
                                        size="large"
                                        value={rentDurationType}
                                        onChange={val => setRentDurationType(val)}
                                    >
                                        <Option value="MONTHLY">Monthly</Option>
                                        <Option value="YEARLY">Yearly</Option>
                                        <Option value="SIX_MONTHS">Six Months</Option>
                                        <Option value="DAILY">Daily</Option>
                                        <Option value="WEEKLY">Weekly</Option>
                                        <Option value="HOURLY">Hourly</Option>
                                        <Option value="FLEXIBLE">Flexible</Option>
                                    </Select>
                                </Form.Item>
                            )}

                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: "Price is required" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    size="large"
                                    min={0}
                                    placeholder="Enter price"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Property Title"
                                name="title"
                                rules={[{ required: true, message: "Title is required" }]}
                            >
                                <Input placeholder="Enter a catchy title for your property" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    { required: true, message: "Description is required" },
                                    {
                                        validator: (_, value) => {
                                            const textContent = value?.replace(/<[^>]*>/g, '').trim();
                                            if (!textContent) {
                                                return Promise.reject('Description is required');
                                            }
                                            if (textContent.length > 500) {
                                                return Promise.reject('Description must not exceed 500 characters');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Describe your property, its features, and what makes it special"
                                    style={{ height: '150px', marginBottom: '50px' }}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider />

                    {subcategory.filterConfig && Array.isArray(subcategory.filterConfig.fields) && (
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Property Details</h4>
                            {subcategory.filterConfig.fields.map((field: any) => {
                                if (["title", "description", "category", "subcategory", "listingType", "host", "price", "priceUnit"].includes(field.name)) {
                                    return null;
                                }

                                if (field.type === "select") {
                                    return (
                                        <Form.Item key={field.name} label={field.label} name={field.name} rules={[{ required: field.isRequired }]}>
                                            <Select placeholder={field.label} size="large">
                                                {field.options.map((opt: string) => (
                                                    <Option key={opt} value={opt}>{opt}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    );
                                }
                                if (field.type === "text") {
                                    return (
                                        <Form.Item key={field.name} label={field.label} name={field.name} rules={[{ required: field.isRequired }]}>
                                            <Input placeholder={field.placeholder || field.label} size="large" />
                                        </Form.Item>
                                    );
                                }
                                if (field.type === "range") {
                                    return (
                                        <Form.Item key={field.name} label={field.label} name={field.name} rules={[{ required: field.isRequired }]}>
                                            <InputNumber
                                                style={{ width: "100%" }}
                                                size="large"
                                                min={field.validation?.min}
                                                max={field.validation?.max}
                                                placeholder={field.label}
                                            />
                                        </Form.Item>
                                    );
                                }
                                if (field.type === "measurement") {
                                    return (
                                        <div key={field.name} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="sm:col-span-2">
                                                <Form.Item label={field.label} name={field.name} rules={[{ required: field.isRequired }]}>
                                                    <InputNumber style={{ width: "100%" }} size="large" placeholder={field.label} />
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <Form.Item label="Unit" name={`${field.name}Unit`} initialValue={field.defaultUnit}>
                                                    <Select size="large">
                                                        {field.supportedUnits.map((unit: string) => (
                                                            <Option key={unit} value={unit}>{unit}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    );
                                }
                                if (field.type === "boolean") {
                                    return (
                                        <Form.Item key={field.name} name={field.name} valuePropName="checked" label={field.label}>
                                            <Checkbox>{field.label}</Checkbox>
                                        </Form.Item>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                    {subcategory.amenitiesConfig && Array.isArray(subcategory.amenitiesConfig.availableAmenities) && (
                        <>
                            <Divider />
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Amenities</h4>
                                <Form.Item name="amenities">
                                    <Checkbox.Group className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {subcategory.amenitiesConfig.availableAmenities.map((amenity: any) => (
                                            <Checkbox key={amenity._id} value={amenity._id} className="flex items-center">
                                                <div className="flex items-center space-x-2">
                                                    {amenity.image && (
                                                        <Image
                                                            src={apiBaseUrl + amenity.image}
                                                            alt={amenity.label}
                                                            width={20}
                                                            height={20}
                                                            className="object-cover rounded flex-shrink-0"
                                                        />
                                                    )}
                                                    <span className="text-sm">{amenity.label || amenity.name}</span>
                                                </div>
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                        </>
                    )}

                    {subcategory.requiresGuestCount && (
                        <>
                            <Divider />
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Guest Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Form.Item label="Adults" name="adultCount">
                                        <InputNumber style={{ width: "100%" }} size="large" min={0} placeholder="Number of adults" />
                                    </Form.Item>
                                    <Form.Item label="Children" name="childrenCount">
                                        <InputNumber style={{ width: "100%" }} size="large" min={0} placeholder="Number of children" />
                                    </Form.Item>
                                </div>
                            </div>
                        </>
                    )}

                    {listingType === "RENT" && rentDurationType === "FLEXIBLE" && (
                        <>
                            <Divider />
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Availability</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Form.Item label="Available From" name="checkinDate">
                                        <DatePicker style={{ width: "100%" }} size="large" />
                                    </Form.Item>
                                    <Form.Item label="Available Till" name="checkoutDate">
                                        <DatePicker style={{ width: "100%" }} size="large" />
                                    </Form.Item>
                                </div>
                            </div>

                            <Form.Item label="Blocked Dates (Optional)" name="blockedDates">
                                <DatePicker.RangePicker
                                    style={{ width: "100%" }}
                                    size="large"
                                    placeholder={["Start Date", "End Date"]}
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                        </>
                    )}

                    <Divider />

                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Media</h4>

                        <Form.Item label="Property Images" name="images" extra="Use control key to select multiple images and ratio 4:3 is recommended (Landscape)" rules={[{ required: true, message: "At least one image is required" }]}>
                            <Upload
                                multiple
                                listType="picture-card"
                                beforeUpload={(file) => {
                                    setImageFiles(prev => [...prev, file]);
                                    return false;
                                }}
                                onRemove={(file) => {
                                    const fileName = file.name;
                                    setImageFiles(prev => prev.filter(f => f.name !== fileName));
                                }}
                                className="upload-list-inline"
                            >
                                <div>
                                    <UploadOutlined />
                                    <div className="mt-2">Upload Images</div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item label="Video URL (Optional)" name="video" extra="YouTube platform URL">
                            <Input placeholder="https://www.youtube.com/watch?v=..." size="large" />
                        </Form.Item>
                    </div>

                    <div className="pt-6 border-t">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isSubmitting}
                            className="w-full h-12 !bg-green-400 hover:!bg-green-500 text-lg font-semibold"
                        >
                            {isSubmitting ? 'Submitting Property...' : 'Submit Property'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}