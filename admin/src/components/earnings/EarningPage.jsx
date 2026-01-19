import { useState, useEffect, useCallback } from "react";
import {
  fetchAllEarnings,
  fetchEarningsSummary,
  fetchEarningsAnalytics,
  deleteEarnings,
} from "../../apis/earnings.apis";
import BookingApis from "../../apis/booking.apis";
import EarningsCreate from "./EarningsCreate";
import EarningsAnalytics from "./EarningsAnalytics";

// import Earnings_by_properties from "./Earnings_by_properties";
//react route
import { useNavigate } from "react-router-dom";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyName, setPropertyName] = useState("");
  const [bookingData, setBookingsData] = useState([]);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    paymentStatus: "",
    propertyId: "",
  });
  // Removed propertyFilters state
  const [activeTab, setActiveTab] = useState("analytics"); // "Add transaction", "analytics", "transactions", "records"`
  const navigate = useNavigate();

  const handleOnClickRecords = () => {
    setActiveTab("records");
    navigate("/earnings/records");
  };

  // Fetch all earnings
  const loadEarnings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllEarnings(filters.from, filters.to, {
        paymentStatus: filters.paymentStatus,
        propertyId: filters.propertyId,
      });
      setEarnings(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.from, filters.to, filters.paymentStatus, filters.propertyId]);

  // Fetch earnings summary
  const loadSummary = useCallback(async () => {
    try {
      const response = await fetchEarningsSummary(filters.from, filters.to);
      setSummary(response.data);
    } catch (err) {
      setError(err.message);
    }
  }, [filters.from, filters.to]);

  // Fetch analytics data
  const loadAnalytics = useCallback(async () => {
    try {
      const response = await fetchEarningsAnalytics(filters.from, filters.to);
      setAnalytics(response.data);
    } catch (err) {
      setError(err.message);
    }
  }, [filters.from, filters.to]);

  // Fetch properties data from bookings
  const loadProperties = useCallback(async (listingType = "") => {
    try {
      setLoading(true);

      const response = await BookingApis.getAllBookingApi(
        listingType,
        1,
        10000
      );

      if (!response.data?.data) {
        setError("Invalid data received from server");
        return;
      }

      // First filter confirmed bookings
      const confirmedBookings = response.data.data.filter(
        (booking) =>
          booking &&
          booking.propertyId &&
          booking.status &&
          booking.status.toLowerCase() === "confirmed" &&
          booking.propertyId.listingType &&
          (!listingType || booking.propertyId.listingType === listingType)
      );

      // Then group by propertyId and keep only one booking per property
      const uniquePropertyBookings = Object.values(
        confirmedBookings.reduce((acc, booking) => {
          const propertyId = booking.propertyId._id;

          // If this property isn't in accumulator yet, or this booking is newer
          if (
            !acc[propertyId] ||
            new Date(booking.createdAt) > new Date(acc[propertyId].createdAt)
          ) {
            acc[propertyId] = booking;
          }
          return acc;
        }, {})
      );
      setBookingsData(uniquePropertyBookings);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load properties");
      setBookingsData([]);
    } finally {
      setLoading(false);
    }
  }, []);
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle property filter changes
  const handlePropertyFilterChange = (e) => {
    const { value } = e.target;
    // Reset bookings data before loading new data
    setBookingsData([]);
    // Call API with the new filter value
    loadProperties(value);
  };

  // Delete earnings record
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this earnings record?")
    ) {
      try {
        await deleteEarnings(id);
        loadEarnings(); // Refresh earnings list
        loadSummary(); // Refresh summary
        loadAnalytics(); // Refresh analytics
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Handle create modal
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setSelectedPropertyId(null);
    loadEarnings();
    loadSummary();
    loadAnalytics();
  };

  const handleCreateFromProperty = (propertyId, propertyName, property) => {
    setSelectedPropertyId(propertyId);
    setPropertyName(propertyName);
    setSelectedProperty(property);
    setShowCreateModal(true);
  };

  useEffect(() => {
    loadEarnings();
    loadSummary();
    loadAnalytics();
    loadProperties();
  }, [loadEarnings, loadSummary, loadAnalytics, loadProperties]);

  // Initial load of properties
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  if (loading) {
    return (
      <div className="loading-spinner flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-600 text-xl font-medium">
          Loading earnings data...
        </div>
        <div className="text-gray-500 text-sm mt-2">
          Please wait while we fetch your information
        </div>
      </div>
    );
  }

  return (
    <div className="earnings-container bg-gray-50 min-h-screen">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center gap-4 mb-6">
          {/* Left side - Tabs */}
          <div className="tab-navigation bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              <button
                className={`tab-button px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === "analytics"
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
              <button
                className={`tab-button px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === "Add transaction"
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("Add transaction")}
              >
                Add transaction
              </button>
              <button
                className={`tab-button px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === "transactions"
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("transactions")}
              >
                Transactions
              </button>
              <button
                className={`tab-button px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === "records"
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => handleOnClickRecords()}
              >
                Records
              </button>
            </div>
          </div>

          {/* Middle - Earnings Filters */}
          {activeTab == "analytics" && (
            <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <div className="filter-group">
                <input
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="From Date"
                />
              </div>
              <div className="filter-group">
                <input
                  type="date"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="To Date"
                />
              </div>
            </div>
          )}
          {/* Right side - Filter Toggle */}
          {activeTab == "Add transaction" && (
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                name="listingType"
                defaultValue=""
                onChange={handlePropertyFilterChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-gray-50"
              >
                <option value="">All</option>
                <option value="RENT">Rent</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
          )}
        </div>

        {/* Summary and Metrics Section */}
        {summary &&
          activeTab !== "Add transaction" &&
          activeTab !== "transactions" && (
            <div className="summary-metrics-section flex flex-col gap-8 mb-8">
              {/* Summary */}
              <div className="section bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="section-header mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    Summary
                  </h2>
                </div>
                <div className="summary-content grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="summary-item p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(summary.totalRevenue)}
                    </p>
                  </div>
                  <div className="summary-item p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Total Cost
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(summary.totalCost)}
                    </p>
                  </div>
                  <div className="summary-item p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Total Profit
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        summary.totalProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(summary.totalProfit)}
                    </p>
                  </div>
                  <div className="summary-item p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Avg Profit Margin
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {summary.averageProfitMargin
                        ? `${summary.averageProfitMargin.toFixed(2)}%`
                        : "0%"}
                    </p>
                  </div>
                  <div className="summary-item p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Transactions
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {summary.count}
                    </p>
                  </div>
                  <div className="summary-item p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Avg Transaction
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {summary.count > 0
                        ? formatCurrency(summary.totalRevenue / summary.count)
                        : "$0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        {error && (
          <div className="error-message bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-lg mb-8 flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Add transaction Tab */}
        {activeTab === "Add transaction" && (
          <div className="Add transaction-content bg-white shadow-sm border border-gray-200 p-6">
            <div className="section">
              <div className="section-header mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Booked Properties
                </h2>
                <p className="section-subtitle text-gray-600 text-sm">
                  Create earnings for your booked properties
                </p>
              </div>
              {bookingData.length > 0 ? (
                <div className="properties-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {bookingData.map((booking) => (
                    <div
                      key={booking?.propertyId?._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                    >
                      <div className="h-32 mb-3 overflow-hidden rounded-lg">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${
                            booking?.propertyId?.images[0]
                          }`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
                        {booking?.propertyId?.title}
                      </h4>
                      <div className="property-stats space-y-1 mb-3 text-xs">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-blue-500">📍</span>
                          <p className="text-gray-600 truncate">
                            {booking?.propertyId?.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-green-500">💵</span>
                          <p className="text-gray-600">
                            {booking.totalAmount}{" "}
                            {booking.propertyId?.priceUnit}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-purple-500">🏢</span>
                          <p className="text-gray-600 truncate">
                            {booking?.propertyId.category?.name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-orange-500">📊</span>
                          <p className="text-gray-600">
                            {booking?.propertyId?.listingType}
                          </p>
                        </div>
                      </div>
                      <button
                        className="w-full bg-orange-400 hover:bg-primary text-white font-medium py-2 px-4 text-sm rounded transition-colors"
                        onClick={() =>
                          handleCreateFromProperty(
                            booking.propertyId?._id,
                            booking?.propertyId?.title,
                            booking?.propertyId
                          )
                        }
                        title={`Create earnings for ${booking?.propertyId?.title}`}
                      >
                        + Add Earnings
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-properties text-center py-12">
                  <div className="text-4xl mb-3">🏠</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    No booked properties found
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Make sure you have properties with active bookings.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="analytics-content bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <EarningsAnalytics
              analytics={analytics}
              formatCurrency={formatCurrency}
            />
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="transactions-content bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="section-header mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Transaction Details
              </h2>
              <p className="section-subtitle text-gray-600 text-lg">
                Detailed view of all earnings transactions
              </p>
            </div>
            <div className="table-container overflow-x-auto bg-gray-50 rounded-lg p-4">
              <table className="earnings-table w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Booking Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Final Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Margin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {earnings.map((earning) => {
                    const profitMargin =
                      earning.revenue > 0
                        ? ((earning.profit / earning.revenue) * 100).toFixed(1)
                        : 0;

                    return (
                      <tr
                        key={earning._id}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          earning.profit < 0 ? "bg-red-50 hover:bg-red-100" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {earning.property?.title || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof earning.bookingReference === "object" &&
                          earning.bookingReference !== null
                            ? earning.bookingReference.bookingReference ||
                              earning.bookingReference.reference ||
                              earning.bookingReference._id ||
                              "N/A"
                            : earning.bookingReference || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {formatCurrency(earning.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                          {formatCurrency(earning.cost)}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                            earning.profit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(earning.profit)}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                            profitMargin >= 20
                              ? "text-green-600"
                              : profitMargin >= 10
                              ? "text-primary"
                              : "text-red-600"
                          }`}
                        >
                          {profitMargin}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              earning.paymentStatus === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : earning.paymentStatus === "PENDING"
                                ? "bg-primary-100 text-primary"
                                : earning.paymentStatus === "PARTIAL"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {earning.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(
                            earning.transactionDate
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(earning._id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg transition-colors duration-200 hover:bg-red-50"
                            title="Delete transaction"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showCreateModal && (
          <EarningsCreate
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
            selectedPropertyId={selectedPropertyId}
            propertyName={propertyName}
            selectedProperty={selectedProperty}
          />
        )}
      </div>
    </div>
  );
};

export default Earnings;
