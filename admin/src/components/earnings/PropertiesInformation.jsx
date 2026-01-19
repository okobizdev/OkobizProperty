import React, { useState, useEffect } from "react";
import { fetchPropertiesWhichHasEarnings } from "../../apis/earnings.apis";
import EarningsDetailsByProperty from "./EarningsDetailsByProperty";

const PropertiesInformation = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetchPropertiesWhichHasEarnings();
        setProperties(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch properties with earnings.");
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const handleCardClick = (propertyData) => {
    setSelectedProperty(propertyData);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading properties...</span>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:text-blue-800 cursor-pointer mb-4 flex items-center"
        >
          <span className="mr-2 text-2xl">←</span> Back
        </button>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Properties with Earnings
        </h1>
        <p className="text-gray-600">
          Click on any property to view detailed earnings
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {properties.map((property) => (
            <button
              key={property._id}
              onClick={() => handleCardClick(property)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all duration-200 transform hover:scale-105 text-left w-full"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  src={`${BASE_URL}${property.coverImage}`}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.listingType === "SELL"
                        ? "bg-green-100 text-green-800"
                        : property.listingType === "RENT"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {property.listingType}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">💰</span>
                    <span>{formatCurrency(property.price)}</span>
                  </div>
                  {property.size && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📐</span>
                      <span>
                        {property.size} {property.sizeUnit}
                      </span>
                    </div>
                  )}
                  {property.numberOfRooms && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🏠</span>
                      <span>{property.numberOfRooms} rooms</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-sm text-blue-600 font-medium">
                    Click to view earnings &rarr;
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-gray-600">
            No properties have earnings transactions yet.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProperty.title}
                </h2>
                <p className="text-gray-600">{selectedProperty.location}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <EarningsDetailsByProperty propertyId={selectedProperty._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesInformation;
