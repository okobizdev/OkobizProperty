"use client";

import { AuthServices } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import hostImage from "../../../../public/images/home.png";
import guestImage from "../../../../public/images/guest.png";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState<"host" | "guest">("guest");

  const hostandGuest = [
    { name: "Host", imgSrc: hostImage.src },
    { name: "Guest", imgSrc: guestImage.src },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: AuthServices.processForgotPassword,
    onSuccess: async () => {
      messageApi.success("OTP sent to your email");
      const email = form.getFieldValue("email");
      await router.push(`/reset-password?email=${email}&role=${role}`);
    },
    onError: () => {
      messageApi.error("Failed to send OTP. Try again.");
    },
  });

  type ForgotPasswordInput = { email: string; role: "host" | "guest" };

  const handleFinish = (values: { email: string }) => {
    mutate({ ...values, role } as ForgotPasswordInput);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
        {contextHolder}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        {/* Role selection UI */}
        <div className="w-full flex justify-center items-center gap-4 mb-4">
          {hostandGuest.map((type, index) => {
            const isSelected = role === type?.name.toLowerCase();
            return (
              <div
                key={index}
                className={`
                  relative w-full cursor-pointer flex justify-center items-center py-4 px-2 
                  rounded ring-0 border border-gray-200 
                  ${isSelected ? " border-primary ring-0" : ""}
                `}
                onClick={() =>
                  setRole(type.name.toLowerCase() as "host" | "guest")
                }
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 border rounded border-gray-300 flex items-center justify-center bg-white">
                    <span className="text-red-500 text-xs font-bold leading-none">
                      ✔
                    </span>
                  </div>
                )}
                <Image
                  height={40}
                  width={40}
                  src={type?.imgSrc}
                  alt="image"
                  className="w-[40px]"
                />
                <h4 className="text-[13px] tracking-tight font-bold text-gray-600 ml-2">
                  {type?.name}
                </h4>
              </div>
            );
          })}
        </div>
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={<span className="text-sm text-gray-700">Email</span>}
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Enter a valid email." },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              maxLength={50}
              className="py-2 px-3 rounded-md "
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
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
