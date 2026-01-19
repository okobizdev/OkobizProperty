import { Layout, Menu, message } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import logo from "../assets/logo/okobiz-property-logo2.png";
import { Avatar, Dropdown, Menu as AntMenu, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

import { Outlet, useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;
import React, { useState } from "react";
import { menuItems } from "../constants/navItems";
import RenderdMenuItems from "../components/RenderedMenuItems";
import AuthServices from "../services/auth.services";
import { useMutation } from "@tanstack/react-query";
const { processLogout } = AuthServices;

const ProfileDropdown = ({ onLogout }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to decode token", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const menu = (
    <AntMenu>
      <AntMenu.Item key="profile">
        <div className="flex flex-col">
          <span className="font-semibold">{user?.name}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
      </AntMenu.Item>
      <AntMenu.Divider />
      <AntMenu.Item key="logout" onClick={onLogout}>
        <span className="text-red-500">Logout</span>
      </AntMenu.Item>
    </AntMenu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={["hover"]}>
      <div className="flex items-center gap-2 cursor-pointer">
        {loading ? (
          <Spin size="small" />
        ) : (
          <>
            <Avatar icon={<UserOutlined />} size="large" />
            <span className="font-medium text-white capitalize">
              {user?.role}
            </span>
          </>
        )}
      </div>
    </Dropdown>
  );
};

const Main = () => {
  const { mutate: logout } = useMutation({
    mutationFn: processLogout,
    onSuccess: () => {
      message.success("Logout Successful");
      localStorage.setItem("hasLoggedOut", "true");
      localStorage.removeItem("accessToken");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Logout failed");
    },
  });
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    localStorage.getItem("selectedMenuItem") || "summary"
  );
  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
    localStorage.setItem("selectedMenuItem", key);
    key === "dashboard" ? navigate("/") : navigate(`/${key}`);
  };
  const [hideLayout] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout hasSider className="">
      {!hideLayout && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={300}
          className="h-screen shadow-lg"
          style={{
            background: "#FFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            borderBottom: "1px solid #f5e7d1",
          }}
        >
          <div
            className={`text-black mx-auto font-bold text-2xl text-center rounded-full mt-5 mb-5  ${collapsed
                ? `w-[50px] h-[23px] leading-[50px]`
                : `w-[91px] h-[40px] leading-[50px]`
              }`}
          >
            <img src={logo} alt="Logo" className="rounded-full" />
          </div>
          <hr className="border-gray-100 shadow-2xl" />
          <Menu
            theme="light"
            className="h-[calc(100vh-140px)] overflow-y-auto bg-secondary pb-3"
            mode="inline"
            defaultSelectedKeys={["summary"]}
            selectedKeys={[selectedMenuItem]}
            onClick={({ key }) => handleMenuItemClick(key)}
            rootClassName="custom-menu"
          >
            {RenderdMenuItems(menuItems)}
          </Menu>
        </Sider>
      )}
      <Layout className="h-screen">
        <Header
          className="w-full flex justify-between mx-0 px-0 items-center  "
          style={{
            background: "#FFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            borderBottom: "1px solid #f5e7d1",
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="px-4 text-black/80 hover:text-black bg-secondary hover:bg-secondary/70 cursor-pointer"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="text-xl" />
            ) : (
              <MenuFoldOutlined className="text-xl" />
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <ProfileDropdown onLogout={logout} />
          </div>
        </Header>

        <Content className="px-5 pb-20 overflow-y-auto h-full">
          <Outlet />
        </Content>
        <h1 className="my-4 text-center">
          Developed by{" "}
          <a href="https://okobiz.com" className="font-bold text-black">
            okobiz
          </a>
        </h1>
      </Layout>
    </Layout>
  );
};

export default Main;
