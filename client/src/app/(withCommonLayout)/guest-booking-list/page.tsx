"use client";
import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Button, Alert } from 'antd';
import { Calendar, MapPin, CreditCard, Home } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { getBookingByUserId } from "@/app/apis/booking.apis";
import { Booking } from "@/types/BookingsTypes";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

const BookingListPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();



  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const UserId = user?.userId;
        console.log("User ID:", UserId);
        if (!UserId) {
          setError("User ID not found.");
          setLoading(false);
          return;
        }
        const data: Booking[] = await getBookingByUserId(UserId);
        console.log("API Response:", data);
        setBookings(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.userId]);

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      confirmed: 'green',
      pending: 'orange',
      cancelled: 'red',
      completed: 'blue',
      active: 'cyan'
    };
    return statusColors[status.toLowerCase()] || 'default';
  };

  const getPaymentStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      paid: 'green',
      unpaid: 'red',
      pending: 'orange',
      processing: 'blue'
    };
    return statusColors[status.toLowerCase()] || 'default';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number | undefined, unit: string | undefined) => {
    if (!price) return 'N/A';
    return `${price.toLocaleString()} ${unit || ''}`;
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Property Details',
      key: 'property',
      width: 300,
      render: (_, record) => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
              {record.propertyId?.title || "Unknown Property"}
            </div>
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{record.propertyId?.location || "N/A"}</span>
            </div>
            <div className="text-sm font-medium text-green-600">
              {formatPrice(record.propertyId?.price, record.propertyId?.priceUnit)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Booking Period',
      key: 'period',
      width: 200,
      render: (_, record) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-900 mb-1">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-medium">Check-in</span>
          </div>
          <div className="text-gray-600 mb-2 ml-6">
            {formatDate(record.checkInDate)}
          </div>
          <div className="flex items-center text-gray-900 mb-1">
            <Calendar className="h-4 w-4 mr-2 text-red-500" />
            <span className="font-medium">Check-out</span>
          </div>
          <div className="text-gray-600 ml-6">
            {formatDate(record.checkOutDate)}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <div className="space-y-2">
          <Tag color={getStatusColor(record.status)} className="mb-1">
            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Payment',
      key: 'payment',
      width: 150,
      render: (_, record) => (
        <div className="space-y-2">
          <Tag color={getPaymentStatusColor(record.paymentStatus)}>
            {record.paymentStatus.charAt(0).toUpperCase() + record.paymentStatus.slice(1)}
          </Tag>
          <div className="text-xs text-gray-500 flex items-center">
            <CreditCard className="h-3 w-3 mr-1" />
            {record.paymentMethod?.replace('_', ' ') || 'N/A'}
          </div>
        </div>
      ),
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   width: 100,
    //   fixed: 'right',
    //   render: () => (
    //     <Space size="small">
    //       <Button
    //         type="text"
    //         size="small"
    //         icon={<Eye className="h-4 w-4" />}
    //         className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
    //         title="View Details"
    //       />
    //       <Button
    //         type="text"
    //         size="small"
    //         icon={<Download className="h-4 w-4" />}
    //         className="text-green-600 hover:text-green-800 hover:bg-green-50"
    //         title="Download Receipt"
    //       />
    //     </Space>
    //   ),
    // },
  ];


  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="booking-card shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Property Header */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {booking.propertyId?.title || "Unknown Property"}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{booking.propertyId?.location || "N/A"}</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatPrice(booking.propertyId?.price, booking.propertyId?.priceUnit)}
            </div>
          </div>
        </div>

        {/* Booking Period */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            Booking Period
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Check-in</div>
              <div className="font-medium text-gray-900">{formatDate(booking.checkInDate)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Check-out</div>
              <div className="font-medium text-gray-900">{formatDate(booking.checkOutDate)}</div>
            </div>
          </div>
        </div>

        {/* Status and Payment */}
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <Tag color={getStatusColor(booking.status)} className="w-fit">
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Tag>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Payment</span>
            <div className="space-y-1">
              <Tag color={getPaymentStatusColor(booking.paymentStatus)} className="w-fit">
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </Tag>
              <div className="flex items-center text-xs text-gray-500">
                <CreditCard className="h-3 w-3 mr-1" />
                {booking.paymentMethod?.replace('_', ' ') || 'N/A'}
              </div>
            </div>
          </div>
        </div>


      </div>
    </Card>
  );



  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Bookings"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .booking-card {
          transition: all 0.2s ease-in-out;
        }

        .booking-card:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 767px) {
          .ant-card-body {
            padding: 16px !important;
          }

          .ant-card {
            margin-bottom: 0 !important;
          }
        }
      `}</style>
      <div className="w-full p-3 md:p-4 max-w-[85rem] mx-auto bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600 text-sm md:text-base">Manage and track all your property reservations</p>
        </div>

        <Card className="shadow-sm">
          {isMobile ? (
            // Mobile Card Layout
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500 mb-4">You haven&#39;t made any bookings yet.</p>
                  <Link href="/properties?listingType=rent" passHref>
                    <Button type="primary" size="large">
                      Browse Properties
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {bookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                  <div className="text-center text-sm text-gray-500 py-4">
                    Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Desktop Table Layout
            <Table<Booking>
              columns={columns}
              dataSource={bookings}
              rowKey="_id"
              loading={loading}
              scroll={{ x: 800 }}
              pagination={{
                total: bookings?.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} bookings`,
                pageSizeOptions: ['5', '10', '20', '50'],
              }}
              locale={{
                emptyText: (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500 mb-4">You haven&#39;t made any bookings yet.</p>
                    <Link href="/properties?listingType=rent" passHref>
                      <Button type="primary" size="large">
                        Browse Properties
                      </Button>
                    </Link>
                  </div>
                )
              }}
              className="booking-list-table"
              rowClassName="hover:bg-gray-50"
              size="middle"
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default BookingListPage;