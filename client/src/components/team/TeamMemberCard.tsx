"use client";
import React, { useState } from "react";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";

export type TeamMember = {
    _id: string;
    teamMemberName: string;
    teamMemberDesignation: string;
    teamMemberImage: string;
    createdAt?: string;
};

type Props = {
    member: TeamMember;
    fallbackSrc?: string;
};



const TeamMemberCard: React.FC<Props> = ({ member, fallbackSrc = "/placeholder-image.png" }) => {
    const [hasError, setHasError] = useState(false);


    return (
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden">
            <div className="p-5 flex flex-col items-center text-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-offset-2 ring-primary/20 mb-4">
                    <Image
                        src={hasError || !member.teamMemberImage ? apiBaseUrl + member.teamMemberImage : fallbackSrc}
                        alt={member.teamMemberName}
                        fill
                        sizes="112px"
                        className="object-cover"
                        onError={() => setHasError(true)}
                        priority={false}
                    />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">{member.teamMemberName}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.teamMemberDesignation}</p>

                {/* <div className="mt-4 flex items-center gap-3">
                    <button
                        type="button"
                        className="px-3 py-1.5 bg-primary text-white text-sm rounded-md shadow-sm hover:brightness-95 transition"
                    >
                        Message
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1.5 border border-gray-200 text-sm rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                        Profile
                    </button>
                </div> */}
            </div>
        </article>
    );
};

export default TeamMemberCard;
