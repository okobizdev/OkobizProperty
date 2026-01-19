
"use client";

import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { companyContactInfo } from "@/services/contact";

interface ContactData {
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
}

const ContactInfo = () => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await companyContactInfo();
        if (response.success && response.data) {
          setContactData(response.data);
        } else {
          // Don't set error for missing data, just set contactData to null
          setContactData(null);
        }
      } catch (err) {
        // Only set error for actual network/API errors
        console.error("Error fetching contact info:", err);
        setContactData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#F3F2F1] py-10 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F2F1] py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto text-start mb-10">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Contact Information
        </h1>
        <p className="text-gray-600 text-[18px] tracking-wider">
          Say something to start a live chat!
        </p>
      </div>

      <div className="w-full mx-auto flex flex-col gap-6">
        {/* Phone 1 */}
        <div className="flex items-start gap-4">
          <PhoneOutlined className="text-2xl text-primary mt-1" />
          <div>
            {contactData?.mobile ? (
              <a
                href={`tel:${contactData.mobile}`}
                className="text-gray-700 font-medium hover:underline"
              >
                {contactData.mobile}
              </a>
            ) : (
              <span className="text-gray-500 italic">Phone number not set</span>
            )}
          </div>
        </div>

        {/* Phone 2 (WhatsApp) */}
        <div className="flex items-start gap-4">
          <PhoneOutlined className="text-2xl text-primary mt-1" />
          <div>
            {contactData?.whatsapp ? (
              <a
                href={`tel:${contactData.whatsapp}`}
                className="text-gray-700 font-medium hover:underline"
              >
                {contactData.whatsapp}
              </a>
            ) : (
              <span className="text-gray-500 italic">WhatsApp number not set</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <MailOutlined className="text-2xl text-primary mt-1" />
          <div>
            {contactData?.email ? (
              <a
                href={`mailto:${contactData.email}`}
                className="text-gray-700 font-medium hover:underline"
              >
                {contactData.email}
              </a>
            ) : (
              <span className="text-gray-500 italic">Email address not set</span>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4">
          <EnvironmentOutlined className="text-2xl text-primary mt-1" />
          <div>
            {contactData?.address ? (
              <a
                href="https://www.google.com/maps/place/okobiz/@23.7972115,90.3625796,17z/data=!4m14!1m7!3m6!1s0x3755c1e644909821:0x836c818959d4dc29!2sokobiz!8m2!3d23.7972115!4d90.3651599!16s%2Fg%2F11y63w0v2s!3m5!1s0x3755c1e644909821:0x836c818959d4dc29!8m2!3d23.7972115!4d90.3651599!16s%2Fg%2F11y63w0v2s?entry=ttu&g_ep=EgoyMDI1MDgxOC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 font-medium hover:underline"
              >
                {contactData.address}
              </a>
            ) : (
              <span className="text-gray-500 italic">Address not set</span>
            )}
          </div>
        </div>

        {/* Professional message when no data is available */}
        {!contactData && (
          <div className="text-center mt-8 p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Professional Company Contact Information
            </h3>
            <p className="text-gray-600">
              Our contact information is currently being updated. Please check back soon or contact us through our inquiry form.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
