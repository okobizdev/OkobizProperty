import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select } from "antd";
import { Link, Router, useNavigate } from "react-router-dom";
import logo from "../assets/logo/okobiz-property-logo2.png";
import AuthServices from "../services/auth.services";
import { useMutation } from "@tanstack/react-query";
const { processLogin } = AuthServices;
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState("admin");
   const [lastEmail, setLastEmail] = useState("");
  const { isPending, mutate } = useMutation({
    mutationFn: processLogin,
    onSuccess: () => {  
      message.success("Login successful!");
      navigate("/two-factor-auth?email=" + lastEmail + "&role=" + role);
    },
    onError: (error) => {
      // Handle error with status code
      if (error?.status === 401) {
        message.error("Invalid credentials. Please try again.");
      } else if (error?.status === 422) {
        message.error("User not verified, check email and verify account with sent OTP.");
         navigate(`/email-verification?email=${lastEmail}&role=${role}`); 
      } else if (error?.status === 404) {
        message.error("User not found.");
      } else {
        message.error(error?.message || "Login failed. Please try again.");
      }
    },
  });
  const onFinish = async (values) => {
    const { email, password } = values;
     setLastEmail(email); 
    mutate({ email, password, role });
  };
  return (
    <div className="flex  justify-center flex-col items-center h-screen bg-gradient-to-r from-indigo-200 to-yellow-100 ">
      <div className=" flex flex-col gap-x-10 md:gap-x-20 lg:gap-x-70 md:flex-row justify-between items-center gap-4">
        <div className="w-[130px] md:w-[200px] ">
          <img src={logo} alt="Logo" className="rounded-full" />
        </div>
        <div className="md:w-[500px] h-full  p-10 rounded-md bg-white shadow-lg">
          <h1 className="text-3xl my-2 mb-8 font-bold text-center !text-black">
            Okobiz Property
          </h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item>
              <Select
                value={role}
                onChange={setRole}
                size="large"
                options={[
                  { value: "financeManager", label: "Finance Manager" },
                  { value: "contentManager", label: "Content Manager" },
                  {
                    value: "listingVerificationManager",
                    label: "Listing Verification Manager",
                  },
                  {
                    value: "accountAdministrator",
                    label: "Account Administrator",
                  },
                  { value: "admin", label: "Admin" },
                ]}
                placeholder="Select a role"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="py-2 px-4 rounded border border-gray-300 focus:border-indigo-500 focus:shadow-outline"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                className="py-2 px-4 rounded border border-gray-300 focus:border-indigo-500 focus:shadow-outline"
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                className="w-full text-white font-semibold py-2 rounded transition-all duration-300 shadow-md"
                style={{
                  background:
                    "#04468D",
                  border: "none",
                  color: "white",
                }}
              >
                {isPending ? "Processing..." : "Log in"}
              </Button>
            </Form.Item>
          </Form>
          <div className="flex justify-between items-center mt-4">
            <span>
              <Link
                to="/forgot-password"
                className="text-slate-700 hover:text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </span>
          </div>
        </div>
      </div>

      <h1 className="mt-30">
        Developed by{" "}
        <Link
          className="font-bold text-black "
          target="_blank"
          to={"https://okobiz.com"}
        >
          okobiz
        </Link>
      </h1>
    </div>
  );
};

export default Login;
