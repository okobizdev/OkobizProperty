"use client";

import { Modal, Input, Button, message, Form } from "antd";
import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "@/services/auth/auth.service";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: AuthServices.processChangePassword,
    onSuccess: () => {
      messageApi.success({
        content: "Password changed successfully! Please login with your new password.",
        duration: 4,
      });
      form.resetFields();
      setTimeout(() => onClose(), 1500);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage?.includes("incorrect") || errorMessage?.includes("wrong")) {
        messageApi.error("Current password is incorrect. Please try again.");
      } else {
        messageApi.error(errorMessage || "Failed to change password. Please try again.");
      }
    },
  });

  const handleSubmit = (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="pb-4 border-b border-gray-200 text-start">
            <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1">Update your account security</p>
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        destroyOnClose
        width={480}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4 mt-4"
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter your current password" }
            ]}
          >
            <Input.Password placeholder="Enter current password" size="large" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters long" },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: "Password must include uppercase, lowercase, and number" }
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter new password" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" size="large" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              className="!bg-primary mt-2"
              loading={isPending}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
