import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import AuthServices from "../services/auth.services";

export default function ForgotPasswordPage() {
  const { processForgotPassword } = AuthServices;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const role = "admin"; // Set role to 'admin' for admin forgot password

  const { mutate, isPending } = useMutation({
    mutationFn: processForgotPassword,
    onSuccess: async () => {
      messageApi.success("OTP sent to your email");
      const email = form.getFieldValue("email");
      navigate(`/reset-password?email=${email}&role=${role}`);
    },
    onError: () => {
      messageApi.error("Failed to send OTP. Try again.");
    },
  });

  const handleFinish = (values) => {
    mutate({ ...values, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
        {contextHolder}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          requiredMark={false}
        >
          {/* <Form.Item
            label={<span className="text-sm text-gray-700">Role</span>}
            className="mb-4"
          >
            <Radio.Group
              value={role}
              onChange={(e) => setRole(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="guest">Guest</Radio.Button>
              <Radio.Button value="host">Host</Radio.Button>
            </Radio.Group>
          </Form.Item> */}

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
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
