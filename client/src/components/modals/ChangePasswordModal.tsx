"use client";

import { Modal, Input, Button, message } from "antd";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "@/services/auth/auth.service";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const initialForm = {
  oldPassword: "",
  newPassword: "",
};

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState(initialForm);
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: AuthServices.processChangePassword,
    onSuccess: () => {
      messageApi.success("Password changed successfully");
      setFormData(initialForm);
      onClose();
    },
    onError: (error: any) => {
      messageApi.error(
        error?.response?.data?.message || "Failed to change password"
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { oldPassword, newPassword } = formData;

    if (!oldPassword || !newPassword) {
      messageApi.warning("Please enter both old and new passwords");
      return;
    }
    if (newPassword.length < 8) {
      messageApi.warning("New password must be at least 8 characters");
      return;
    }

    changePassword({ oldPassword, newPassword });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="pb-4 border-b border-gray-200 text-center text-lg font-semibold">
            Change Your Password
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        centered
      >
        <div className="space-y-4">
          <div className="py-3">
            <Input.Password
              name="oldPassword"
              placeholder="Current Password"
              value={formData.oldPassword}
              onChange={handleChange}
              size="large"
            />
          </div>
          <div className="py-3">
            <Input.Password
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
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
            Change Password
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
