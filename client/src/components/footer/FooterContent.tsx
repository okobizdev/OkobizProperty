import Image from "next/image";
import Link from "next/link";
import DownFooter from "./DownFooter/DownFooter";
import logo from "@/assets/logo/okobiz-property-logo2.png";

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blogs", href: "/blogs" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Important Links",
    links: [
      { label: "Rent", href: "/properties?listingType=rent" },
      { label: "Buy/sell", href: "/properties?listingType=sell" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-condition" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/share/179oCNqCJg/",
      },
      { label: "Youtube", href: "https://youtube.com/@okobiz_property" },
    ],
  },
  {
    title: "Payment Methods",
    links: [
      { label: "Bank Transfer", href: "#" },
      { label: "Bkash", href: "#" },
      { label: "SSLCommerz", href: "#" },
    ],
  },
];

const FooterContent = () => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Logo, Description, and Links */}
        <div className="lg:col-span-7">
          {/* Logo and Description */}
          <div className="mb-0">
            <Image
              src={logo}
              alt="Okobiz Logo"
              width={140}
              height={140}
              className="object-contain"
            />

          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-gray-900 mb-0 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-0.1">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      {["Company", "Important Links"].includes(section.title) ? (
                        <Link
                          href={link.href}
                          className="text-sm text-gray-600 hover:text-[#F15927] transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <Link
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-[#F15927] transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="lg:col-span-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">
            Find Us
          </h4>
          <div className="w-full h-38 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8974684234567!2d90.36257961536425!3d23.797211584569842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1e644909821%3A0x836c818959d4dc29!2sokobiz!5e0!3m2!1sen!2sbd!4v1694123456789!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Okobiz Location"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Click to open in Google Maps
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-900">
              okobizproperty.com
            </span>{" "}
            — All rights reserved.
          </p>
          <p className="mt-0.5">
            Developed by{" "}
            <a
              href="https://okobiz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F15927] hover:underline font-medium transition-colors duration-200"
            >
              okobiz
            </a>
          </p>
        </div>
      </div>

      <DownFooter />
    </div>
  );
};

export default FooterContent;