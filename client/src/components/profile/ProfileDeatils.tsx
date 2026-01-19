"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProfileServices } from "@/services/profile/profile.services";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  accountStatus: string;
  work: string;
  location: string;
  language: string;
  avatar: string;
}

const ProfileDetails = () => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await ProfileServices.processGetProfile();
        console.log("Profile response: >>>>>", res);
        const userData = res?.data;

        if (!userData) {
          setError("No user data found");
          return;
        }

        setUser({
          name: userData?.user?.name,
          email: userData?.user?.email,
          role: userData?.user?.role,
          isVerified: userData?.user?.isVerified,
          accountStatus: userData?.user?.accountStatus,
          work: userData?.worksAt || "",
          location: userData?.location || "",
          language: userData?.languages?.join(", ") || "",
          avatar: userData?.user?.avatar || "",
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  console.log("user >>>>>>", user);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16">
        <div className="md:col-span-1">
          <Skeleton height={300} />
        </div>
        <div className="md:col-span-2 space-y-6">
          <Skeleton height={40} width={200} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton height={80} />
            <Skeleton height={80} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton height={80} />
            <Skeleton height={80} />
          </div>
          <Skeleton height={100} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!user) {
    return <div className="text-gray-500 p-4">No user data available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16">
      {/* Left column - Avatar */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center transition-all border border-black/10">
          <div className="relative w-32 h-32 mb-4">
            {user.avatar ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${user.avatar}`}
                alt="Profile Avatar"
                fill
                className="rounded-full object-cover border-4 border-blue-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-500">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="text-3xl font-normal text-gray-800 capitalize">
            {user.name}
          </div>
          <div className="text-sm font-bold text-gray-800 capitalize">
            {user.role === "host" ? "Property Owner" : "Client"}
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <h3 className="text-3xl font-bold text-gray-700 capitalize">
              About {user.name}
            </h3>
            <div className="relative group p-2 border-1 border-gray-600 rounded-lg">
              <Link
                href="/profile/edit"
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                aria-label="Edit profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span className="text-sm font-medium">Edit Profile</span>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Work</p>
                <p className="text-gray-800">{user.work || "Not specified"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="text-gray-800">
                  {user.location || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Language</p>
                <p className="text-gray-800">
                  {user.language || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
