"use client";

import { getUser } from "@/services/auth/auth.service";
import { identityVerification } from "@/services/verification";
import React, { useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const VerificationForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleFrontImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrontImage(e.target.files[0]);
    }
  };

  const handleBackImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackImage(e.target.files[0]);
    }
  };

  const handlePassportImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPassportImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    let documentTypeEnumValue = "";
    if (selectedOption === "NID") {
      documentTypeEnumValue = "nid";
    } else if (selectedOption === "Driving License") {
      documentTypeEnumValue = "drivingLicense";
    } else if (selectedOption === "Passport") {
      documentTypeEnumValue = "passport";
    }

    formData.append("documentType", documentTypeEnumValue);

    if (documentTypeEnumValue === "passport") {
      if (!passportImage) {
        toast.error("Please upload your passport image.");
        setIsSubmitting(false);
        return;
      }
      formData.append("documents", passportImage);
    } else {
      if (!frontImage || !backImage) {
        toast.error("Please upload both front and back images.");
        setIsSubmitting(false);
        return;
      }
      formData.append("documents", frontImage);
      formData.append("documents", backImage);
    }

    try {
      const token = await getUser();
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        setIsSubmitting(false);
        return;
      }
      await identityVerification(formData, token);
      toast.success("Verification submitted successfully!");
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while submitting verification.");
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setStep(1);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-20">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Identity Verification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          {step === 1 ? (
            <div className="space-y-3">
              {["NID", "Driving License", "Passport"].map((option) => (
                <div
                  key={option}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                >
                  <input
                    type="radio"
                    id={option}
                    name="verification"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    required
                  />
                  <label
                    htmlFor={option}
                    className="text-gray-700 cursor-pointer flex-1"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {selectedOption !== "Passport" ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Front Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFrontImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Back Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Passport Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePassportImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    required
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            {step === 2 && (
              <button
                type="button"
                onClick={goBack}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors hover:bg-gray-300 cursor-pointer"
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg transition-colors hover:bg-blue-700 cursor-pointer disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : step === 1
                ? "Continue"
                : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;
