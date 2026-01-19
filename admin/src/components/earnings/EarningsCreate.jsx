import React, { useState, useEffect } from "react";
import { createEarnings } from "../../apis/earnings.apis";
import BookingApis from "../../apis/booking.apis";
import "./earningsCreate.css";

const EarningsCreate = ({
  onClose,
  onSuccess,
  selectedPropertyId = null,
  propertyName,
  selectedProperty,
}) => {
  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const [formData, setFormData] = useState({
    property: selectedPropertyId || "",
    revenue: "",
    cost: "",
    profitMargin: "",
    transactionDate: new Date().toISOString().split("T")[0],
    bookingReference: "",
    paymentStatus: "PENDING",
    commissionType: "percentage", // "flat" or "percentage"
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  console.log("Selected Property:", selectedProperty); // Debug log

  // Fetch bookings when property changes
  const loadBookings = async (propertyId) => {
    if (!propertyId) {
      setBookings([]);
      return;
    }
    setBookingsLoading(true);
    try {
      const response = await BookingApis.fetchBookingsByPropertyId(propertyId);
      console.log("Booking API response:", response); // Debug log
      // Handle different response structures
      let bookingsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          bookingsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          bookingsData = response.data.data;
        } else if (
          response.data.bookings &&
          Array.isArray(response.data.bookings)
        ) {
          bookingsData = response.data.bookings;
        }
      }
      console.log("Processed bookings data:", bookingsData); // Debug log
      console.log("First booking structure:", bookingsData[0]); // Debug log
      setBookings(bookingsData);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings for this property");
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("Image file size must be less than 5MB");
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null); // Clear any previous errors
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Update form when selectedPropertyId changes
  useEffect(() => {
    if (selectedPropertyId) {
      setFormData((prev) => ({
        ...prev,
        property: selectedPropertyId,
      }));
      loadBookings(selectedPropertyId);
    }
  }, [selectedPropertyId]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = type === "number" ? parseFloat(value) || "" : value;

    // Ensure bookingReference is always a string
    if (name === "bookingReference") {
      processedValue = String(processedValue);
    }

    console.log(
      `Input change - ${name}:`,
      processedValue,
      typeof processedValue
    ); // Debug log

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: processedValue,
      };

      // Auto-calculate cost when revenue or commission (profitMargin) changes
      if (
        name === "revenue" ||
        name === "profitMargin" ||
        name === "commissionType"
      ) {
        const revenue = parseFloat(newData.revenue) || 0;
        const commissionValue = parseFloat(newData.profitMargin) || 0;

        let cost = 0;
        if (revenue > 0 && commissionValue > 0) {
          if (newData.commissionType === "flat") {
            cost = revenue - commissionValue;
          } else if (newData.commissionType === "percentage") {
            cost = revenue - (revenue * commissionValue) / 100;
          }
        }

        newData.cost = cost > 0 ? cost.toFixed(2) : "";
      }
      // Auto-calculate profit margin when cost changes manually (if not auto-calculated)
      else if (name === "cost") {
        const revenue = parseFloat(newData.revenue) || 0;
        const cost = parseFloat(newData.cost) || 0;
        const profit = revenue - cost;
        // For display purposes, we'll show the actual profit margin
        newData.profitMargin =
          revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : "0";
      }

      return newData;
    });

    // Load bookings when property changes
    if (name === "property") {
      loadBookings(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.property ||
        !formData.revenue ||
        !formData.bookingReference
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate commission if provided
      if (formData.profitMargin && parseFloat(formData.profitMargin) > 0) {
        const commissionValue = parseFloat(formData.profitMargin);
        const revenue = parseFloat(formData.revenue);

        if (formData.commissionType === "percentage" && commissionValue > 100) {
          throw new Error("Commission percentage cannot exceed 100%");
        }

        if (formData.commissionType === "flat" && commissionValue >= revenue) {
          throw new Error(
            "Commission amount cannot be greater than or equal to revenue"
          );
        }
      }

      // Calculate profit
      const profit =
        parseFloat(formData.revenue) - parseFloat(formData.cost || 0);

      // Prepare submission data
      const submissionData = {
        ...formData,
        revenue: parseFloat(formData.revenue),
        cost: parseFloat(formData.cost || 0),
        profitMargin: parseFloat(formData.profitMargin),
        profit,
        transactionDate: new Date(formData.transactionDate).toISOString(),
        bookingReference:
          typeof formData.bookingReference === "object" &&
          formData.bookingReference !== null
            ? formData.bookingReference.bookingReference ||
              formData.bookingReference.reference ||
              formData.bookingReference._id ||
              ""
            : formData.bookingReference || "",
        commissionType: formData.commissionType, // Include commissionType
      };

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.keys(submissionData).forEach((key) => {
        if (
          submissionData[key] !== null &&
          submissionData[key] !== undefined &&
          submissionData[key] !== ""
        ) {
          formDataToSend.append(key, submissionData[key].toString());
        }
      });

      // Add image if selected
      if (image) {
        formDataToSend.append("image", image);
      }

      await createEarnings(formDataToSend);

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setFormData({
        property: selectedPropertyId || "",
        revenue: "",
        cost: "",
        profitMargin: "",
        transactionDate: new Date().toISOString().split("T")[0],
        bookingReference: "",
        paymentStatus: "PENDING",
        commissionType: "percentage",
      });
      setImage(null);
      setImagePreview(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setBookings([]);

      // Show success message
      alert("Earnings record created successfully!");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = () => {
    const revenue = parseFloat(formData.revenue) || 0;
    const cost = parseFloat(formData.cost) || 0;
    return formatCurrency(revenue - cost);
  };

  const calculateNetProfitMargin = () => {
    const revenue = parseFloat(formData.revenue) || 0;
    const profit = calculateProfit();
    return revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0;
  };

  return (
    <div className="earnings-create-overlay">
      <div className="earnings-create-modal">
        <div className="modal-header">
          <h2>Create New Earnings Record</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="earnings-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            {/* Property Selection */}
            <div className="form-group">
              <label htmlFor="property">Property *</label>
              <span className="property-name-display">{propertyName}</span>
              <img
                className="h-16 w-24 "
                src={`${import.meta.env.VITE_API_BASE_URL}${
                  selectedProperty?.images?.[0]
                }`}
                alt={propertyName}
              />
              <div></div>
              <div></div>
            </div>

            {/* Revenue */}
            <div className="form-group">
              <label htmlFor="revenue">Final Price *</label>
              <input
                type="number"
                id="revenue"
                name="revenue"
                value={formData.revenue}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Enter final price amount"
                required
              />
            </div>

            {/* Commission Type */}
            <div className="form-group">
              <label htmlFor="commissionType">Commission Type</label>
              <select
                id="commissionType"
                name="commissionType"
                value={formData.commissionType}
                onChange={handleInputChange}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (৳)</option>
              </select>
            </div>

            {/* Commission Amount (using profitMargin field) */}
            <div className="form-group">
              <label htmlFor="profitMargin">
                Commission{" "}
                {formData.commissionType === "percentage" ? "(%)" : "(৳)"}
              </label>
              <input
                type="number"
                id="profitMargin"
                name="profitMargin"
                value={formData.profitMargin}
                onChange={handleInputChange}
                min="0"
                step={
                  formData.commissionType === "percentage" ? "0.01" : "0.01"
                }
                placeholder={`Enter commission ${
                  formData.commissionType === "percentage"
                    ? "percentage"
                    : "amount"
                }`}
              />
            </div>

            {/* Cost */}
            <div className="form-group">
              <label htmlFor="cost">Cost (Auto-calculated)</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Auto-calculated from commission"
                readOnly
              />
            </div>

            {/* Transaction Date */}
            <div className="form-group">
              <label htmlFor="transactionDate">Transaction Date *</label>
              <input
                type="date"
                id="transactionDate"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Payment Status */}
            <div className="form-group">
              <label htmlFor="paymentStatus">Payment Status</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="PARTIAL">Partial</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            {/* Booking Reference */}
            <div className="form-group">
              <label htmlFor="bookingReference">Booking Reference *</label>
              <select
                id="bookingReference"
                name="bookingReference"
                value={formData.bookingReference}
                onChange={handleInputChange}
                required
                disabled={bookingsLoading}
              >
                <option value="">
                  {bookingsLoading
                    ? "Loading bookings..."
                    : "Select a booking reference"}
                </option>
                {Array.isArray(bookings) &&
                  bookings.length === 0 &&
                  !bookingsLoading && (
                    <option value="" disabled>
                      No bookings found for this property
                    </option>
                  )}
                {bookings &&
                  bookings
                    .filter(
                      (booking) =>
                        booking.status &&
                        booking.status.toLowerCase() === "confirmed"
                    )
                    .map((booking) => {
                      return (
                        <option key={booking._id} value={booking._id}>
                          {booking.bookingReference ||
                            booking.reference ||
                            ` ${booking?.userId?.name}`}{" "}
                        </option>
                      );
                    })}
              </select>
            </div>

            {/* Image Upload */}
            <div className="form-group full-width">
              <label htmlFor="image">Receipt/Invoice Image (Optional)</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="image-input"
                />
                <label htmlFor="image" className="image-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Choose Image</span>
                </label>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="remove-image-btn"
                      title="Remove image"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
              <small className="form-help">
                Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
              </small>
            </div>
          </div>

          {/* Profit Calculation Display */}
          {(formData.revenue || formData.cost) && (
            <div className="profit-calculation">
              <h3>Profit Calculation</h3>
              <div className="calculation-grid">
                <div className="calc-item">
                  <span>Revenue:</span>
                  <span>
                    ${parseFloat(formData.revenue || 0).toLocaleString()}
                  </span>
                </div>
                {formData.profitMargin &&
                  parseFloat(formData.profitMargin) > 0 && (
                    <>
                      <div className="calc-item">
                        <span>
                          Commission (
                          {formData.commissionType === "percentage" ? "%" : "$"}
                          ):
                        </span>
                        <span>
                          {formData.commissionType === "percentage"
                            ? `${formData.profitMargin}%`
                            : `$${parseFloat(
                                formData.profitMargin
                              ).toLocaleString()}`}
                        </span>
                      </div>
                      <div className="calc-item">
                        <span>Commission Amount:</span>
                        <span>
                          $
                          {formData.commissionType === "percentage"
                            ? (
                                (parseFloat(formData.revenue || 0) *
                                  parseFloat(formData.profitMargin)) /
                                100
                              ).toLocaleString()
                            : parseFloat(
                                formData.profitMargin
                              ).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                <div className="calc-item">
                  <span>Cost:</span>
                  <span>
                    ${parseFloat(formData.cost || 0).toLocaleString()}
                  </span>
                </div>
                <div className="calc-item">
                  <span>Actual Profit Margin:</span>
                  <span>
                    {parseFloat(formData.profitMargin || 0).toFixed(2)}%
                  </span>
                </div>
                <div className="calc-item profit">
                  <span>Profit:</span>
                  <span
                    className={calculateProfit() >= 0 ? "positive" : "negative"}
                  >
                    ${calculateProfit().toLocaleString()}
                  </span>
                </div>
                <div className="calc-item">
                  <span>Net Profit Margin:</span>
                  <span
                    className={
                      calculateNetProfitMargin() >= 15
                        ? "good"
                        : calculateNetProfitMargin() >= 5
                        ? "ok"
                        : "poor"
                    }
                  >
                    {calculateNetProfitMargin()}%
                  </span>
                </div>
              </div>

              {/* Business Insights */}
              <div className="business-insights">
                {calculateProfit() < 0 && (
                  <div className="insight danger">
                    🚨 This transaction will result in a loss!
                    {formData.profitMargin &&
                      parseFloat(formData.profitMargin) > 0 && (
                        <span>
                          {" "}
                          Consider reducing commission or increasing revenue.
                        </span>
                      )}
                  </div>
                )}
                {parseFloat(formData.profitMargin || 0) < 10 &&
                  calculateProfit() >= 0 && (
                    <div className="insight warning">
                      ⚠️ Low profit margin ({formData.profitMargin}%)!
                      {formData.profitMargin &&
                      parseFloat(formData.profitMargin) > 0
                        ? " Consider adjusting commission or increasing revenue."
                        : " Consider reviewing pricing or costs."}
                    </div>
                  )}
                {parseFloat(formData.profitMargin || 0) >= 25 && (
                  <div className="insight success">
                    ✅ Excellent profit margin ({formData.profitMargin}%)! This
                    is a highly profitable transaction.
                  </div>
                )}
                {formData.profitMargin &&
                  parseFloat(formData.profitMargin) > 0 && (
                    <div className="insight info">
                      💼 Commission:{" "}
                      {formData.commissionType === "percentage"
                        ? `${formData.profitMargin}% of revenue`
                        : `$${parseFloat(
                            formData.profitMargin
                          ).toLocaleString()} flat fee`}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Earnings Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EarningsCreate;
