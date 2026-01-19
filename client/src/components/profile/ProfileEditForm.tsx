"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState, ChangeEvent } from "react";
import { getUser } from "@/services/auth/auth.service";
import { jwtDecode } from "jwt-decode";
import {
  updateProfileWork,
  updateProfileLocation,
  updateProfileLanguage,
  updateProfileBio,
  updateProfileAvatar,
  getProfileWork,
  getProfileLocation,
  getProfileLanguage,
  getProfileBio,
  getProfileAvatar,
} from "@/services/profile";

import defaultProfileImage from "@/assets/images/defaultProfile.png";

const ALL_LANGUAGES = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Bangla",
  "Basque",
  "Belarusian",
  "Bosnian",
  "Bulgarian",
  "Burmese",
  "Catalan",
  "Cebuano",
  "Chinese",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Estonian",
  "Filipino",
  "Finnish",
  "French",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Hausa",
  "Hawaiian",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Korean",
  "Kurdish",
  "Kyrgyz",
  "Lao",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Nepali",
  "Norwegian",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Samoan",
  "Serbian",
  "Sesotho",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Telugu",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu",
];

interface DecodedToken {
  email: string;
  name: string;
  userId: string;
}

interface ProfileData {
  email: string;
  work: string;
  location: string;
  language: string;
  languages: string[];
  bio: string;
  image: string | StaticImageData;
}

const ProfileEditForm = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    email: "",
    work: "",
    location: "",
    language: "",
    languages: [],
    bio: "",
    image: defaultProfileImage,
  });
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [tempLanguages, setTempLanguages] = useState<string[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");

  const filteredLanguages = useMemo(() => {
    return ALL_LANGUAGES.filter((lang) =>
      lang.toLowerCase().includes(languageSearch.toLowerCase())
    );
  }, [languageSearch]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await getUser();
        if (!token) return;

        const decoded = jwtDecode<DecodedToken>(token);

        const [work, location, language, bio, avatar] = await Promise.all([
          getProfileWork(token),
          getProfileLocation(token),
          getProfileLanguage(token),
          getProfileBio(token),
          getProfileAvatar(token),
        ]);

        const languages = language?.data?.languages || [];
        setProfileData({
          email: decoded.email,
          work: work?.data?.worksAt || "",
          location: location?.data?.location || "",
          language: languages.join(", "),
          languages: languages,
          bio: bio?.data?.intro || "",
          image: avatar?.data?.avatar
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar.data.avatar}`
            : defaultProfileImage,
        });
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleFieldClick = (field: string) => {
    setEditingField(field);
    if (field === "language") {
      setTempLanguages(profileData.languages);
    } else {
      const value = profileData[field as keyof Omit<ProfileData, "languages">];
      setTempValue(typeof value === "string" ? value : "");
    }
  };

  const toggleLanguage = (lang: string) => {
    setTempLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      setIsUpdating(true);
      const token = await getUser();
      if (!token) return;

      let updateResponse;

      switch (editingField) {
        case "work":
          updateResponse = await updateProfileWork(token, {
            worksAt: tempValue,
          });
          break;
        case "location":
          updateResponse = await updateProfileLocation(token, {
            location: tempValue,
          });
          break;
        case "language":
          updateResponse = await updateProfileLanguage(token, {
            languages: tempLanguages,
          });
          break;
        case "bio":
          updateResponse = await updateProfileBio(token, { bio: tempValue });
          break;
        default:
          return;
      }

      if (updateResponse) {
        setProfileData((prev) => ({
          ...prev,
          [editingField]:
            editingField === "language" ? tempLanguages.join(", ") : tempValue,
          ...(editingField === "language" ? { languages: tempLanguages } : {}),
        }));
      }
    } catch (error) {
      console.error(`Failed to update ${editingField}:`, error);
      alert(`Failed to update ${editingField}. Please try again.`);
    } finally {
      setIsUpdating(false);
      setEditingField(null);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = async () => {
    if (!imageFile) {
      setShowImageModal(false);
      return;
    }

    try {
      setIsUpdating(true);
      const token = await getUser();
      if (!token) return;

      const formData = new FormData();
      formData.append("avatar", imageFile);

      const response = await updateProfileAvatar(token, formData);

      if (response?.data?.avatar) {
        setProfileData((prev) => ({
          ...prev,
          image: `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.data.avatar}`,
        }));
      }
    } catch (error) {
      console.error("Failed to update avatar:", error);
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setIsUpdating(false);
      setShowImageModal(false);
      setImagePreview("");
      setImageFile(null);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-800 container mx-auto py-20 max-w-6xl">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-800 container mx-auto py-20 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Profile Image */}
        <div className="w-full md:w-1/3">
          <div className="relative group">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={profileData.image}
                alt="Profile"
                width={160}
                height={160}
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-profile.jpg";
                }}
              />
            </div>
            <button
              onClick={() => setShowImageModal(true)}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Edit Picture
            </button>
          </div>
        </div>

        {/* Right Column - Profile Info */}
        <div className="w-full md:w-2/3">
          <div className="mb-4 text-3xl font-semibold">Edit Your Profile</div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            {["email", "work", "location", "language"].map((field) => (
              <div
                key={field}
                onClick={() => handleFieldClick(field)}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
              >
                <div className="text-sm text-gray-500 capitalize">{field}</div>
                <div className="font-medium mt-1">
                  {(() => {
                    const value = profileData[field as keyof ProfileData];
                    if (typeof value === "string") {
                      return value || `Add your ${field}`;
                    }
                    if (Array.isArray(value)) {
                      return value.join(", ") || `Add your ${field}`;
                    }
                    return `Add your ${field}`;
                  })()}
                </div>
              </div>
            ))}
          </div>

          {/* About You Section */}
          <div className="mb-2 font-medium">About You</div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <p>{profileData.bio || "No bio added yet"}</p>
          </div>
          <button
            onClick={() => handleFieldClick("bio")}
            className="text-primary hover:text-blue-800 cursor-pointer underline"
          >
            Edit Intro
          </button>
        </div>
      </div>

      {/* Done Button */}
      <div className="mt-8 flex justify-end">
        <Link href="/profile">
          <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
            Done
          </button>
        </Link>
      </div>

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-y-auto">
            <h3 className="text-lg font-medium mb-4 capitalize">
              Edit {editingField === "language" ? "Languages" : editingField}
            </h3>

            {/* Dynamic Field Rendering */}
            {editingField === "bio" ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                rows={5}
              />
            ) : editingField === "language" ? (
              <>
                {/* Search Bar */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search languages..."
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Scrollable Language List */}
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-2 mb-4">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => (
                      <div
                        key={lang}
                        className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleLanguage(lang)}
                      >
                        <input
                          type="checkbox"
                          id={`lang-${lang}`}
                          checked={tempLanguages.includes(lang)}
                          readOnly
                          className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`lang-${lang}`} className="select-none">
                          {lang}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No languages found matching {languageSearch}
                    </div>
                  )}
                </div>

                {/* Selected Languages Preview */}
                {tempLanguages.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Selected Languages:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempLanguages.map((lang) => (
                        <span
                          key={`selected-${lang}`}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                        >
                          {lang}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLanguage(lang);
                            }}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <input
                type={editingField === "email" ? "email" : "text"}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setEditingField(null);
                  setLanguageSearch("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Profile Picture</h3>
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
                <Image
                  src={imagePreview || profileData.image}
                  alt="Profile Preview"
                  width={128}
                  height={128}
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-profile.jpg";
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={saveImage}
                className="px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isUpdating || !imagePreview}
              >
                {isUpdating ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditForm;