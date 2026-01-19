import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { baseUrl } from "../constants/env";


const EmailVerificationWithOtp = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email");
  const role = searchParams.get("role") || "guest";
  const [form] = Form.useForm();
  const [cooldown, setCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (values) => {
    if (!email) {
      message.error("Missing email.");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch(`${baseUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed.");
      const accessToken = data.accessToken;
      if (!accessToken) {
        message.error("Access token is missing.");
        setIsVerifying(false);
        return;
      }
      // Save token and redirect
      localStorage.setItem("accessToken", accessToken);
      message.success(data.message || "Email verified successfully!");
      form.resetFields();
      setTimeout(() => {
        if (role === "host") {
          window.location.href = "/host-dashboard";
        } else {
          window.location.href = "/";
        }
      }, 300);
    } catch (error) {
      message.error(error.message || "OTP verification failed.");
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch(`${baseUrl}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP.");
      message.success(data.message || "OTP resent to your email!");
      setCooldown(30);
    } catch (error) {
      message.error(error.message || "Failed to resend OTP.");
    }
    setIsResending(false);
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border border-[#D7D7D7] rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Verify your email</h2>
      <p className="text-sm mb-6 text-gray-600">
        Enter the 6-digit OTP sent to <strong>{email}</strong>
      </p>
      <Form form={form} onFinish={handleVerify} layout="vertical">
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
        <span className="text-sm text-gray-600">Didn't get the code?</span>
        <br />
        <Button
          type="link"
          disabled={cooldown > 0 || isResending}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationWithOtp;