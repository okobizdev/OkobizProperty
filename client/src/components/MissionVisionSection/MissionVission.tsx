"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl } from "@/config/config";


// Types for Mission and Vision API responses
interface MissionData {
    _id: string;
    missionDescription: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface VisionData {
    _id: string;
    vissionDescription: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse<T> {
    status: string;
    message: string;
    data: T[];
}

// API functions
const fetchMission = async (): Promise<ApiResponse<MissionData>> => {
    const response = await fetch(`${apiBaseUrl}/admin/mission`);
    if (!response.ok) {
        throw new Error('Failed to fetch mission data');
    }
    return response.json();
};

const fetchVision = async (): Promise<ApiResponse<VisionData>> => {
    const response = await fetch(`${apiBaseUrl}/admin/vission`);
    if (!response.ok) {
        throw new Error('Failed to fetch vision data');
    }
    return response.json();
};

const MissionVisionSection = () => {
    // Fetch Mission data
    const {
        data: missionResponse,
        isLoading: missionLoading,
        error: missionError,
    } = useQuery({
        queryKey: ["mission"],
        queryFn: fetchMission,
    });

    // Fetch Vision data
    const {
        data: visionResponse,
        isLoading: visionLoading,
        error: visionError,
    } = useQuery({
        queryKey: ["vision"],
        queryFn: fetchVision,
    });

    // Extract the latest mission and vision data
    const missionData = missionResponse?.data?.[0];
    const visionData = visionResponse?.data?.[0];

    // Show loading state
    if (missionLoading || visionLoading) {
        return (
            <section className="py-16 lg:py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="h-8 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
                            <div className="w-20 h-1 bg-gray-200 mx-auto animate-pulse"></div>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-xl border-l-4 border-gray-200 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-xl border-l-4 border-gray-200 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state
    if (missionError && visionError) {
        return (
            <section className="py-16 lg:py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="bg-white p-8 rounded-xl border border-red-200">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-500 text-2xl">⚠</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Unable to load Mission & Vision
                            </h3>
                            <p className="text-gray-600">
                                Please check your connection and try again later.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if no data exists
    if (!missionData && !visionData) {
        return null;
    }

    return (
        <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-4xl font-bold text-gray-700 mb-6">
                            Our Purpose & Direction
                        </h2>
                        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                            Guided by our core mission and driven by our vision for the future
                        </p>
                        <div className="w-24 h-1.5 mx-auto rounded-full"></div>
                    </div>

                    {/* Mission & Vision Cards */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Mission Card */}
                        {missionData && (
                            <div className="group relative">
                                <div className="absolute inset-0 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative bg-white p-10 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-500">
                                    {/* Mission Header */}
                                    <div className="flex items-center mb-8">
                                        {/* <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-3xl text-blue-600">🎯</span>
                                        </div> */}
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-1">
                                                Our Mission
                                            </h3>
                                            <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Mission Content */}
                                    <div className="relative">
                                        <div className="absolute -left-4 top-0 w-1 h-full rounded-full"></div>
                                        <div
                                            className="text-gray-700 text-lg leading-relaxed pl-8"
                                            dangerouslySetInnerHTML={{
                                                __html: missionData.missionDescription,
                                            }}
                                        />
                                    </div>

                                    {/* Mission Footer */}
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            What drives us forward every day
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Vision Card */}
                        {visionData && (
                            <div className="group relative">
                                <div className="absolute inset-0  rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative bg-white p-10 rounded-2xl border border-indigo-100 hover:shadow-xl transition-all duration-500">
                                    {/* Vision Header */}
                                    <div className="flex items-center mb-8">
                                        {/* <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-3xl text-indigo-600">👁️</span>
                                        </div> */}
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-1">
                                                Our Vision
                                            </h3>
                                            <div className="w-12 h-1 bg-indigo-500 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Vision Content */}
                                    <div className="relative">
                                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-300 rounded-full"></div>
                                        <div
                                            className="text-gray-700 text-lg leading-relaxed pl-8"
                                            dangerouslySetInnerHTML={{
                                                __html: visionData.vissionDescription,
                                            }}
                                        />
                                    </div>

                                    {/* Vision Footer */}
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                            Where we see ourselves tomorrow
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Optional Bottom Section */}
                    {missionData && visionData && (
                        <div className="mt-16 text-center">
                            <div className="inline-flex items-center px-8 py-4 bg-white rounded-full border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                                <span className="text-blue-600 mr-3">💡</span>
                                <span className="text-gray-700 font-medium">
                                    Together, our mission and vision shape everything we do
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MissionVisionSection;