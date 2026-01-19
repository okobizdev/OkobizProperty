import AuthServices from "../services/auth.services";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPasswordPage() {
  const { processResetPassword, processResendForgotOtp } = AuthServices;
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "admin"; // Default to 'admin' if not provided
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: processResetPassword,
    onSuccess: (data) => {
      if (data?.status === "success") {
        messageApi.success(data.message || "Password reset successful.");
        navigate("/login");
      } else {
        messageApi.error(data?.message || "Something went wrong.");
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        messageApi.error(error.message || "Invalid OTP or reset failed.");
      } else {
        messageApi.error("Unknown error occurred.");
      }
    },
  });

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await processResendForgotOtp({ email, role });
      if (res?.status === "success") {
        messageApi.success(res.message || "OTP resent successfully.");
      } else {
        messageApi.error(res.message || "Failed to resend OTP.");
      }
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
              className="!bg-primary-700 !rounded-md !h-10"
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
    </div>
  );
}
