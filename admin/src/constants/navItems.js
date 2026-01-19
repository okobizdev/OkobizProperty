import { FaDollarSign, FaTachometerAlt } from "react-icons/fa";
import {
  FaUserShield,
  FaUserFriends,
  FaBlog,
  FaMoneyCheckAlt,
  FaList,
  FaHome,
  FaBuilding,
  FaTree,
  FaCogs,
  FaBookmark,
} from "react-icons/fa";
import {
  FiStar,
  FiLayers,
  FiHelpCircle,
  FiUsers,
  FiTarget,
  FiEye,
  FiThumbsUp,
  FiBriefcase,
  FiInfo,
  FiPhoneCall,
  FiFile
} from "react-icons/fi";
import { MdSettingsApplications } from "react-icons/md";
import { AiFillFileText } from "react-icons/ai";
import { IoLocation } from "react-icons/io5";


export const menuItems = [
  // { key: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { key: "", label: "Property Owners Management", icon: FaUserShield },
  { key: "guest-management", label: "Client Management", icon: FaUserFriends },
  {
    key: "listings",
    label: "Listing",
    icon: FaList,
    children: [
      { key: "listing/rent", label: "Rent", icon: FaHome },
      { key: "listing/sell", label: "Sell", icon: FaBuilding },

    ],
  },
  {
    key: "bookings",
    label: "Booking",
    icon: FaBookmark,
    children: [
      { key: "booking/rent", label: "Rent", icon: FaHome },

      { key: "booking/sell", label: "Sell", icon: FaTree },
    ],
  },
  { key: "contact_us", label: "Contact Us", icon: FiPhoneCall },
  // { key: "payment", label: "Payment", icon: FaMoneyCheckAlt },
  {
    key: "staff-management",
    label: "Staff Management",
    icon: MdSettingsApplications,
  },
  {
    key: "company",
    label: "Company Contacts Info",
    icon: FiPhoneCall
  },
  {
    key: "testimonial",
    label: "Testimonial",
    icon: FiFile
  },
  {
    key: "content_management",
    label: "Content Management",
    icon: AiFillFileText,
    children: [
      // { key: "content/feature", label: "Feature", icon: FiStar },
      { key: "content/banner", label: "banner", icon: FiStar },
      { key: "content/category", label: "Category", icon: FiLayers },
      { key: "content/sub-category", label: "SubCategory", icon: FiHelpCircle },
      { key: "content/amenity", label: "Amenity", icon: FaCogs },
      { key: "content/location", label: "Location", icon: IoLocation },
      { key: "content/blog-management", label: "Blog", icon: FaBlog },
      { key: "content/hosting_guide", label: "Hosting Guide", icon: FaMoneyCheckAlt },
      { key: "content/partners", label: "Sister Concern", icon: FiTarget },
      { key: "content/vision", label: "Vision", icon: FiEye },
      { key: "content/mission", label: "Mission", icon: FiEye },
      // { key: "content/team_members", label: "Team", icon: FiUsers },
      {
        key: "content/why_choose_us",
        label: "Why Choose Us",
        icon: FiThumbsUp,
      },
      // { key: "content/partners", label: "Partners", icon: FiBriefcase },
      { key: "content/about_us", label: "About Us", icon: FiInfo },
      // { key: "content/amenities", label: "Amenities", icon: FaCogs },

    ],


  },
  {
    key: "configurations",
    label: "Configurations",
    icon: FaCogs,
    children: [
      { key: "configurations/aminities", label: "Aminities", icon: FaCogs },
      { key: "configurations/filters", label: "Filters", icon: FaUserShield },

    ],
  },
  {
    key: "earnings",
    label: "Earnings",
    icon: FaDollarSign,

  }
];
