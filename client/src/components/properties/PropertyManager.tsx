"use client";

import React, { useState } from "react";
import { Button, Table, Space, Tag, Card, Pagination, Tooltip, Modal } from "antd";
import { PlusSquareOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { apiBaseUrl } from "@/config/config";
import { Property } from "@/types/propertyTypes";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";


export default function PropertyManager() {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string>("");

    const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    const handleCloseVideoModal = () => {
        setVideoUrl("");
        setIsVideoModalOpen(false);
    };

    // 🟩 1. Fetch profile FIRST
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const accessToken = localStorage.getItem("accessToken");
            const res = await fetch(`${apiBaseUrl}/profile`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to fetch profile");
            const data = await res.json();
            return data?.data || data;
        },
    });

    // 🟩 Extract userId from profile safely
    const userId =
        user?.userId ||
        profile?.userId ||
        profile?.user?._id ||
        profile?._id ||
        null;

    // 🟩 2. Fetch properties only if userId exists
    const {
        data: properties,
        isLoading: propertiesLoading,
        isFetching: propertiesFetching,
    } = useQuery<Property[]>({
        queryKey: ["properties", userId],
        queryFn: async () => {
            if (!userId) return [];
            const accessToken = localStorage.getItem("accessToken");
            const res = await fetch(`${apiBaseUrl}/properties/host/${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to fetch properties");
            const data = await res.json();
            return Array.isArray(data)
                ? data
                : data.properties || data.data || [];
        },
        enabled: !!userId, // ✅ runs only if userId exists
    });

    // 🟩 3. Fetch host guide (only after profile is ready)
    const { data: hostGuide } = useQuery({
        queryKey: ["hostGuide"],
        queryFn: async () => {
            const accessToken = localStorage.getItem("accessToken");
            const res = await fetch(`${apiBaseUrl}/get-host-guide-video`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to fetch host guide");
            const data = await res.json();
            return data?.data || null;
        },
        enabled: !!userId, // ✅ skip until userId exists
    });

    // 🟩 Columns for desktop table
    const columns: ColumnsType<Property> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Price",
            key: "price",
            render: (_, record) => `${record.price} ${record.priceUnit}`,
        },
        {
            title: "Type",
            dataIndex: "listingType",
            key: "listingType",
            render: (type) => (
                <Tag color={type === "RENT" ? "blue" : "green"}>{type}</Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "publishStatus",
            key: "publishStatus",
            render: (status) => {
                const colors: Record<string, string> = {
                    PUBLISHED: "green",
                    IN_PROGRESS: "orange",
                    DRAFT: "gray",
                    SOLD: "red",
                    RENTED: "purple",
                };
                return <Tag color={colors[status || ""]}>{status}</Tag>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    {record.publishStatus === "IN_PROGRESS" ? (
                        <Link
                            href={`/host-dashboard/listed-properties/${record._id}`}
                            passHref
                        >
                            <Button type="primary" size="small" icon={<EditOutlined />}>
                                Edit
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            disabled
                            size="small"
                            icon={<EditOutlined />}
                            className="cursor-not-allowed"
                        >
                            Edit
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    // 🟩 Determine account status safely
    const accountStatus: string =
        profile?.user?.accountStatus ||
        profile?.accountStatus ||
        "inactive";
    const isActive = accountStatus === "active";

    const getTooltip = (status: string) => {
        switch (status) {
            case "active":
                return "Create a new property listing";
            case "inactive":
                return "Your account is not active yet. Go to your profile and complete identity verification to get permission to create listings";
            case "suspended":
                return "Your account has been suspended. Contact support.";
            case "rejected":
                return "Verification was rejected. Review and re-submit your documents.";
            default:
                return "Your account is pending verification.";
        }
    };


    if (profileLoading) {
        return (
            <div className="text-center py-10 text-gray-500 text-lg">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="bg-white max-w-6xl mx-auto rounded-md my-3 md:my-6 mb-6 md:mb-12 p-3 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-3 sm:gap-0">
                <h1 className="text-xl md:text-2xl font-bold">Property Management</h1>

                <div className="flex items-center gap-2">
                    <Tooltip title={getTooltip(accountStatus)}>
                        <span style={{ display: "inline-block" }}>
                            <Link href="/host-dashboard/create-listing-add" passHref>
                                <Button
                                    className={`${accountStatus === "active" ? "!bg-primary" : "!bg-gray-300"} w-full !text-white sm:w-auto`}
                                    type="primary"
                                    icon={<PlusSquareOutlined />}
                                    size="middle"
                                    disabled={!isActive}
                                >
                                    Create Property
                                </Button>
                            </Link>
                        </span>
                    </Tooltip>


                    <Tooltip title="Watch walkthrough video">
                        <Button
                            type="default"
                            className="!text-gray-700"
                            onClick={() => {
                                setVideoUrl(hostGuide?.video || defaultVideoUrl);
                                setIsVideoModalOpen(true);
                            }}
                        >
                            Video
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Card>
                    <Table
                        columns={columns}
                        dataSource={properties ?? []}
                        loading={propertiesLoading || propertiesFetching}
                        rowKey={(record) => record._id}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} properties`,
                        }}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {propertiesLoading ? (
                    <div className="text-center py-8">Loading properties...</div>
                ) : !properties?.length ? (
                    <div className="text-center py-12">
                        <Card className="p-6">
                            <p className="text-gray-500">No properties found</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Create your first property to get started
                            </p>
                        </Card>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {properties
                                ?.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                .map((property) => (
                                    <Card
                                        key={property._id}
                                        className="shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-2">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                                                        {property.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2 truncate">
                                                        📍 {property.location || "Location not specified"}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 ml-2">
                                                    <Tag
                                                        color={
                                                            property.listingType === "RENT" ? "blue" : "green"
                                                        }
                                                    >
                                                        {property.listingType}
                                                    </Tag>
                                                    <Tag
                                                        color={
                                                            property.publishStatus === "PUBLISHED"
                                                                ? "green"
                                                                : property.publishStatus === "IN_PROGRESS"
                                                                    ? "orange"
                                                                    : property.publishStatus === "DRAFT"
                                                                        ? "gray"
                                                                        : property.publishStatus === "SOLD"
                                                                            ? "red"
                                                                            : property.publishStatus === "RENTED"
                                                                                ? "purple"
                                                                                : "default"
                                                        }
                                                    >
                                                        {property.publishStatus}
                                                    </Tag>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-lg font-bold text-blue-600">
                                                        {property.price} {property.priceUnit}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {property.size
                                                            ? `${property.size} ${property.sizeUnit}`
                                                            : "Size not specified"}
                                                        {property.numberOfRooms &&
                                                            ` • ${property.numberOfRooms} rooms`}
                                                    </p>
                                                </div>
                                                {property.publishStatus === "IN_PROGRESS" ? (
                                                    <Link
                                                        href={`/host-dashboard/listed-properties/${property._id}`}
                                                        passHref
                                                    >
                                                        <Button
                                                            type="primary"
                                                            size="small"
                                                            icon={<EditOutlined />}
                                                            className="!bg-blue-600"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        disabled
                                                        size="small"
                                                        icon={<EditOutlined />}
                                                        className="cursor-not-allowed opacity-60"
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>

                        {properties && properties.length > pageSize && (
                            <div className="flex justify-center mt-6">
                                <Pagination
                                    current={currentPage}
                                    total={properties.length}
                                    pageSize={pageSize}
                                    onChange={(page, size) => {
                                        setCurrentPage(page);
                                        if (size) setPageSize(size);
                                    }}
                                    showSizeChanger
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `Showing ${range[0]}-${range[1]} of ${total} properties`
                                    }
                                    size="small"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>


            <Modal
                title={hostGuide?.title || "Hosting Guide Video"}
                open={isVideoModalOpen}
                onCancel={handleCloseVideoModal}
                footer={null}
                width={800}
                centered
                destroyOnClose
                bodyStyle={{ padding: 0 }}
            >
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    {videoUrl && (
                        <iframe
                            src={videoUrl}
                            title="Walkthrough Video"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: 0,
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
}
