"use client";

import { useSearchParams } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import useAuth from "@/hooks/useAuth";
import { AuthServices } from "@/services/auth/auth.service";
import { DecodedJwtPayload, OtpPayload, OtpResponse } from "@/types/authTypes";

const { processVerifyEmailOtp, processResendOtp } = AuthServices;

const EmailVerification = () => {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const role = searchParams.get("role") || "guest";
  // const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [cooldown, setCooldown] = useState<number>(0);

  const { mutate: verifyOtp, isPending: isVerifying } = useMutation<
    OtpResponse,
    Error,
    OtpPayload
  >({
    mutationFn: processVerifyEmailOtp,
    onSuccess: (data) => {
      const accessToken = data?.accessToken;

      if (!accessToken) {
        messageApi.error("Access token is missing.");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedJwtPayload>(accessToken);
        const role = decoded?.role;

        console.log(role, "role");

        login({ accessToken });

        messageApi.success(data?.message || "Email verified successfully!");
        form.resetFields();

        setTimeout(() => {
          if (role === "host") {
            window.location.href = "/host-dashboard";
          } else {
            window.location.href = "/";  
          }
        }, 300);
      } catch (error) {
        console.error("Invalid token", error);
        messageApi.error("Invalid token.");
      }
    },
    onError: (error) => {
      messageApi.error(error?.message || "OTP verification failed.");
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation<
    OtpResponse,
    Error,
    void
  >({
    mutationFn: () => processResendOtp({ email: email as string }),
    onSuccess: (res) => {
      messageApi.success(res.message || "OTP resent to your email!");
      startCooldown(30);
    },
    onError: (error) => {
      messageApi.error(error?.message || "Failed to resend OTP.");
    },
  });

  const handleSubmit = (values: { otp: string }) => {
    if (!email) {
      return messageApi.error("Missing email.");
    }
    verifyOtp({ email, otp: values.otp, role });
  };

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border border-[#D7D7D7] rounded shadow-md">
      {contextHolder}
      <h2 className="text-xl font-semibold mb-4">Verify your email</h2>
      <p className="text-sm mb-6 text-gray-600">
        Enter the 6-digit OTP sent to <strong>{email}</strong>
      </p>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="otp"
          rules={[{ required: true, message: "Please enter the OTP" }]}
        >
          <Input placeholder="Enter OTP" maxLength={6} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-primary"
            block
            loading={isVerifying}
          >
            Verify
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">Didn&apos;t get the code?</span>
        <br />
        <Button
          type="link"
          disabled={cooldown > 0 || isResending}
          onClick={() => resendOtp()}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
