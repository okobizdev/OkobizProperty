import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { baseUrl } from "../constants/env";

const AboutUsForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [existingData, setExistingData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      description: "",
    },
  });


  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/about-us`);
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setExistingData(data);
        setIsEditing(true);

        // Populate form with existing data
        setValue("description", data.companyOverview?.description || "");
      }
    } catch (err) {
      console.error("Failed to fetch existing data:", err);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      // Company Overview - only description
      formData.append("companyOverview[description]", data.description);

      // Background Image
      if (data.backgroundImage?.[0]) {
        formData.append("backgroundImage", data.backgroundImage[0]);
      }

      const url = `${baseUrl}/about-us`;
      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`Data ${isEditing ? "updated" : "submitted"} successfully!`);

      // Refresh data after successful submission
      fetchExistingData();
    } catch (err) {
      console.error(err);
      setMessage("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="w-full mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Company Overview
          </h1>
          <p className="text-xl text-gray-600">
            Manage your company description and background image
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>

          {isEditing && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              <span className="mr-2">✓</span>
              Existing data loaded for editing
            </div>
          )}
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-8 p-4 rounded-xl text-center font-semibold ${message.includes("successfully")
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
            }`}>
            <div className="flex items-center justify-center">
              <span className="mr-2">
                {message.includes("successfully") ? "✓" : "✗"}
              </span>
              {message}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            <div className="space-y-8">
              {/* Company Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Company Description *
                </label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  placeholder="Tell us about your company's mission, vision, and what makes you unique..."
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Provide a detailed description of your company
                </p>
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Background Image
                </label>

                {existingData?.companyOverview?.backgroundImage && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`${baseUrl}/${existingData.companyOverview.backgroundImage}`}
                          alt="Current background"
                          className="w-24 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Current Background Image</p>
                          <p className="text-xs text-gray-600">Currently active</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Selected
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("backgroundImage")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {existingData?.companyOverview?.backgroundImage
                    ? "Upload a new image to replace the current one"
                    : "Recommended: 1920x1080px, Max size: 5MB"
                  }
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{isEditing ? "Updating..." : "Submitting..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>💾</span>
                      <span>{isEditing ? "Update Company Overview" : "Save Company Overview"}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutUsForm;