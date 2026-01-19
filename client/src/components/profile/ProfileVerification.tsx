"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileServices } from "@/services/profile/profile.services";

const ProfileVerification = () => {
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await ProfileServices.processGetProfile();
        setAccountStatus(res?.data?.user?.accountStatus || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (accountStatus === null) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 mt-10">
      <div className="md:col-span-1">
        <div className="bg-white rounded-2xl p-6 flex flex-col items-start transition-all border border-black/10">
          {accountStatus === "active" ? (
            <div className="text-xl font-semibold text-green-600">
              ✅ Your Profile is Verified
            </div>
          ) : accountStatus === "pending" ? (
            <div className="text-xl font-semibold text-primary">
              ⏳ Your Profile is Under Review
            </div>
          ) : accountStatus === "suspended" ? (
            <div className="text-xl font-semibold text-primary">
              🚫 Your Account is Suspended
            </div>
          ) : accountStatus === "rejected" ? (
            <div className="text-xl font-semibold text-red-700">
              ❌ Your Profile has been Rejected
            </div>
          ) : (
            <>
              <div className="text-xl font-semibold text-red-600">
                ❌ Your Profile is Not Verified
              </div>

              <div className="text-xl text-gray-700 mt-5 font-semibold">
                Verify your identity
              </div>
              <div className="text-gray-700 mt-5 text-sm font-semibold">
                Before you book or host on Okobiz-Property, you need to complete
                this step.
              </div>
              <div className="relative group p-2 border border-gray-600 rounded-lg mt-5 transition-transform transform hover:scale-105 hover:border-blue-500 duration-300">
                <Link
                  href="/profile/verification"
                  className="text-gray-500 hover:text-blue-500 transition-colors duration-300 cursor-pointer px-5 py-2 inline-block"
                >
                  <span className="text-lg text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-300">
                    Get Verified
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileVerification;
