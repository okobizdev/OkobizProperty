"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineUser, HiMenu, HiX, HiChevronDown, HiChevronRight } from "react-icons/hi";
import { Dropdown, message } from "antd";
import { useMutation } from "@tanstack/react-query";
// import logo from "@/assets/logo/logo1.png";
import logo from "@/assets/logo/okobiz-property-logo2.png";
import { useMenuList } from "@/utilits/menuList";
import { poppins } from "@/app/font";
import SignupModal from "@/components/modals/SignUpModal";
import LoginModal from "@/components/modals/LoginModal";
import useAuth from "@/hooks/useAuth";
import { AuthServices } from "@/services/auth/auth.service";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { usePathname } from "next/navigation";
import { ProfileServices } from "@/services/profile/profile.services";

const { processLogout } = AuthServices;

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [avatar, setAvatar] = useState<string>("");
  const [isHost, setIsHost] = useState(false);


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [expandedSubDropdown, setExpandedSubDropdown] = useState<string | null>(null);
  const [isProfileMenuOpenMobile, setIsProfileMenuOpenMobile] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const avatarBtnRef = useRef<HTMLButtonElement | null>(null);

  const { user, isAuthenticated, logout: contextLogout } = useAuth();
  const menuList = useMenuList();
  const pathname = usePathname();
  const ADMIN_URL = process.env.NEXT_PUBLIC_API_ADMIN_URL || "";

  const { mutate: logout } = useMutation({
    mutationFn: processLogout,
    onMutate: () => setLoggingOut(true),
    onSuccess: () => {
      contextLogout();
      localStorage.removeItem("accessToken");
      localStorage.setItem("hasLoggedOut", "true");
      messageApi.success("Logout Successful");
      window.location.href = "/";
      setTimeout(() => setLoggingOut(false), 300);
    },
    onError: () => {
      setLoggingOut(false);
      messageApi.error("Logout failed");
    },
  });

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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


  useEffect(() => {
    setIsMobileMenuOpen(false);
    setExpandedDropdown(null);
    setExpandedSubDropdown(null);
    setIsProfileMenuOpenMobile(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isProfileMenuOpenMobile &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(target)
      ) {
        setIsProfileMenuOpenMobile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileMenuOpenMobile]);


  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);



  const profileItems = [
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
    },
    ...(user?.role === "host"
      ? [
        {
          key: "switch",
          label: <Link href="/host-dashboard">Go to Own Dashboard</Link>,
        },
      ]
      : []),
    ...(user?.role === "guest"
      ? [
        {
          key: "guest-booking-list",
          label: <Link href="/my-bookings">Go to Booking List</Link>,
        },
      ]
      : []),
    ...(user?.role === "admin"
      ? [
        {
          key: "admin-dashboard",
          label: <a href={`${ADMIN_URL}`}>Go to Admin Dashboard </a>,
        },
      ]
      : []),
    {
      key: "change-password",
      label: (
        <button
          className="cursor-pointer w-full text-left"
          onClick={() => setOpenChangePassword(true)}
        >
          Change Password
        </button>
      ),
    },
    {
      key: "logout",
      label: (
        <button
          className="cursor-pointer w-full text-left"
          onClick={() => logout()}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      ),
    },
  ];

  const toggleDropdown = (menuId: string) => {
    setExpandedDropdown(expandedDropdown === menuId ? null : menuId);
    setExpandedSubDropdown(null);
  };

  const toggleSubDropdown = (itemKey: string) => {
    setExpandedSubDropdown(expandedSubDropdown === itemKey ? null : itemKey);
  };

  return (
    <>
      {contextHolder}
      <div
        className={`w-full top-0 z-50 transition-all ease-in-out duration-300 border-b py-2 border-[#262626]/5 ${isSticky ? "fixed bg-white shadow-md py-2" : "relative"
          }`}
      >
        <div className="w-full max-w-full md:max-w-6xl lg:max-w-6xl mx-auto py-2 px-4">
          <div className="flex items-center justify-between">

            <div>
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={logo}
                  alt="logo"
                  width={340}
                  height={300}
                  className="w-auto h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 object-contain"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="lg:flex hidden items-center justify-center">
              {menuList?.map((menu) => {
                const isActive = pathname === menu.link || (menu.link === "#" && pathname.startsWith("/properties"));
                const hasDropdown = menu.dropdownItems && menu.dropdownItems.length > 0;
                return (
                  <div key={menu.id} className="relative group hover:bg-primary/10 rounded px-2 py-2">
                    <Link href={menu.link}>
                      <li
                        className={`list-none text-base font-medium cursor-pointer relative flex items-center ${poppins.className
                          } ${isActive
                            ? "text-primary-500 text-blue-600 after:absolute  after:right-0 after:bottom-0  after:bg-primary-700"
                            : "text-gray-700"
                          } transition-all duration-300 ease-in-out`}
                      >
                        {menu.title}
                        {hasDropdown && menu.title === "Properties" && (
                          <span className="">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 8L10 12L14 8" stroke="#08396D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </li>
                    </Link>

                    {hasDropdown && (
                      <ul className="absolute left-0 top-full bg-white shadow-xl rounded-lg py-3 min-w-[200px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out border border-gray-100 before:content-[''] before:absolute before:-top-1.5 before:left-5 before:w-3 before:h-3 before:bg-white before:border-l before:border-t before:border-gray-100 before:rotate-45 before:z-[-1]">
                        {menu.dropdownItems.map((item, index) => (
                          <li
                            key={item.key}
                            className={`relative group/item ${index !== menu.dropdownItems.length - 1
                              ? "border-b border-gray-50"
                              : ""
                              }`}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all duration-200 ease-in-out group-hover/item:bg-primary/10"
                            >

                              {item.label.toLowerCase().includes("buy") ? (
                                <svg
                                  className="w-4 h-4 text-primary"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                              ) : item.label.toLowerCase().includes("rent") ? (
                                <svg
                                  className="w-4 h-4 text-primary"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover/item:from-primary/40 group-hover/item:to-primary/20 transition-all duration-200">
                                  <div className="w-2 h-2 rounded-full bg-primary/60 group-hover/item:bg-primary transition-all duration-200"></div>
                                </div>
                              )}
                              <span className="font-medium text-sm group-hover/item:translate-x-1 transition-transform duration-200">
                                {item.label}
                              </span>
                              {/* Arrow indicator */}
                              {item.children && item.children.length > 0 && (
                                <svg
                                  className="w-3 h-3 ml-auto opacity-60 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-200"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              )}
                            </Link>
                            {/* Child Dropdown */}
                            {item.children && item.children.length > 0 && (
                              <ul className="absolute left-full top-0 bg-white shadow-xl rounded-lg py-2 min-w-[180px] z-50 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transform translate-x-2 group-hover/item:translate-x-0 transition-all duration-300 ease-out border border-gray-100">
                                {item.children.map((child) => (
                                  <li key={child.key}>
                                    <Link
                                      href={child.href}
                                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                                    >
                                      <span>{child.label}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center justify-center lg:gap-2 font-medium text-[12px]">
              {isAuthenticated && (user as any)?.isVerified ? (
                <>
                  {/* <Dropdown
                    menu={{ items: switchProfileItems }}
                    trigger={["hover"]}
                    placement="bottomLeft"
                  >
                    <button className="md:px-4 px-2 md:py-2 py-2 bg-primary text-white rounded md:text-base text-[12px]">
                      Switch Profile
                    </button>
                  </Dropdown> */}

                  <Dropdown
                    menu={{ items: profileItems }}
                    trigger={["hover"]}
                    placement="bottomLeft"
                  >
                    <div className="flex space-x-3 items-center lg:border border-[#DDDDDD] cursor-pointer p-[.5rem] lg:rounded-full">
                      {avatar ? (
                        <div className="lg:w-8 lg:h-8 w-8.5 h-8.5 flex items-center justify-center lg:rounded-full rounded bg-primary text-white text-sm uppercase overflow-hidden relative">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar}`}
                            alt="Profile Avatar"
                            fill
                            className="rounded-full object-cover border-2 border-blue-100"
                            sizes="32px"
                            priority
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/default-avatar.png";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="lg:w-8 lg:h-8 w-8.5 h-8.5 flex items-center justify-center lg:rounded-full rounded bg-primary text-white text-sm uppercase">
                          {(user as any)?.name?.charAt(0) ??
                            (user as any)?.role?.charAt(0)}
                        </div>
                      )}
                      <span className="capitalize lg:block hidden">
                        {(user as any)?.role === "host" ? "Property Owner" : "Client"}
                      </span>
                    </div>
                  </Dropdown>

                  <button
                    className="ml-2 px-5 py-2 bg-gradient-to-r from-primary to-primary text-white rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 animate-pulse border-2 border-primary cursor-pointer hidden md:inline-flex"
                    onClick={() => {
                      if ((user as any)?.role === "host") {
                        window.location.href = "/host-dashboard";
                      } else {
                        setShowLoginModal(true);
                        setIsHost(true);
                      }
                    }}

                  >
                    <span className="inline-block animate-bounce mr-2">🏠</span>{" "}
                    Sell/Rent your Property
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex cursor-pointer items-center gap-1 border border-primary px-4 py-1 rounded"
                  >
                    <span className="p-1 rounded-full bg-primary text-white">
                      <HiOutlineUser />
                    </span>
                    <span>Login</span>
                  </button>

                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 cursor-pointer bg-primary rounded text-white hidden md:block"
                  >
                    Sign Up
                  </button>

                  <button
                    className="ml-2 px-5 py-2 bg-primary text-white rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105  border-1 border-primary cursor-pointer hidden md:inline-flex"
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsHost(true);
                    }

                    }
                  >
                    <span className="inline-block animate-bounce mr-2">🏠</span>{" "}
                    Sell/Rent your Property
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button and User Avatar */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile User Avatar (if authenticated) */}
              {isAuthenticated && (user as any)?.isVerified && (
                <div className="flex items-center">
                  <button
                    ref={avatarBtnRef}
                    onClick={() => setIsProfileMenuOpenMobile(!isProfileMenuOpenMobile)}
                    className="relative w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-sm uppercase overflow-hidden focus:outline-none"
                    aria-label="Open profile menu"
                    type="button"
                  >
                    {avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar}`}
                        alt="Profile Avatar"
                        fill
                        className="rounded-full object-cover"
                        sizes="32px"
                        priority
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <span>{(user as any)?.name?.charAt(0) ?? (user as any)?.role?.charAt(0)}</span>
                    )}
                  </button>

                  {/* Mobile profile dropdown panel (mirrors desktop) */}
                  {isProfileMenuOpenMobile && (
                    <div ref={profileMenuRef} className="absolute top-14 right-4 w-60 bg-white shadow-lg rounded-md border border-gray-100 z-50">
                      <div className="py-2">
                        {profileItems.map((item) => (
                          <div key={item.key} className="px-3">
                            {/* item.label is a ReactNode; render with care */}
                            <div
                              onClick={() => {
                                // if item has onClick (like change-password) it will run; close menu
                                setIsProfileMenuOpenMobile(false);
                                setIsMobileMenuOpen(false);
                              }}
                              className="py-2 text-gray-700 hover:text-primary hover:bg-primary/10 rounded px-2 cursor-pointer"
                            >
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-6 h-6 text-gray-700" />
                ) : (
                  <HiMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? "block" : "hidden"
          }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-1 h-auto  w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ willChange: 'transform' }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-1 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Image
                src={logo}
                alt="logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <HiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-full overflow-y-auto">
            {/* User Section (if authenticated) */}
            {isAuthenticated && (user as any)?.isVerified && (
              <div className="p-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-0">
                  {avatar ? (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs uppercase relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${avatar}`}
                        alt="Profile Avatar"
                        fill
                        className="rounded-full object-cover"
                        sizes="40px"
                        priority
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-avatar.png";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white text-sm uppercase">
                      {(user as any)?.name?.charAt(0) ?? (user as any)?.role?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800 capitalize">
                      {(user as any)?.name || (user as any)?.role}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {(user as any)?.role === "host" ? "Property Owner" : "Client"}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 py-3">
              {menuList?.map((menu) => {
                // mark Properties parent active on child property routes as well
                const isActive = pathname === menu.link || (menu.link === "#" && pathname.startsWith("/properties"));
                const hasDropdown = menu.dropdownItems && menu.dropdownItems.length > 0;
                const isExpanded = expandedDropdown === menu.id;

                return (
                  <div key={menu.id} className="border-b border-gray-100 last:border-b-0 ">
                    {hasDropdown ? (
                      <button
                        onClick={() => toggleDropdown(menu.id)}
                        className={`w-full flex items-center justify-between px-4 py-1 text-left transition-colors duration-200 ${isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <span className={`font-medium ${poppins.className}`}>
                          {menu.title}
                        </span>
                        <HiChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={menu.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-1 transition-colors  duration-200 ${isActive ? "text-primary bg-primary/10" : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <span className={`text-md ${poppins.className}`}>
                          {menu.title}
                        </span>
                      </Link>
                    )}

                    {/* Dropdown Items */}
                    {hasDropdown && isExpanded && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {menu.dropdownItems?.map((item) => (
                          <div key={item.key}>
                            {item.children && item.children.length > 0 ? (
                              <div>
                                <button
                                  onClick={() => toggleSubDropdown(item.key)}
                                  className="w-full flex items-center justify-between px-6 py-3 text-left text-gray-700 hover:bg-white hover:text-primary transition-colors duration-200"
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Icon based on item type */}
                                    {item.label.toLowerCase().includes("buy") ? (
                                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                      </svg>
                                    ) : item.label.toLowerCase().includes("rent") ? (
                                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                      </svg>
                                    ) : (
                                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                                      </div>
                                    )}
                                    <span className="font-medium">{item.label}</span>
                                  </div>
                                  <HiChevronRight
                                    className={`w-4 h-4 transition-transform duration-200 ${expandedSubDropdown === item.key ? "rotate-90" : ""
                                      }`}
                                  />
                                </button>

                                {/* Sub-dropdown items */}
                                {expandedSubDropdown === item.key && (
                                  <div className="bg-white border-t border-gray-100">
                                    {item.children.map((child) => (
                                      <Link
                                        key={child.key}
                                        href={child.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-8 py-3 text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors duration-200 border-b border-gray-50 last:border-b-0"
                                      >
                                        <span className="text-sm">{child.label}</span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-white hover:text-primary transition-colors duration-200"
                              >
                                {/* Icon based on item type */}
                                {item.label.toLowerCase().includes("buy") ? (
                                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                  </svg>
                                ) : item.label.toLowerCase().includes("rent") ? (
                                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                  </svg>
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                                  </div>
                                )}
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile-only Logout button placed right after menu items (appears after Contact) */}


            {/* Mobile Auth Section */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {isAuthenticated && (user as any)?.isVerified ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {user?.role === "host" && (
                      <Link
                        href="/host-dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary hover:bg-white rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        <span className="font-medium">Host Dashboard</span>
                      </Link>
                    )}

                    {user?.role === "admin" && (
                      <a
                        href={`${ADMIN_URL}`}
                        className="flex items-center gap-3 px-4 py-1 text-gray-700 hover:text-primary hover:bg-white rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-5L8 4H5a2 2 0 00-2 2v1h5.586l-.293-.293A1 1 0 0110 6z" />
                        </svg>
                        <span className="text-sm">Admin Dashboard</span>
                      </a>
                    )}

                    {/* Logout shown after menu items; removed from here to avoid duplicate */}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-1 border border-primary text-primary rounded-lg font-medium transition-colors duration-200 hover:bg-primary hover:text-white"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    <span>Login</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-1 bg-primary text-white rounded-lg font-medium transition-colors duration-200 hover:bg-primary/90"
                  >
                    Sign Up
                  </button>

                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                      setIsHost(true);
                    }}
                    className="w-full px-4 py-1 bg-gradient-to-r from-primary to-primary text-white rounded-lg font-medium shadow-md transition-transform duration-300 hover:scale-105"
                  >
                    <span className="mr-2">🏠</span>
                    Sell/Rent your Property
                  </button>
                </div>
              )}
            </div>
            {isAuthenticated && (user as any)?.isVerified && (
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={loggingOut}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">{loggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      <SignupModal open={showModal} onClose={() => setShowModal(false)} />
      <LoginModal
        open={showLoginModal}
        isHost={isHost}
        onClose={() => { setShowLoginModal(false); setIsHost(false) }}
      />
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </>
  );
};

export default Navbar;