import React, { useState, useEffect } from "react";
import { fetchEarningsByPropertyId } from "../../apis/earnings.apis";

const EarningsDetailsByProperty = ({ propertyId }) => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const response = await fetchEarningsByPropertyId(propertyId);
        setEarnings(response.data || []);
      } catch {
        setError("Failed to fetch earnings data.");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      loadEarnings();
    }
  }, [propertyId]);

  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const calculateTotal = (key) => {
    const total = earnings?.reduce(
      (total, earning) => total + (earning?.[key] || 0),
      0
    );
    return formatCurrency(total);
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const totalRevenue = earnings.reduce(
    (total, earning) => total + (earning?.revenue || 0),
    0
  );
  const totalCost = earnings.reduce(
    (total, earning) => total + (earning?.cost || 0),
    0
  );
  const totalProfit = totalRevenue - totalCost;

  // Calculate net profit margin considering all transactions
  const netProfitMargin =
    totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading earnings data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <div className="flex items-center">
          <span className="text-red-500 text-xl mr-2">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!earnings?.length) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No earnings data
        </h3>
        <p className="text-gray-600">
          No earnings transactions found for this property.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium mb-2">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-green-700">
            {totalRevenue}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600 font-medium mb-2">
            Total Cost
          </div>
          <div className="text-2xl font-bold text-red-700">
            {calculateTotal("cost")}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium mb-2">
            Total Profit
          </div>
          <div
            className={`text-2xl font-bold ${
              totalProfit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalProfit}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium mb-2">
            Net Profit Margin
          </div>
          <div
            className={`text-2xl font-bold ${
              parseFloat(netProfitMargin) >= 15
                ? "text-green-600"
                : parseFloat(netProfitMargin) >= 5
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {netProfitMargin}%
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction Details
        </h3>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Margin(%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {earnings.map((earning) => (
                <tr
                  key={earning?._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(earning)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {earning?.transactionDate
                      ? new Date(earning.transactionDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    {earning?.revenue?.toLocaleString() || "0"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">
                    {earning?.cost?.toLocaleString() || "0"}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium ${
                      earning?.profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {earning?.profit?.toLocaleString() || "0"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {earning?.commissionType || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {earning?.profitMargin
                      ? earning.profitMargin.toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        earning?.paymentStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : earning?.paymentStatus === "PENDING"
                          ? "bg-primary-100 text-primary"
                          : earning?.paymentStatus === "PARTIAL"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {earning?.paymentStatus || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Transaction Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Transaction Image */}
                {selectedTransaction?.image && (
                  <div className="flex justify-center">
                    <img
                      src={`${BASE_URL}${selectedTransaction.image}`}
                      alt="Transaction"
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Transaction Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction ID
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {selectedTransaction?._id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Date
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {selectedTransaction?.transactionDate
                          ? new Date(
                              selectedTransaction.transactionDate
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {selectedTransaction?.transactionType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Status
                      </label>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          selectedTransaction?.paymentStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : selectedTransaction?.paymentStatus === "PENDING"
                            ? "bg-primary-100 text-primary"
                            : selectedTransaction?.paymentStatus === "PARTIAL"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedTransaction?.paymentStatus || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Revenue
                      </label>
                      <p className="text-lg font-semibold text-green-600 bg-green-50 px-3 py-2 rounded">
                        {selectedTransaction?.revenue?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost
                      </label>
                      <p className="text-lg font-semibold text-red-600 bg-red-50 px-3 py-2 rounded">
                        {selectedTransaction?.cost?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profit
                      </label>
                      <p
                        className={`text-lg font-semibold px-3 py-2 rounded ${
                          selectedTransaction?.profit >= 0
                            ? "text-green-600 bg-green-50"
                            : "text-red-600 bg-red-50"
                        }`}
                      >
                        {selectedTransaction?.profit?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profit Margin(%)
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {selectedTransaction?.profitMargin
                          ? `${selectedTransaction.profitMargin.toLocaleString()} (${
                              selectedTransaction.commissionType || "N/A"
                            })`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                {selectedTransaction?.property && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Property Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Title</p>
                          <p className="font-medium">
                            {selectedTransaction.property.title || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">
                            {selectedTransaction.property.location || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Booking Reference */}
                {selectedTransaction?.bookingReference ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Booking Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Booking ID</p>
                          <p className="font-medium">
                            {selectedTransaction.bookingReference._id || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Booking Status
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              selectedTransaction.bookingReference.status ===
                              "confirmed"
                                ? "bg-green-100 text-green-800"
                                : selectedTransaction.bookingReference
                                    .status === "pending"
                                ? "bg-primary-100 text-primary"
                                : selectedTransaction.bookingReference
                                    .status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {selectedTransaction.bookingReference.status ||
                              "N/A"}
                          </span>
                        </div>
                        {selectedTransaction.bookingReference.checkInDate && (
                          <div>
                            <p className="text-sm text-gray-600">
                              Check-in Date
                            </p>
                            <p className="font-medium">
                              {new Date(
                                selectedTransaction.bookingReference.checkInDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {selectedTransaction.bookingReference.checkOutDate && (
                          <div>
                            <p className="text-sm text-gray-600">
                              Check-out Date
                            </p>
                            <p className="font-medium">
                              {new Date(
                                selectedTransaction.bookingReference.checkOutDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">
                            Payment Method
                          </p>
                          <p className="font-medium">
                            {selectedTransaction.bookingReference
                              .paymentMethod || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Booking Payment Status
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              selectedTransaction.bookingReference
                                .paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : selectedTransaction.bookingReference
                                    .paymentStatus === "unpaid"
                                ? "bg-red-100 text-red-800"
                                : selectedTransaction.bookingReference
                                    .paymentStatus === "partial"
                                ? "bg-primary-100 text-primary"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {selectedTransaction.bookingReference
                              .paymentStatus || "N/A"}
                          </span>
                        </div>
                        {selectedTransaction.bookingReference.userId && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">
                                Guest Name
                              </p>
                              <p className="font-medium">
                                {selectedTransaction.bookingReference.userId
                                  .name || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Guest Email
                              </p>
                              <p className="font-medium">
                                {selectedTransaction.bookingReference.userId
                                  .email || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Guest Role
                              </p>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  selectedTransaction.bookingReference.userId
                                    .role === "guest"
                                    ? "bg-blue-100 text-blue-800"
                                    : selectedTransaction.bookingReference
                                        .userId.role === "host"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {selectedTransaction.bookingReference.userId
                                  .role || "N/A"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Account Status
                              </p>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  selectedTransaction.bookingReference.userId
                                    .accountStatus === "active"
                                    ? "bg-green-100 text-green-800"
                                    : selectedTransaction.bookingReference
                                        .userId.accountStatus === "inactive"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {selectedTransaction.bookingReference.userId
                                  .accountStatus || "N/A"}
                              </span>
                            </div>
                          </>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">
                            Booking Created
                          </p>
                          <p className="font-medium">
                            {selectedTransaction.bookingReference.createdAt
                              ? new Date(
                                  selectedTransaction.bookingReference.createdAt
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Booking Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-center py-4">
                        <div className="text-gray-400 text-2xl mb-2">📋</div>
                        <p className="text-gray-600">
                          No booking reference available
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          This transaction was created without a booking
                          reference
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsDetailsByProperty;
