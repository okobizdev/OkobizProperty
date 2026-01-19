
import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Login from "../pages/Login";
import Protected from "../components/Protected";
import PublicOnly from "../components/PublicOnly";
import GuestManagement from "../pages/GuestManagement";
import HostManagement from "../pages/HostManagement";
import BlogManagement from "../pages/BlogManagement";
import StaffManagement from "../pages/StaffManagement";
import TeamMembers from "../pages/TeamMembers";
import Mission from "../pages/Mission";
import Vission from "../pages/Vission";
import AboutUs from "../pages/AboutUs";
import Partners from "../pages/Partners";
import WhyChooseUs from "../pages/WhyChooseUs";
import ContactUs from "../pages/ContactUs";
import RoleProtected from "../components/RoleProtected";
import Location from "../pages/Location";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPasswordPage from "../pages/ResetPassword";
import BannerManager from "../pages/BannerManager";
import CategoryManager from "../pages/CategoryManager";
import SubCategoryManager from "../pages/SubCategoryManager";
import AmenityManager from "../pages/AmenitiManger";
import FiltersConfiguration from "../pages/FiltersConfiguration";
import AmenityConfigManager from "../pages/AminitiesConfigForm";
import PropertiesTable from "../pages/Property";
import BookingsTable from "../pages/BookingsTable";
import Earnings from "../components/earnings/EarningPage"
import EarningsRecords from "../components/earnings/PropertiesInformation";
import CompanyContactsManager from "../pages/CompanyContactsManager";
import EmailVerificationWithOtp from "../pages/emailVerification";
import TwoFactorLogin from "../pages/TwoFactorLogin";
import Testimonial from "../pages/Testimonial";
import HostingGuideManagement from "../pages/HostingGuideManagement";


const Routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicOnly>
        <Login />
      </PublicOnly>
    ),
  },
  {
    path: "/email-verification",
    element: (
      <PublicOnly>
        <EmailVerificationWithOtp />
      </PublicOnly>
    ),
  },
  {
    path: "/two-factor-auth",
    element: (
      <PublicOnly>
        <TwoFactorLogin />
      </PublicOnly>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnly>
        <ForgotPassword />
      </PublicOnly>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicOnly>
        <ResetPasswordPage />
      </PublicOnly>
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <Main />
      </Protected>
    ),
    children: [
      {
        path: "/",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            {/* <Dashboard /> */}
            <HostManagement />
          </RoleProtected>
        ),
      },

      {
        path: "/guest-management",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <GuestManagement />
          </RoleProtected>
        ),
      },
      {
        path: "/host-management",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <HostManagement />
          </RoleProtected>
        ),
      },
      {
        path: "/content/blog-management",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <BlogManagement />
          </RoleProtected>
        ),
      },
      {
        path: "/staff-management",
        element: (
          <RoleProtected allowedRoles={["admin"]}>
            <StaffManagement />
          </RoleProtected>
        ),
      },
      {
        path: "/company",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <CompanyContactsManager />
          </RoleProtected>
        ),
      },
      {
        path: "/testimonial",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <Testimonial />
          </RoleProtected>
        ),
      },

      {
        path: "/content/banner",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <BannerManager />
          </RoleProtected>
        ),
      },
      {
        path: "/content/category",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <CategoryManager />
          </RoleProtected>
        ),
      },
      {
        path: "/content/sub-category",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <SubCategoryManager />
          </RoleProtected>
        ),
      },

      {
        path: "/content/amenity",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <AmenityManager />
          </RoleProtected>
        ),
      },
      {
        path: "/content/location",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Location />
          </RoleProtected>
        ),
      },

      {
        path: "/content/team_members",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <TeamMembers />
          </RoleProtected>
        ),
      },
      {
        path: "/content/mission",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Mission />
          </RoleProtected>
        ),
      },
      {
        path: "/content/vision",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Vission />
          </RoleProtected>
        ),
      },
      {
        path: "/content/about_us",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <AboutUs />
          </RoleProtected>
        ),
      },
      {
        path: "/content/hosting_guide",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <HostingGuideManagement />
          </RoleProtected>
        ),
      },
      {
        path: "/content/partners",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Partners />
          </RoleProtected>
        ),
      },
      {
        path: "/content/why_choose_us",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <WhyChooseUs />
          </RoleProtected>
        ),
      },
      {
        path: "/contact_us",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <ContactUs />
          </RoleProtected>
        ),
      },
      {
        path: "/configurations/aminities",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <AmenityConfigManager />
          </RoleProtected>
        ),
      },

      {
        path: "/configurations/filters",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <FiltersConfiguration />
          </RoleProtected>
        ),
      },
      {
        path: "listing/rent",
        element: (
          <RoleProtected allowedRoles={["admin", "listingVerificationManager"]}>
            <PropertiesTable defaultListingType={"rent"} />
          </RoleProtected>
        ),
      },
      {
        path: "listing/sell",
        element: (
          <RoleProtected allowedRoles={["admin", "listingVerificationManager"]}>
            <PropertiesTable defaultListingType={"sell"} />
          </RoleProtected>
        ),
      },
      {
        path: "/booking/rent",
        element: (
          <RoleProtected allowedRoles={["admin"]}>
            <BookingsTable defaultListingType={"RENT"} />
          </RoleProtected>
        ),
      },
      {
        path: "/booking/sell",
        element: (
          <RoleProtected allowedRoles={["admin"]}>
            <BookingsTable defaultListingType={"SELL"} />
          </RoleProtected>
        ),
      },
      {
        path: "/earnings",
        element: (
          <RoleProtected allowedRoles={["admin", "financeManager"]}>
            <Earnings />
          </RoleProtected>
        ),
      },
      {
        path: "/earnings/records",
        element: (
          <RoleProtected allowedRoles={["admin", "financeManager"]}>
            <EarningsRecords />
          </RoleProtected>
        ),
      }

    ],

  },


]);

export default Routes;
