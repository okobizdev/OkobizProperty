"use client";

import { Input, Modal, Button, message, Form } from "antd";
import { useState } from "react";
import SignupModal from "./SignUpModal";
import { AuthServices } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { DecodedJwtPayload, LoginResponse } from "@/types/authTypes";
import hostImage from "../../../public/images/home.png";
import guestImage from "../../../public/images/guest.png";
import Image from "next/image";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  isHost?: boolean;
}

const initialForm = {
  email: "",
  password: "",
};

const LoginModal = ({ open, onClose, isHost }: LoginModalProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();
  const [role, setRole] = useState<"host" | "guest">(isHost ? "host" : "guest");
  const [form] = Form.useForm();

  useState(() => {
    if (isHost) {
      setRole("host");
    }
  }); // Ensure role is set to host if isHost is true

  const hostandGuest = [
    { name: "host", display: "Property Owner", imgSrc: hostImage.src },
    { name: "guest", display: "Client", imgSrc: guestImage.src },
  ];

  const { mutate: loginUser, isPending } = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string; role: string }
  >({
    mutationFn: AuthServices.processLogin,
    onSuccess: (data) => {
      const accessToken = data?.accessToken;

      if (!accessToken) {
        messageApi.error("Authentication failed. Please try again.");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedJwtPayload>(accessToken);
        const userRole = decoded.role;

        login({ accessToken });

        messageApi.success({
          content: "Login successful! Redirecting...",
          duration: 3,
        });

        form.resetFields();
        onClose();

        setTimeout(() => {
          if (userRole === "host") {
            router.push("/host-dashboard");
          }
        }, 500);
      } catch (error) {
        console.error("Token decode error:", error);
        messageApi.error("Authentication error. Please try again.");
      }
    },

    onError: (error: any) => {
      if (error.status === 422) {
        messageApi.warning({
          content: "Your account is not verified. Please check your email and verify with OTP.",
          duration: 5,
        });
        const email = form.getFieldValue("email");
        setTimeout(() => {
          router.replace(`/email-verification?email=${email}&role=${role}`);
          onClose();
        }, 1500);
      } else if (error.status === 401) {
        messageApi.error("Invalid email or password. Please try again.");
      } else {
        messageApi.error(error?.response?.data?.message || "Login failed. Please try again.");
      }
    },
  });
  const handleSubmit = (values: { email: string; password: string }) => {
    const finalRole = isHost ? "host" : role;
    loginUser({ ...values, role: finalRole });
  };

  return (
    <>
      {contextHolder}

      <Modal
        title={
          <div className="pb-4 border-b border-gray-200 text-start">
            <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Login to your Okobiz Property account</p>
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        destroyOnClose
        width={500}
      >
        <div className="space-y-4">
          <div className="w-full flex justify-center items-center gap-4 mb-2">
            {(isHost ? hostandGuest.filter(t => t.name === "host") : hostandGuest).map((type, index) => {
              const isSelected = isHost ? type.name === "host" : role === type.name;
              return (
                <div
                  key={index}
                  className={`
                    relative w-full cursor-pointer flex justify-center items-center py-4 px-2 
                    rounded ring-0 border border-gray-200 
                    ${isSelected ? " border-primary ring-0" : ""}
                  `}
                  onClick={() => setRole(type.name as "host" | "guest")}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 border rounded border-gray-300 flex items-center justify-center bg-white">
                      <span className="text-red-500 text-xs font-bold leading-none">
                        ✔
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 justify-center items-center">
                    <Image
                      height={40}
                      width={40}
                      src={type.imgSrc}
                      alt="image"
                      className="w-[40px]"
                    />
                    <h4 className="text-xs tracking-tight font-bold text-gray-600">
                      Login as {type.display}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email address" }
              ]}
            >
              <Input placeholder="Email Address" size="large" type="email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 8, message: "Password must be at least 8 characters" }
              ]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                className="!bg-primary"
                loading={isPending}
              >
                Continue as {isHost ? "Property Owner" : hostandGuest.find(t => t.name === role)?.display}
              </Button>
            </Form.Item>
          </Form>

          <Button
            type="link"
            block
            onClick={() => {
              router.push("/forgot-password");
              onClose();
            }}
            className="text-center"
          >
            Forgot Password?
          </Button>
          <div className="text-center">
            <h3>
              Don’t have an account?{" "}
              <Button
                type="link"
                onClick={() => {
                  onClose();
                  setTimeout(() => setShowModal(true), 300);
                }}
              >
                SignUp
              </Button>
            </h3>
          </div>
        </div>
      </Modal>

      <SignupModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default LoginModal;
