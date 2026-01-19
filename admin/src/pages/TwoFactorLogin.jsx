import React, { useState } from "react";
import AuthServices from "../services/auth.services";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";

const TwoFactorLogin = () => {
  const [otpInput, setOtpInput] = useState("");
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const role = searchParams.get("role");

  // Mutation for OTP verification
  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationFn: (otp) =>
      AuthServices.processTwoFactorOtp({
        email,
        role,
        otp,
      }),
    onSuccess: () => {
      message.success("OTP verified successfully");
      // Force a full page redirect to root
      window.location.href = "/";
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Failed to verify OTP");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      message.warning("Please enter OTP");
      return;
    }
    verifyOtp(otpInput);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Two Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please check your email for the OTP
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "
              placeholder="Enter your OTP"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isVerifying}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                isVerifying ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isVerifying ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorLogin;
