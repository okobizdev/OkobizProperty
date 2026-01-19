"use client";

import LoginModal from "@/components/modals/LoginModal";
import { AuthServices } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const role = searchParams.get("role") || "guest";
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [resendLoading, setResendLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: AuthServices.processResetPassword,
    onSuccess: () => {
      messageApi.success("Password reset successful. You can now login.");
      setShowLoginModal(true);
    },
    onError: () => {
      messageApi.error("Invalid OTP or error resetting password.");
    },
  });

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await AuthServices.processResendForgotOtp({ email, role });
      messageApi.success("OTP resent successfully.");
    } catch {
      messageApi.error("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
        {contextHolder}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        <Form
          form={form}
          onFinish={(values) => mutate({ ...values, email })}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="otp"
            label={<span className="text-sm text-gray-700">OTP</span>}
            rules={[{ required: true, message: "Please enter the OTP." }]}
          >
            <Input placeholder="Enter OTP" className="py-2 px-3 rounded-md" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<span className="text-sm text-gray-700">New Password</span>}
            rules={[
              { required: true, message: "Please enter a new password." },
              { min: 8, message: "Password must be at least 8 characters." },
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              className="py-2 px-3 rounded-md"
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              className="!bg-primary !rounded-md !h-10"
            >
              Reset Password
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <Button
              type="link"
              onClick={handleResend}
              loading={resendLoading}
              className="!p-0"
            >
              Resend OTP
            </Button>
          </div>
        </Form>
      </div>

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
