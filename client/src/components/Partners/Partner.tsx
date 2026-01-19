
"use client";

import { apiBaseUrl } from '@/config/config';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';


interface Partner {
    _id: string;
    partnerImage: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface PartnerApiResponse {
    status: string;
    message: string;
    data: Partner[];
}

interface PartnersProps {
    apiBaseUrl?: string;
}

const Partners: React.FC<PartnersProps> = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPartners = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch(`${apiBaseUrl}/admin/partner`);

            if (!response.ok) {
                throw new Error('Failed to fetch partners');
            }

            const data: PartnerApiResponse = await response.json();

            if (data.status === 'success' && data.data) {
                setPartners(data.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);


    if (loading) {
        return (
            <div className="bg-white">
                <div className="max-w-6xl mx-auto ">
                    <div className="text-center">
                        <div className="text-center mb-0 lg:mb-6">
                            <h2 className="text-3xl md:text-4xl font-bold inline-block text-center p-2 rounded-sm bg-secondary text-primary uppercase tracking-wider">
                                Our Sister Concerns
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Loading partners...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/80 py-6 lg:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-center mb-4 lg:mb-6">
                            <h2 className="text-3xl md:text-4xl font-bold inline-block text-center p-2 rounded-sm bg-secondary text-primary mb-3 uppercase tracking-wider">
                                Our Sister Concerns
                            </h2>
                            <p className="text-lg text-red-600 max-w-2xl mx-auto">
                                Error loading partners: {error}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Don't render if no partners
    if (partners.length === 0) {
        return null;
    }

    return (
        <div className="bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="font-robo">
                    <div className="text-center">
                        <div className="text-center lg:mb-6">
                            <h2 className="text-3xl md:text-3xl font-bold inline-block text-center p-2 rounded-sm  text-gray-500  uppercase tracking-wider">
                                Our Sister Concerns
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Trusted Collaborators Driving Our Success
                            </p>
                        </div>
                        <div className="">
                            <Marquee
                                gradient={false}
                                speed={50}
                                pauseOnHover={true}
                                className="py-4"
                            >
                                {partners.map((partner: Partner) => (
                                    <div
                                        key={partner._id}
                                        className="flex-shrink-0 w-40 h-28 flex justify-center items-center mx-4 overflow-hidden"
                                    >
                                        <div className="rounded-lg h-[100px] w-full px-3 flex items-center justify-center border border-[#178843]/20 hover:border-[#178843]/40 transition-all">
                                            <Image
                                                src={`${apiBaseUrl}${partner.partnerImage}`}
                                                alt={`Partner ${partner._id}`}
                                                width={160}
                                                height={80}
                                                className="w-full max-h-[80px] object-contain"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "/placeholder-image.png";
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Marquee>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partners;