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
  Row,
  Col,
  message,
  Card,
  Divider,
  Spin,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "@/config/config";
import { Subcategory } from "@/types/subcategories";
import useAuth from "@/hooks/useAuth";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css"; // quill styles
const { Option } = Select;

interface PropertyEditFormProps {
  propertyId: string;
  onUpdateSuccess?: () => void;
}

interface PropertyData {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  listingType: string;
  category: any;
  subcategory: any;
  amenities?: string[];
  images?: string[];
  video?: string;
  adultCount?: number;
  childrenCount?: number;
  checkinDate?: string;
  checkoutDate?: string;
  blockedDates?: string[];
  [key: string]: any;
}

export default function PropertyEditForm({
  propertyId,
  onUpdateSuccess,
}: PropertyEditFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

  // Fetch property details
  const { data: property, isLoading: propertyLoading } = useQuery<PropertyData>(
    {
      queryKey: ["property", propertyId],
      queryFn: async () => {
        const res = await fetch(`${apiBaseUrl}/properties/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch property");
        return await res.json();
      },
      enabled: !!propertyId,
    }
  );

  // Fetch subcategory details
  const { data: subcategory, isLoading: subcategoryLoading } =
    useQuery<Subcategory | null>({
      queryKey: [
        "subcategory",
        property?.subcategory?._id || property?.subcategory,
      ],
      queryFn: async () => {
        const subcategoryId =
          property?.subcategory?._id || property?.subcategory;
        if (!subcategoryId) return null;
        const res = await fetch(`${apiBaseUrl}/subcategories/${subcategoryId}`);
        if (!res.ok) throw new Error("Failed to fetch subcategory");
        return await res.json();
      },
      enabled: !!property?.subcategory,
    });

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${apiBaseUrl}/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update property");
      return response.json();
    },
    onSuccess: () => {
      message.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      setImagesToDelete([]); // Clear deleted images list
      setImageFiles([]); // Clear new images list
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    },
    onError: (error) => {
      console.error("Error updating property:", error);
      message.error("Failed to update property");
    },
  });

  // Set form values when property data is loaded
  useEffect(() => {
    if (property && subcategory) {
      const formValues: any = { ...property };

      // Handle dates
      if (property.checkinDate) {
        formValues.checkinDate = dayjs(property.checkinDate);
      }
      if (property.checkoutDate) {
        formValues.checkoutDate = dayjs(property.checkoutDate);
      }
      if (property.blockedDates && property.blockedDates.length >= 2) {
        formValues.blockedDates = [
          dayjs(property.blockedDates[0]),
          dayjs(property.blockedDates[property.blockedDates.length - 1]),
        ];
      }

      // Handle category and subcategory IDs
      formValues.category = property.category?._id || property.category;
      formValues.subcategory =
        property.subcategory?._id || property.subcategory;
      formValues.host = user?.userId || property.host;

      // Ensure amenities is always an array of string IDs (handles both string[] and object[])
      formValues.amenities = Array.isArray(property.amenities)
        ? property.amenities.map((a: any) =>
          typeof a === "object" && a !== null && a._id
            ? String(a._id)
            : String(a)
        )
        : [];

      // Set existing images
      if (property.images) {
        setExistingImages(property.images);
      }

      form.setFieldsValue(formValues);
    }
  }, [property, subcategory, form, user?.userId]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      console.log("Form values:", values);

      const formData = new FormData();

      // Add form values to FormData
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value !== null && value !== undefined && key !== "host") {
          if (key === "amenities") {
            if (Array.isArray(value) && value.length > 0) {
              value.forEach((amenityId: any) =>
                formData.append("amenities", String(amenityId))
              );
            }
            // If amenities is empty or not present, do not append anything
          } else if (key === "checkinDate" || key === "checkoutDate") {
            if (value && dayjs.isDayjs(value)) {
              formData.append(key, value.format("YYYY-MM-DD"));
            }
          } else if (key === "blockedDates" && Array.isArray(value)) {
            if (value.length === 2 && value[0] && value[1]) {
              const startDate = dayjs.isDayjs(value[0])
                ? value[0]
                : dayjs(value[0]);
              const endDate = dayjs.isDayjs(value[1])
                ? value[1]
                : dayjs(value[1]);

              let currentDate = startDate.clone();
              while (
                currentDate.isBefore(endDate) ||
                currentDate.isSame(endDate)
              ) {
                formData.append(
                  "blockedDates",
                  currentDate.format("YYYY-MM-DD")
                );
                currentDate = currentDate.add(1, "day");
              }
            }
          } else if (
            (key === "airConditioning" || key === "smokingAllowed") &&
            value === true
          ) {
            formData.append(key, String(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add host (user ID)
      if (user && user.userId) {
        formData.append("host", user.userId);
      }

      // Add images to delete
      imagesToDelete.forEach((image) => {
        formData.append("imagesToDelete", image);
      });

      // Add existing images that should be kept
      existingImages.forEach((image) => {
        formData.append("existingImages", image);
      });

      // Add new images
      imageFiles.forEach((file) => {
        formData.append("files", file);
      });

      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error updating property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExistingImage = (imageToRemove: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageToRemove));
    setImagesToDelete((prev) => [...prev, imageToRemove]);
  };

  if (propertyLoading || subcategoryLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!property || !subcategory || !form.getFieldValue("amenities")) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-600">
          Property or subcategory not found or loading amenities...
        </p>
      </Card>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="mr-2"
        />
        <h1 className="text-2xl font-semibold text-gray-800">Edit Property</h1>
      </div>

      <div className="space-y-6">
        {/* Subcategory Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md">
              {subcategory?.image ? (
                <Image
                  src={apiBaseUrl + subcategory.image}
                  alt={subcategory.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {subcategory?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {(subcategory.category as any)?.name || "Category"} -{" "}
                {subcategory.name}
              </h3>
              <p className="text-blue-700 text-sm">
                Edit your {subcategory.name.toLowerCase()} listing details
              </p>
            </div>
          </div>
        </Card>

        {/* Main Form */}
        <Card className="shadow-lg border-0 rounded-xl">
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            className="space-y-4"
            initialValues={form.getFieldsValue()}
          >
            {/* Hidden Fields */}
            <Form.Item name="category" style={{ display: "none" }}>
              <Input />
            </Form.Item>
            <Form.Item name="subcategory" style={{ display: "none" }}>
              <Input />
            </Form.Item>
            <Form.Item name="host" style={{ display: "none" }}>
              <Input />
            </Form.Item>

            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h4>

              <Form.Item
                label="Property Title"
                name="title"
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Input
                  placeholder="Enter a catchy title for your property"
                  size="large"
                />
              </Form.Item>

              <Form.Item
  label="Description"
  name="description"
  rules={[{ required: true, message: "Description is required" }]}
>
  <ReactQuill
    theme="snow"
    placeholder="Describe your property, its features, and what makes it special"
    modules={{
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'bullet' }, { 'list': 'ordered' }], // Bullet FIRST
        ['link'],
        ['clean']
      ],
    }}
  />
</Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Listing Type"
                    name="listingType"
                    rules={[
                      { required: true, message: "Listing type is required" },
                    ]}
                  >
                    <Select size="large">
                      {subcategory.allowedListingTypes.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Price Unit"
                    name="priceUnit"
                    rules={[
                      { required: true, message: "Price unit is required" },
                    ]}
                  >
                    <Select size="large">
                      <Option value="BDT">BDT (৳)</Option>
                      {/* <Option value="USD">USD ($)</Option> */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

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
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </div>

            <Divider />

            {subcategory.filterConfig &&
              Array.isArray(subcategory.filterConfig.fields) && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Property Details
                  </h4>
                  {subcategory.filterConfig.fields.map((field: any) => {
                    if (
                      [
                        "title",
                        "description",
                        "category",
                        "subcategory",
                        "listingType",
                        "host",
                        "price",
                        "priceUnit",
                      ].includes(field.name)
                    ) {
                      return null;
                    }

                    if (field.type === "select") {
                      return (
                        <Form.Item
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          rules={[{ required: field.isRequired }]}
                        >
                          <Select placeholder={field.label} size="large">
                            {field.options.map((opt: string) => (
                              <Option key={opt} value={opt}>
                                {opt}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      );
                    }
                    if (field.type === "text") {
                      return (
                        <Form.Item
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          rules={[{ required: field.isRequired }]}
                        >
                          <Input
                            placeholder={field.placeholder || field.label}
                            size="large"
                          />
                        </Form.Item>
                      );
                    }
                    if (field.type === "range") {
                      return (
                        <Form.Item
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          rules={[{ required: field.isRequired }]}
                        >
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
                        <Row gutter={16} key={field.name}>
                          <Col span={16}>
                            <Form.Item
                              label={field.label}
                              name={field.name}
                              rules={[{ required: field.isRequired }]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                size="large"
                                placeholder={field.label}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Unit" name={`${field.supportedUnits[0]}Unit`}>
                              <Select size="large">
                                {field.supportedUnits.map((unit: string) => (
                                  <Option key={unit} value={unit}>
                                    {unit}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

            {/* Amenities */}
            {subcategory.amenitiesConfig &&
              Array.isArray(subcategory.amenitiesConfig.availableAmenities) && (
                <>
                  <Divider />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Amenities
                    </h4>
                    <Form.Item name="amenities">
                      <Checkbox.Group className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {subcategory.amenitiesConfig.availableAmenities.map(
                          (amenity: any) => (
                            <Checkbox
                              key={amenity._id}
                              value={String(amenity._id)}
                              className="flex items-center"
                            >
                              <div className="flex items-center space-x-2">
                                {amenity.image && (
                                  <Image
                                    src={apiBaseUrl + amenity.image}
                                    alt={amenity.label}
                                    width={20}
                                    height={20}
                                    className="object-cover rounded"
                                  />
                                )}
                                <span className="text-sm">
                                  {amenity.label || amenity.name}
                                </span>
                              </div>
                            </Checkbox>
                          )
                        )}
                      </Checkbox.Group>
                    </Form.Item>
                  </div>
                </>
              )}

            {/* Guest Information */}
            {subcategory.requiresGuestCount && (
              <>
                <Divider />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Guest Information
                  </h4>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Adults" name="adultCount">
                        <InputNumber
                          style={{ width: "100%" }}
                          size="large"
                          min={0}
                          placeholder="Number of adults"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Children" name="childrenCount">
                        <InputNumber
                          style={{ width: "100%" }}
                          size="large"
                          min={0}
                          placeholder="Number of children"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {/* Date Information */}
            {subcategory.requiresDateRange && (
              <>
                <Divider />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Availability
                  </h4>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Check-in Date" name="checkinDate">
                        <DatePicker style={{ width: "100%" }} size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Check-out Date" name="checkoutDate">
                        <DatePicker style={{ width: "100%" }} size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {/* Blocked Dates */}
            <Form.Item label="Blocked Dates (Optional)" name="blockedDates">
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                size="large"
                placeholder={["Start Date", "End Date"]}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Divider />

            {/* Media */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Media
              </h4>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-md font-medium text-gray-700 mb-2">
                    Current Images
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={apiBaseUrl + image}
                          alt={`Property image ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          size="small"
                          danger
                          className="absolute top-1 right-1"
                          onClick={() => handleRemoveExistingImage(image)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Form.Item
                label="Add New Images"
                name="images"
                extra="Upload additional high-quality images of your property"
              >
                <Upload
                  multiple
                  listType="picture-card"
                  beforeUpload={(file) => {
                    setImageFiles((prev) => [...prev, file]);
                    return false;
                  }}
                  onRemove={(file) => {
                    const fileName = file.name;
                    setImageFiles((prev) =>
                      prev.filter((f) => f.name !== fileName)
                    );
                  }}
                  className="upload-list-inline"
                >
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">Upload Images</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Video URL (Optional)"
                name="video"
                extra="YouTube platform URL"
              >
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  size="large"
                />
              </Form.Item>
            </div>

            {/* Additional Features */}
            <Divider />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Features
              </h4>

              <Form.Item name="airConditioning" valuePropName="checked">
                <Checkbox>Air Conditioning</Checkbox>
              </Form.Item>

              <Form.Item name="smokingAllowed" valuePropName="checked">
                <Checkbox>Smoking Allowed</Checkbox>
              </Form.Item>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={isSubmitting}
                className="w-full h-12 !bg-blue-600 hover:!bg-blue-700 text-lg font-semibold"
              >
                {isSubmitting ? "Updating Property..." : "Update Property"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
