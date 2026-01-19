import React, { useState, useEffect } from 'react';
import { User, Home, Calendar, CreditCard } from 'lucide-react';
import { Table, Avatar, Tag, Card, Statistic, Row, Col, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getAllhostReservations } from '@/services/host-reservation';
import { apiBaseUrl } from '@/config/config';
import Image from 'next/image';

type Booking = {
    _id: string;
    userId: {
        _id: string;
        isStaff: boolean;
        avatar: string;
        email: string;
        isVerified: boolean;
        accountStatus: string;
        name: string;
        role: string;
    } | null;
    propertyId: {
        _id: string;
        title: string;
        description: string;
        location: string | null;
        price: number;
        priceUnit: string;
        size: number | null;
        sizeUnit: string;
        numberOfRooms: number | null;
        numberOfWashrooms: number | null;
        numberOfBalconies: number | null;
        numberOfBedrooms: number | null;
        images: string[];
        video: string | null;
        coverImage: string;
        listingType: string;
        duration: string | null;
        rentDurationType: string | null;
        host: {
            _id: string;
            isStaff: boolean;
            avatar: string;
            email: string;
            isVerified: boolean;
            accountStatus: string;
            name: string;
            role: string;
        };
        publishStatus: string;
        isSold: boolean;
        checkinDate: string | null;
        checkoutDate: string | null;
        adultCount: number;
        childrenCount: number;
        blockedDates: string[];
        createdAt: string;
        updatedAt: string;
        slug: string;
    };
    checkInDate: string | null;
    checkOutDate: string | null;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentId: string | null;
    createdAt?: string;
    updatedAt?: string;
};

const BookingManagement = ({ hostId }: { hostId?: string }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHostReservations = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllhostReservations(hostId || '');
                // Filter only bookings where propertyId.listingType === 'RENT'
                const allBookings = response?.data as Booking[];
                const rentBookings = allBookings?.filter(b => b.propertyId?.listingType === 'RENT') || [];
                setBookings(rentBookings);
            } catch (err: any) {
                console.error('Error fetching reservations:', err);
                setError(err.message || 'Error fetching reservations');
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHostReservations();
    }, [hostId]);

    const getPublishStatusColor = (status: string): string => {
        const statusColors: Record<string, string> = {
            'PUBLISHED': 'green',
            'DRAFT': 'orange',
            'UNPUBLISHED': 'red',
            'ARCHIVED': 'default',
            'SOLD': 'purple',
            'RENTED': 'blue',
            'IN_PROGRESS': 'gold'
        };
        return statusColors[status] || 'default';
    };

    const getStatusColor = (status: string): string => {
        const statusColors: Record<string, string> = {
            confirmed: 'green',
            pending: 'orange',
            cancelled: 'red',
            completed: 'blue'
        };
        return statusColors[status] || 'default';
    };

    const getPaymentStatusColor = (status: string): string => {
        const statusColors: Record<string, string> = {
            paid: 'green',
            unpaid: 'red',
            pending: 'orange'
        };
        return statusColors[status] || 'default';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number, unit: string) => {
        return `${price?.toLocaleString()} ${unit}`;
    };

    const columns: ColumnsType<Booking> = [
        {
            title: 'Property Details',
            key: 'property',
            width: 350,
            render: (_, record) => (
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <Image
                            src={
                                record.propertyId?.coverImage
                                    ? apiBaseUrl + record.propertyId.coverImage
                                    : "/default-property.png"
                            }
                            alt={record.propertyId?.title || "Property"}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-lg object-cover border"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                            {record.propertyId?.title || 'Untitled property'}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                            📍 {record.propertyId?.location || 'Location not specified'}
                        </div>
                        <div className="text-sm font-semibold text-blue-600 mb-1">
                            {record.propertyId ? formatPrice(record.propertyId.price, record.propertyId.priceUnit) : 'N/A'}
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                            <Tag color={getPublishStatusColor(record.propertyId?.publishStatus || '')}  >
                                {record.propertyId?.publishStatus?.replace('_', ' ')}
                            </Tag>
                            <Tag color="green">
                                {record.propertyId?.listingType || 'N/A'}
                            </Tag>
                            <span className="text-xs text-gray-400">
                                {record.propertyId?.numberOfRooms || 'N/A'} rooms • {record.propertyId?.size || 'N/A'} {record.propertyId?.sizeUnit || ''}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Client Information',
            key: 'guest',
            width: 250,
            render: (_, record) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {record.userId ? (
                            <Avatar
                                size={40}
                                src={
                                    record.userId?.avatar
                                        ? apiBaseUrl + record.userId.avatar
                                        : "/default-avatar.png"
                                }
                                alt={record.userId?.name || "User"}
                            />
                        ) : (
                            <Avatar size={40} icon={<User />} />
                        )}
                    </div>
                    <div className="ml-3 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {record.userId?.name || 'Guest User'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                            {record.userId?.email || 'No email provided'}
                        </div>
                        <div className="text-xs text-gray-400">
                            {record.userId?.role || 'Guest'}
                            {record.userId?.isVerified && (
                                <span className="ml-1 text-green-600">✓ Verified</span>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Duration',
            key: 'duration',
            width: 200,
            render: (_, record) => (
                <div>
                    <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {formatDate(record.checkInDate || record.propertyId.checkinDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                        to {formatDate(record.checkOutDate || record.propertyId.checkoutDate)}
                    </div>
                    <div className="text-xs text-gray-400">
                        {record.propertyId.adultCount || 0} adults, {record.propertyId.childrenCount || 0} children
                    </div>
                </div>
            ),
        },
        {
            title: 'Booking Status',
            key: 'status',
            width: 120,
            render: (_, record) => (
                <Tag color={getStatusColor(record.status)}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Payment',
            key: 'payment',
            width: 150,
            render: (_, record) => (
                <div className="space-y-1">
                    <Tag color={getPaymentStatusColor(record.paymentStatus)}>
                        {record.paymentStatus.charAt(0).toUpperCase() + record.paymentStatus.slice(1)}
                    </Tag>
                    <div className="text-xs text-gray-500 flex items-center">
                        <CreditCard className="inline h-3 w-3 mr-1" />
                        {record.paymentMethod?.replace('_', ' ')}
                    </div>
                </div>
            ),
        },
        // {
        //     title: 'Actions',
        //     key: 'actions',
        //     width: 120,
        //     fixed: 'right',
        //     render: () => (
        //         <Space size="small">
        //             <Button
        //                 type="text"
        //                 size="small"
        //                 icon={<Eye className="h-4 w-4" />}
        //                 className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
        //             />
        //             <Button
        //                 type="text"
        //                 size="small"
        //                 icon={<Edit className="h-4 w-4" />}
        //                 className="text-green-600 hover:text-green-900 hover:bg-green-50"
        //             />
        //             <Button
        //                 type="text"
        //                 size="small"
        //                 icon={<Trash2 className="h-4 w-4" />}
        //                 className="text-red-600 hover:text-red-900 hover:bg-red-50"
        //             />
        //         </Space>
        //     ),
        // },
    ];

    if (error) {
        return (
            <div className="p-6">
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full bg-gray-50 min-h-screen">
            <Card className="shadow-sm">
                <div className="mb-3 md:mb-6 px-2 md:px-0">
                    <h1 className="text-lg md:text-2xl font-semibold text-gray-900 mb-1">Manage Reservations</h1>
                    <p className="text-xs md:text-base text-gray-600">Monitor and manage all client bookings for your property</p>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Table<Booking>
                        columns={columns}
                        dataSource={bookings}
                        rowKey="_id"
                        loading={loading}
                        scroll={{ x: 1200 }}
                        pagination={{
                            total: bookings.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} reservations`,
                        }}
                        locale={{
                            emptyText: (
                                <div className="text-center py-12">
                                    <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">No bookings found</h3>
                                    <p className="text-sm text-gray-500">No reservations have been made yet.</p>
                                </div>
                            )
                        }}
                        className="booking-management-table"
                        rowClassName="hover:bg-gray-50"
                    />
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3 px-2">
                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-sm font-medium text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-sm text-gray-500">No reservations have been made yet.</p>
                        </div>
                    ) : (
                        bookings.map((booking) => (
                            <Card key={booking._id} className="shadow-sm p-3">
                                <div className="flex items-start space-x-2">
                                    <Image
                                        src={
                                            booking.propertyId?.coverImage
                                                ? apiBaseUrl + booking.propertyId.coverImage
                                                : "/default-property.png"
                                        }
                                        alt={booking.propertyId?.title || "Property"}
                                        width={60}
                                        height={60}
                                        className="w-15 h-15 rounded-md object-cover border flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                                            {booking.propertyId?.title || 'Untitled property'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-1 truncate">
                                            📍 {booking.propertyId?.location || 'Location not specified'}
                                        </p>
                                        <p className="text-xs font-semibold text-blue-600 mb-1">
                                            {booking.propertyId ? formatPrice(booking.propertyId.price, booking.propertyId.priceUnit) : 'N/A'}
                                        </p>
                                        <div className="flex items-center space-x-1 mb-1 flex-wrap">
                                            <Tag color={getPublishStatusColor(booking.propertyId?.publishStatus || '')} className="text-xs px-1 py-0">
                                                {booking.propertyId?.publishStatus?.replace('_', ' ')}
                                            </Tag>
                                            <Tag color="green" className="text-xs px-1 py-0">
                                                {booking.propertyId?.listingType || 'N/A'}
                                            </Tag>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">
                                            {booking.propertyId?.numberOfRooms || 'N/A'} rooms • {booking.propertyId?.size || 'N/A'} {booking.propertyId?.sizeUnit || ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center flex-1 min-w-0">
                                            {booking.userId ? (
                                                <Avatar
                                                    size={28}
                                                    src={
                                                        booking.userId?.avatar
                                                            ? apiBaseUrl + booking.userId.avatar
                                                            : "/default-avatar.png"
                                                    }
                                                    alt={booking.userId?.name || "User"}
                                                />
                                            ) : (
                                                <Avatar size={28} icon={<User />} />
                                            )}
                                            <div className="ml-2 flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-900 truncate">
                                                    {booking.userId?.name || 'Guest User'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {booking.userId?.email || 'No email'}
                                                </p>
                                            </div>
                                        </div>
                                        <Tag color={getStatusColor(booking.status)} className="text-xs ml-2 flex-shrink-0">
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </Tag>
                                    </div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-900 flex items-center mb-1">
                                                <Calendar className="inline h-3 w-3 mr-1 flex-shrink-0" />
                                                <span className="truncate">
                                                    {formatDate(booking.checkInDate || booking.propertyId.checkinDate)} - {formatDate(booking.checkOutDate || booking.propertyId.checkoutDate)}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {booking.propertyId.adultCount || 0} adults, {booking.propertyId.childrenCount || 0} children
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <Tag color={getPaymentStatusColor(booking.paymentStatus)} className="text-xs">
                                                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                            </Tag>
                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                {booking.paymentMethod?.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </Card>

            {/* Summary Cards */}
            <div className="mt-3 md:mt-6 px-2 md:px-0">
                <Row gutter={12}>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-sm">
                            <Statistic
                                title="Total Reservations"
                                value={bookings.length}
                                prefix={
                                    <div className="p-1 md:p-2 bg-blue-100 rounded-lg inline-block">
                                        <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-sm">
                            <Statistic
                                title="Confirmed"
                                value={bookings.filter(b => b.status === 'confirmed').length}
                                prefix={
                                    <div className="p-1 md:p-2 bg-green-100 rounded-lg inline-block">
                                        <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-sm">
                            <Statistic
                                title="Unpaid"
                                value={bookings.filter(b => b.paymentStatus === 'unpaid').length}
                                prefix={
                                    <div className="p-1 md:p-2 bg-red-100 rounded-lg inline-block">
                                        <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-sm">
                            <Statistic
                                title="Properties"
                                value={new Set(bookings.map(b => b.propertyId._id)).size}
                                prefix={
                                    <div className="p-1 md:p-2 bg-purple-100 rounded-lg inline-block">
                                        <Home className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BookingManagement;