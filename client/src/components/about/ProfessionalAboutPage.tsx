"use client";
import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl } from "@/config/config";

// Types for the API response
interface Service {
  title: string;
  description: string;
  image: string;
  features: string[];
  isActive: boolean;
  order: number;
  _id: string;
}

interface CompanyOverview {
  title: string;
  description: string;
  foundingYear: number;
  companySize: string;
  industry: string;
  headquarters: string;
  backgroundImage: string;
  _id: string;
}

interface CeoSpeech {
  title: string;
  content: string;
  videoUrl: string;
  ceoName: string;
  ceoPosition: string;
  ceoImage: string;
  _id: string;
}

interface AboutUsData {
  _id: string;
  services: Service[];
  companyOverview: CompanyOverview;
  ceoSpeech: CeoSpeech;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: AboutUsData;
}

const fetchAboutUs = async (): Promise<ApiResponse> => {
  const response = await fetch(`${apiBaseUrl}/about-us`);
  if (!response.ok) {
    throw new Error('Failed to fetch about us data');
  }
  return response.json();
};

const ProfessionalAboutUsPage = () => {
  const {
    data: aboutResponse,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["aboutUs"],
    queryFn: fetchAboutUs,
  });

  const aboutData = aboutResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium text-lg">Loading our story...</p>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to Load Content
          </h2>
          <p className="text-gray-600">
            We&apos;re having trouble loading our about page. Please try refreshing or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {aboutData.companyOverview && (
        <section className="relative  flex items-center justify-center overflow-hidden ">

          {aboutData.companyOverview.backgroundImage && (
            <div className="w-screen h-80 md:h-150 lg:h-220">
              <Image
                src={`${apiBaseUrl}/${aboutData.companyOverview.backgroundImage}`}
                alt="Company Background"
                fill
                className="object-fit"
                priority
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-purple-900/90"></div> */}
            </div>
          )}

          {!aboutData.companyOverview.backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
          )}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="w-full px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div
            className="text-gray-700 text-lg md:text-xl leading-relaxed  text-justify prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: aboutData?.companyOverview?.description
            }}
          />
        </div>
      </div>


    </div>
  );
};

export default ProfessionalAboutUsPage;