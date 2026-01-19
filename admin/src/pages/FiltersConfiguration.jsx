import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import axiosClient from "../configs/axios.config";

const FiltersConfiguration = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [filterConfig, setFilterConfig] = useState(null);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Predefined field definitions
  const predefinedFields = [
    // {
    //   name: "numberOfRooms",
    //   label: "Number of Rooms",
    //   type: "select",
    //   options: ["1", "2", "3", "4", "5"],
    //   isRequired: false,
    //   displayOrder: 1,
    //   supportedUnits: [],
    // },
    {
      name: "numberOfBedrooms",
      label: "Number of Bedrooms",
      type: "select",
      options: ["1", "2", "3", "4", "5"],
      isRequired: false,
      displayOrder: 2,
      supportedUnits: [],
    },
    {
      name: "numberOfWashrooms",
      label: "Number of Washroom",
      type: "select",
      options: ["1", "2", "3", "4", "5"],
      isRequired: false,
      displayOrder: 3,
      supportedUnits: [],
    },
    {
      name: "numberOfGuests",
      label: "Number of Guests (Max)",
      type: "select",
      options: ["1", "2", "3", "4", "5"],
      isRequired: false,
      displayOrder: 3,
      supportedUnits: [],
    },
    {
      name: "numberOfBalconies",
      label: "Number of Balconies",
      type: "select",
      options: ["0", "1", "2", "3", "4", "5"],
      isRequired: false,
      displayOrder: 4,
      supportedUnits: [],
    },
    {
      name: "checkinDate",
      label: "Check-in Date",
      type: "date",
      options: [],
      isRequired: false,
      displayOrder: 8,
      placeholder: "Select check-in date",
      supportedUnits: [],
    },
    {
      name: "checkoutDate",
      label: "Check-out Date",
      type: "date",
      options: [],
      isRequired: false,
      displayOrder: 9,
      placeholder: "Select check-out date",
      supportedUnits: [],
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      options: [],
      isRequired: false,
      displayOrder: 5,
      placeholder: "Enter location",
      supportedUnits: [],
    },
    {
      name: "price",
      label: "Price",
      type: "range",
      options: [],
      isRequired: false,
      displayOrder: 6,
      supportedUnits: [],
      validation: { min: 0, max: 10000000 },
    },
    {
      name: "size",
      label: "Size",
      type: "measurement",
      options: [],
      isRequired: false,
      displayOrder: 7,
      supportedUnits: ["sqft", "sqm"],
      defaultUnit: "sqft",
    },
    {
      name: "airConditioning",
      label: "Air Conditioning",
      type: "boolean",
      options: [],
      isRequired: false,
    },
    {
      name: "bedType",
      label: "Bed Type",
      type: "select",
      options: ["Single", "Double", "Queen", "King", "Sofa Bed"],
      isRequired: false,
      displayOrder: 10,
      supportedUnits: [],
    },
    {
      name: "smokingAllowed",
      label: "Smoking Allowed",
      type: "boolean",
      options: [],
      isRequired: false,
      displayOrder: 11,
      supportedUnits: [],
    },
  ];

  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "",
    options: [],
    isRequired: false,
    displayOrder: 0,
    validation: {},
    placeholder: "",
    helpText: "",
    supportedUnits: [],
    defaultUnit: "",
  });

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    fetchCategoriesAndSubcategories();
  }, []);

  // Fetch filter config when subcategory changes
  useEffect(() => {
    if (selectedSubcategory) {
      fetchFilterConfig(selectedSubcategory);
    } else {
      setFilterConfig(null);
      setFields([]);
    }
  }, [selectedSubcategory]);

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/subcategories`);
      const data = response.data || [];

      // Extract unique categories from subcategories
      const uniqueCategories = [
        ...new Map(
          data.map((item) => [item.category._id, item.category])
        ).values(),
      ];

      setCategories(uniqueCategories); // Set categories
      setSubcategories(data); // Set subcategories
    } catch (error) {
      console.error("Error fetching categories and subcategories:", error);
    }
  };

  const filteredSubcategories = subcategories.filter(
    (subcat) => subcat.category._id === selectedCategory
  );

  const fetchFilterConfig = async (subcategoryId) => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get(
        `${BASE_URL}/property-filters/subcategory/${subcategoryId}`
      );
      if (response.data) {
        setFilterConfig(response.data);
        setFields(response.data.fields || []);
      } else {
        setFilterConfig(null);
        setFields([]);
      }
    } catch (error) {
      console.error("Error fetching filter config:", error);
      setFilterConfig(null);
      setFields([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = () => {
    const fieldToAdd = {
      ...newField,
      displayOrder: fields.length,
    };
    setFields([...fields, fieldToAdd]);
    setNewField({
      name: "",
      label: "",
      type: "text",
      options: [],
      isRequired: false,
      displayOrder: 0,
      validation: {},
      placeholder: "",
      helpText: "",
      supportedUnits: [],
      defaultUnit: "",
    });
    setShowAddField(false);
  };

  const handleEditField = (index) => {
    setEditingField(index);
    setNewField(fields[index]);
  };

  const handleUpdateField = () => {
    const updatedFields = [...fields];
    updatedFields[editingField] = newField;
    setFields(updatedFields);
    setEditingField(null);
    setNewField({
      name: "",
      label: "",
      type: "text",
      options: [],
      isRequired: false,
      displayOrder: 0,
      validation: {},
      placeholder: "",
      helpText: "",
      supportedUnits: [],
      defaultUnit: "",
    });
  };

  const handleDeleteField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSaveConfiguration = async () => {
    if (!selectedSubcategory) return;

    try {
      setIsLoading(true);
      const configData = {
        subcategory: selectedSubcategory,
        fields: fields,
        isActive: true,
      };

      let response;
      if (filterConfig && filterConfig._id) {
        // Update existing config
        response = await axiosClient.put(
          `${BASE_URL}/property-filters/${filterConfig._id}`,
          configData
        );
      } else {
        // Create new config
        response = await axiosClient.post(
          `${BASE_URL}/property-filters`,
          configData
        );
      }

      if (response.data) {
        setFilterConfig(response.data);
        setPopupMessage("Filter configuration saved successfully!");
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        setPopupMessage("Error saving filter configuration");
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (error) {
      console.error("Error saving filter config:", error);
      setPopupMessage("Error saving filter configuration");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  //   const addOption = () => {
  //     setNewField({
  //       ...newField,
  //       options: [...newField.options, ""],
  //     });
  //   };

  //   const updateOption = (index, value) => {
  //     const updatedOptions = [...newField.options];
  //     updatedOptions[index] = value;
  //     setNewField({
  //       ...newField,
  //       options: updatedOptions,
  //     });
  //   };

  //   const removeOption = (index) => {
  //     const updatedOptions = newField.options.filter((_, i) => i !== index);
  //     setNewField({
  //       ...newField,
  //       options: updatedOptions,
  //     });
  //   };

  return (
    <div className="p-6 w-full mx-auto">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <span>{popupMessage}</span>
          <button
            onClick={() => setShowSuccessPopup(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <span>{popupMessage}</span>
          <button
            onClick={() => setShowErrorPopup(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xl border border-gray-100">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Filter Configuration
          </h1>
          <p className="text-gray-600">
            Configure filtering options for property subcategories
          </p>
        </div>

        <div className="p-8">
          {/* Subcategory Selection */}
          <div className="p-6 w-full mx-auto">
            {/* Category Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory(""); // Reset subcategory when category changes
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="">Choose a category...</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection */}
            {selectedCategory && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Subcategory
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                >
                  <option value="">Choose a subcategory...</option>
                  {filteredSubcategories.map((subcat) => (
                    <option key={subcat._id} value={subcat._id}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedSubcategory && (
            <>
              {/* Fields List */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Filter Fields
                  </h2>
                  <button
                    onClick={() => setShowAddField(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
                  >
                    <Plus size={18} />
                    Add Field
                  </button>
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-lg">No filter fields configured</p>
                    <p className="text-sm">Add some fields to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {field.label}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Name:</span>{" "}
                              {field.name} |
                              <span className="font-medium"> Type:</span>{" "}
                              {field.type}
                              {field.isRequired && (
                                <span className="text-red-500 ml-2 font-semibold">
                                  Required
                                </span>
                              )}
                            </p>
                            {field.helpText && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                {field.helpText}
                              </p>
                            )}
                            {field.options && field.options.length > 0 && (
                              <div className="mt-3">
                                <span className="text-xs text-gray-500 font-medium">
                                  Options:{" "}
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {field.options.map((option, optIndex) => (
                                    <span
                                      key={optIndex}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                    >
                                      {option}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {field.supportedUnits &&
                              field.supportedUnits.length > 0 && (
                                <div className="mt-3">
                                  <span className="text-xs text-gray-500 font-medium">
                                    Supported Units:{" "}
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {field.supportedUnits.map(
                                      (unit, unitIndex) => (
                                        <span
                                          key={unitIndex}
                                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                        >
                                          {unit}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditField(index)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit field"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteField(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete field"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveConfiguration}
                  disabled={isLoading}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 font-semibold transition-all duration-200 shadow-md"
                >
                  <Save size={18} />
                  {isLoading ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Field Modal */}
      {(showAddField || editingField !== null) && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-40 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-700">
                {editingField !== null ? "Edit Field" : "Add New Field"}
              </h2>
              <button
                onClick={() => {
                  setShowAddField(false);
                  setEditingField(null);
                  setNewField({
                    name: "",
                    label: "",
                    type: "text",
                    options: [],
                    isRequired: false,
                    displayOrder: 0,
                    validation: {},
                    placeholder: "",
                    helpText: "",
                    supportedUnits: [],
                    defaultUnit: "",
                  });
                }}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Field Name (dropdown) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field Name (internal)
                </label>
                <select
                  value={newField.name}
                  onChange={(e) => {
                    const selected = predefinedFields.find(
                      (f) => f.name === e.target.value
                    );
                    if (selected) {
                      setNewField({
                        ...selected,
                        helpText: "",
                      });
                    } else {
                      setNewField({
                        name: "",
                        label: "",
                        type: "",
                        options: [],
                        isRequired: false,
                        displayOrder: 0,
                        validation: {},
                        placeholder: "",
                        helpText: "",
                        supportedUnits: [],
                        defaultUnit: "",
                      });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                >
                  <option value="">Select field...</option>
                  {predefinedFields.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label} ({f.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Label (readonly) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field Label (display)
                </label>
                <input
                  type="text"
                  value={newField.label}
                  onChange={(e) =>
                    setNewField({ ...newField, label: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Field label"
                />
              </div>

              {/* Field Type (readonly) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field Type
                </label>
                <input
                  type="text"
                  value={newField.type}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                  placeholder="Field type"
                />
              </div>

              {/* Placeholder */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Placeholder text for the field"
                />
              </div>

              {/* Help Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Help Text
                </label>
                <textarea
                  value={newField.helpText}
                  onChange={(e) =>
                    setNewField({ ...newField, helpText: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Additional help text for users"
                />
              </div>

              {/* Options (editable for select/multiselect) */}
              {(newField.type === "select" ||
                newField.type === "multiselect") && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Options
                  </label>
                  {newField.options.map((option, index) => (
                    <div key={index} className="flex gap-3 mb-3 items-center">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updatedOptions = [...newField.options];
                          updatedOptions[index] = e.target.value;
                          setNewField({ ...newField, options: updatedOptions });
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Option value"
                      />
                      <button
                        onClick={() => {
                          const updatedOptions = newField.options.filter(
                            (_, i) => i !== index
                          );
                          setNewField({ ...newField, options: updatedOptions });
                        }}
                        className="px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                        title="Remove option"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        setNewField({
                          ...newField,
                          options: [...newField.options, ""],
                        })
                      }
                      className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      + Add Option
                    </button>
                    <button
                      onClick={() => setNewField({ ...newField, options: [] })}
                      className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* Required checkbox */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={newField.isRequired}
                  onChange={(e) =>
                    setNewField({ ...newField, isRequired: e.target.checked })
                  }
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <label
                  htmlFor="isRequired"
                  className="text-sm font-semibold text-gray-700"
                >
                  Required field
                </label>
              </div>

              {/* Display Order (readonly) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={newField.displayOrder}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                  min="0"
                />
              </div>
              {/* Supported Units (for measurement type) */}

              {/* Supported Units (for measurement type) */}
              {newField.type === "measurement" && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Supported Units
                  </label>

                  {newField.supportedUnits.map((unit, index) => (
                    <div key={index} className="flex gap-3 mb-3 items-center">
                      <input
                        type="text"
                        value={unit}
                        onChange={(e) => {
                          const updatedUnits = [...newField.supportedUnits];
                          updatedUnits[index] = e.target.value;
                          setNewField({
                            ...newField,
                            supportedUnits: updatedUnits,
                          });
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                        placeholder="Unit (e.g., sqft, sqm, acre)"
                      />
                      <button
                        onClick={() => {
                          const updatedUnits = newField.supportedUnits.filter(
                            (_, i) => i !== index
                          );
                          setNewField({
                            ...newField,
                            supportedUnits: updatedUnits,
                          });
                        }}
                        className="px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                        title="Remove unit"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        setNewField({
                          ...newField,
                          supportedUnits: [...newField.supportedUnits, ""],
                        })
                      }
                      className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      + Add Unit
                    </button>
                    <button
                      onClick={() =>
                        setNewField({ ...newField, supportedUnits: [] })
                      }
                      className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {newField.supportedUnits.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Default Unit
                      </label>
                      <select
                        value={newField.defaultUnit || ""}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            defaultUnit: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                      >
                        <option value="">Choose default unit...</option>
                        {newField.supportedUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddField(false);
                  setEditingField(null);
                  setNewField({
                    name: "",
                    label: "",
                    type: "text",
                    options: [],
                    isRequired: false,
                    displayOrder: 0,
                    validation: {},
                    placeholder: "",
                    helpText: "",
                    supportedUnits: [],
                    defaultUnit: "",
                  });
                }}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingField !== null ? handleUpdateField : handleAddField
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-md"
              >
                {editingField !== null ? "Update" : "Add"} Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersConfiguration;
