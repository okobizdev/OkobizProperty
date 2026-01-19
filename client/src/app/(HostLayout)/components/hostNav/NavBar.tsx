"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineUser,
  HiMenu,
  HiX,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { Dropdown, Button, Drawer, message, MenuProps } from "antd";
import { useMutation } from "@tanstack/react-query";
import logo from "@/assets/logo/okobiz-property-logo2.png";
import { poppins } from "@/app/font";
import useAuth from "@/hooks/useAuth";
import { AuthServices } from "@/services/auth/auth.service";
import SignupModal from "@/components/modals/SignUpModal";
import LoginModal from "@/components/modals/LoginModal";
import { TabMenuList } from "./nav.utils";
import { HiChevronDown } from "react-icons/hi";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { ProfileServices } from "@/services/profile/profile.services";

const { processLogout } = AuthServices;

const NavBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [avatar, setAvatar] = useState<string>("");
  const [activeTabId, setActiveTabId] = useState(TabMenuList[0]?.id);

  const pathname = usePathname();
  useEffect(() => {
    const matchedTab = TabMenuList.find(menu => {
      if (menu.link !== "#") {
        return pathname === menu.link;
      } else if (menu.dropdownItems) {
        return menu.dropdownItems.some(item => pathname === item.href);
      }
      return false;
    });
    if (matchedTab) {
      setActiveTabId(matchedTab.id);
    } else {
      setActiveTabId(TabMenuList[0]?.id);
    }
  }, [pathname]);

  const { user, isAuthenticated } = useAuth();

  const { mutate: logout } = useMutation({
    mutationFn: processLogout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.setItem("hasLoggedOut", "true");
      messageApi.success("Logout Successful");
      window.location.href = "/";
    },
    onError: () => {
      messageApi.error("Logout failed");
    },
  });

  const handleScroll = useCallback(() => {
    setIsSticky(window.scrollY > 70);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleDropdown = (menuId: any) => {
    setOpenDropdownId((prev) => (prev === menuId ? null : menuId));
  };

  const profileMenu: MenuProps = {
    items: [
      {
        key: "profile",
        label: <Link href="/profile">Profile</Link>,
        icon: <HiOutlineUser className="mr-2" />,
      },
      {
        key: "change-password",
        label: (
          <button
            className="cursor-pointer w-full text-left flex items-center"
            onClick={() => setOpenChangePassword(true)}
          >
            <HiOutlineUser className="mr-2" />
            Change Password
          </button>
        ),
      },
      {
        key: "logout",
        danger: true,
        label: (
          <span className="flex items-center" onClick={() => logout()}>
            <HiOutlineLogout className="mr-2" />
            Logout
          </span>
        ),
      },
    ],
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await ProfileServices.processGetProfile();
        const userData = res?.data;
        if (userData?.user?.avatar) {
          setAvatar(userData.user.avatar);
        } else {
          setAvatar("");
        }
      } catch {
        setAvatar("");
      }
    };
    if (isAuthenticated) fetchAvatar();
  }, [isAuthenticated]);

  return (
    <>
      {contextHolder}
      <nav
        className={`w-full top-0 z-50 transition-all duration-300 ${isSticky
          ? "fixed bg-white shadow-lg backdrop-blur-sm bg-opacity-90"
          : "relative bg-white"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              alt="logo"
              width={160}
              height={60}
              className="w-auto h-10 md:h-18"
              priority
            />
          </Link>

          <div className="hidden lg:flex gap-8 items-center">
            {TabMenuList.map((menu) => {
              const isActive = activeTabId === menu.id;
              if (menu.dropdownItems) {
                return (
                  <Dropdown
                    key={menu.id}
                    trigger={["hover"]}
                    placement="bottomLeft"
                    menu={{
                      items: menu.dropdownItems.map((item) => ({
                        key: item.key,
                        label: <Link href={item.href}>{item.label}</Link>,
                        onClick: () => setActiveTabId(menu.id),
                      })),
                    }}
                  >
                    <span
                      className={`cursor-pointer text-base font-medium flex items-center gap-1 transition-colors duration-200 ${isActive
                        ? "text-primary font-semibold"
                        : "text-gray-700 hover:text-primary"
                        } ${poppins.className}`}
                      onClick={() => setActiveTabId(menu.id)}
                    >
                      {menu.title}
                      <HiChevronDown className="text-sm mt-0.5" />
                    </span>
                  </Dropdown>
                );
              } else {
                return (
                  <Link
                    key={menu.id}
                    href={menu.link}
                    className={`text-base font-medium transition-colors duration-200 ${isActive
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                      } ${poppins.className}`}
                    onClick={() => setActiveTabId(menu.id)}
                  >
                    {menu.title}
                  </Link>
                );
              }
            })}
          </div>

          <div className="hidden lg:flex gap-3 items-center">
            {isAuthenticated && user && user.isVerified ? (
              <Dropdown
                menu={profileMenu}
                trigger={["hover"]}
                placement="bottomRight"
              >
                <Button
                  shape="round"
                  className="flex items-center gap-2 border border-gray-200 hover:border-primary"
                >
                  {avatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar}`}
                        alt="Profile Avatar"
                        width={32}
                        height={32}
                        className="object-cover rounded-full border-2 border-blue-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/default-avatar.png";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <HiOutlineUser className="text-primary" />
                    </div>
                  )}
                  <span className="capitalize">{user?.role === "host" ? "Property Owner" : "Client"}</span>
                </Button>
              </Dropdown>
            ) : (
              <>
                <Button
                  className="border border-primary text-gray-900 hover:border-primary hover:text-primary flex items-center gap-2"
                  onClick={() => setShowLoginModal(true)}
                >
                  <HiOutlineLogin />
                  Login
                </Button>
                {/* <Button
                  className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
                  type="primary"
                  onClick={() => setShowModal(true)}
                >
                  <HiOutlineUserAdd />
                  Sign Up
                </Button> */}
              </>
            )}
          </div>

          <div className="lg:hidden">
            <Button
              type="text"
              icon={mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="!p-2 !h-auto"
            />
          </div>
        </div>
      </nav>

      <Drawer
        title={
          <div className="flex items-center">
            <Image
              src={logo}
              alt="Okobiz-Property"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="ml-3 text-lg font-semibold">Okobiz-Property</span>
          </div>
        }
        placement="left"
        closable={false}
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={280}
        styles={{
          header: { borderBottom: "none", padding: "16px 20px" },
          body: { padding: "0 20px" },
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {TabMenuList.map((menu) => {
              const isActive = activeTabId === menu.id;
              if (menu.dropdownItems) {
                return (
                  <div key={menu.id}>
                    <div
                      className={`font-semibold flex items-center justify-between p-3 rounded-lg ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-800 hover:bg-gray-100"
                        }`}
                      onClick={() => {
                        toggleDropdown(menu.id);
                        setActiveTabId(menu.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {menu.title}
                      <HiChevronDown
                        className={`transition-transform duration-200 ${openDropdownId === menu.id
                          ? "transform rotate-180"
                          : ""
                          }`}
                      />
                    </div>
                    {openDropdownId === menu.id && (
                      <div className="pl-4 mt-1 flex flex-col gap-2">
                        {menu.dropdownItems.map((item) => (
                          <Link
                            key={item.key}
                            href={item.href}
                            className={`p-2 rounded-md text-gray-600 hover:text-primary ${pathname === item.href
                              ? "text-primary font-medium bg-primary/10"
                              : ""
                              }`}
                            onClick={() => {
                              setMobileOpen(false);
                              setActiveTabId(menu.id);
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={menu.id}
                    href={menu.link}
                    className={`block p-3 rounded-lg text-base font-medium ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-800 hover:bg-gray-100"
                      }`}
                    onClick={() => {
                      setMobileOpen(false);
                      setActiveTabId(menu.id);
                    }}
                  >
                    {menu.title}
                  </Link>
                );
              }
            })}
          </div>

          <div className="border-t border-gray-200 pt-4 pb-6">
            {isAuthenticated && user && user.isVerified ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <HiOutlineUser className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role === "host" ? "Property Owner" : "Client"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => logout()}
                  danger
                  block
                  className="flex items-center justify-center gap-2"
                >
                  <HiOutlineLogout />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileOpen(false);
                  }}
                  block
                  className="flex items-center justify-center gap-2"
                >
                  <HiOutlineLogin />
                  Login
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setShowModal(true);
                    setMobileOpen(false);
                  }}
                  block
                  className="flex items-center justify-center gap-2"
                >
                  <HiOutlineUserAdd />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      <SignupModal open={showModal} onClose={() => setShowModal(false)} />
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </>
  );
};

export default NavBar;
