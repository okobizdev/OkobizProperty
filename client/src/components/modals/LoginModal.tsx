"use client";

import { Input, Modal, Button, message } from "antd";
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
  const [formData, setFormData] = useState(initialForm);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();
  const [role, setRole] = useState<"host" | "guest">(isHost ? "host" : "guest");

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
        messageApi.error("No access token received.");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedJwtPayload>(accessToken);
        const userRole = decoded.role;

        login({ accessToken });

        messageApi.success(data.message || "Login successful!");
        onClose();
        setFormData(initialForm);

        if (userRole === "host") {
          router.push("/host-dashboard");
        }
      } catch (error) {
        console.log(error);
        console.error("Invalid token", error);
        messageApi.error("Invalid token.");
      }
    },

    onError: (error: any) => {
      if (error.status === 422) {
        messageApi.error("Your account is not verified, please check your email and verify with OTP.");
        router.replace(`/email-verification?email=${formData.email}&role=${role}`);
        onClose();
        return;
      } else if (error.status === 401) {
        messageApi.error("Invalid credentials.");
        return;
      } else {
        messageApi.error(error.message || "Login failed. Please try again.");
        return;
      }
    },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { email, password } = formData;
    if (!email || !password) {
      return messageApi.warning("Please fill in both fields.");
    }

    // Ensure role is set to 'host' if isHost is true
    const finalRole = isHost ? "host" : role;

    loginUser({ email, password, role: finalRole });
  };

  return (
    <>
      {contextHolder}

      <Modal
        title={
          <div className="pb-4 border-b border-gray-200 text-center text-lg font-semibold">
            Welcome to Okobiz Property
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        centered
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
          <div className="py-3">
            <Input
              name="email"
              placeholder=" Your email address "
              value={formData.email}
              onChange={handleChange}
              size="large"
            />
          </div>
          <div className="py-3">
            <Input.Password
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              size="large"
            />
          </div>
          <Button
            block
            size="large"
            type="primary"
            className="!bg-primary mt-4"
            onClick={handleSubmit}
            loading={isPending}
          >
            Continue as {isHost ? "Property Owner" : hostandGuest.find(t => t.name === role)?.display}
          </Button>
          <Button
            type="link"
            onClick={() => {
              router.push("/forgot-password");
              onClose();
            }}
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
