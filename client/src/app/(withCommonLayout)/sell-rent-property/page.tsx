"use client";

import { Input, Button, Form, message } from "antd";
import { useState } from "react";
import { AuthServices } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignupFormValues, SignupResponse } from "@/types/authTypes";
import Image from "next/image";
import Link from "next/link";
import hostImage from "../../../../public/images/home.png";

const { processSignup } = AuthServices;

const SellRentPropertyPage = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [agreed, setAgreed] = useState(false);

  // Fixed role as "host"
  // const role = "host";

  const { mutate, isPending } = useMutation<
    SignupResponse,
    Error,
    SignupFormValues
  >({
    mutationFn: processSignup,
    onSuccess: async (data) => {
      messageApi.success("Signup successfully!");
      await router.push(
        `/email-verification?email=${data?.data?.email}&role=host`
      );
      form.resetFields();
    },
    onError: () => {
      messageApi.error("Email already exists");
    },
  });

  const handleSubmit = (
    values: Omit<SignupFormValues, "role"> & { phone: string }
  ) => {
    mutate({
      ...values,
      role: "host",
    });
  };

  return (
    <>
      {contextHolder}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <span className="text-5xl animate-bounce">🏠</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sell or Rent Your Property
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of property owners earning passive income with Okobiz
            Property. List your property and start connecting with clients
            today.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Page Title */}
          <div className="pb-4 border-b border-gray-200 text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome to Okobiz Property
            </h2>
          </div>

          {/* Host Info Card */}
          <div className="w-full flex justify-center items-center gap-4 mb-6">
            <div className="relative w-full cursor-pointer flex justify-center items-center py-4 px-2 rounded border-2 border-primary bg-primary/5 transition-all duration-200">
              <div className="absolute top-2 right-2 w-5 h-5 border-2 border-primary rounded flex items-center justify-center bg-primary">
                <span className="text-white text-xs font-bold leading-none">
                  ✔
                </span>
              </div>
              <div className="flex flex-col gap-2 justify-center items-center">
                <Image
                  height={200}
                  width={200}
                  src={hostImage.src}
                  alt="Property Owner"
                  className="w-[70px] h-[70px] object-contain"
                />
                <h4 className="text-[14px] tracking-tight font-bold text-gray-600">
                  Resgister as Property Owner
                </h4>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Full Name" size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input placeholder="Phone Number" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="Email" size="large" type="email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match."));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" size="large" />
            </Form.Item>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs text-gray-500 leading-snug select-none"
              >
                By selecting <span className="font-medium">Continue</span>, I
                agree to OkobizProperty&apos;s
                <a
                  href="/terms-condition"
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
                and acknowledge the
                <a
                  href="/privacy-policy"
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Sign Up Button */}
            <Form.Item>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                className={`!bg-primary mt-4 !h-11 font-semibold rounded-md ${
                  !agreed ? "cursor-not-allowed opacity-60" : ""
                }`}
                loading={isPending}
                disabled={isPending || !agreed}
              >
                Continue as Property Owner
              </Button>
            </Form.Item>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Button
            block
            size="large"
            type="default"
            className="!h-11 font-bold rounded-md border-primary  text-primary hover:text-primary hover:border-primary"
            onClick={() => router.push("/login")}
          >
            Log In
          </Button>

          {/* Back to Home Link */}
          <div className="text-center mt-4">
            <Link href="/" className="text-primary hover:underline text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-800 mb-2">Earn Income</h3>
            <p className="text-gray-600 text-sm">
              Earn passive income by listing your property and connecting with
              verified clients.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-2">Safe & Secure</h3>
            <p className="text-gray-600 text-sm">
              All transactions are protected and verified through our secure
              platform.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Simple and intuitive interface to manage your properties and
              bookings.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellRentPropertyPage;
