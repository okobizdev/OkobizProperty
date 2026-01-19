"use client";
import React, { useEffect, useState } from "react";
import { apiBaseUrl } from "@/config/config";
import TeamMemberCard, { TeamMember } from "./TeamMemberCard";


type ApiResponse = {
    status: string;
    message?: string;
    data: TeamMember[];
};

const TeamMembers: React.FC = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiBaseUrl}/admin/team`);
                if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
                const json: ApiResponse = await res.json();
                if (mounted) {
                    setMembers(json.data || []);
                }
            } catch (err: any) {
                console.error(err);
                if (mounted) setError(err.message || "Something went wrong");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchMembers();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Team Members</h2>
                <p className="text-gray-500 mt-1">Meet the people behind your property business</p>
            </header>

            {loading ? (
                <div className="grid place-items-center py-24">
                    <div className="animate-pulse text-center text-gray-400">
                        <div className="h-4 w-40 bg-gray-200 rounded mb-2 mx-auto" />
                        <div className="h-4 w-64 bg-gray-200 rounded mx-auto" />
                    </div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : members.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No team members found.</div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {members.map((m) => (
                        <TeamMemberCard key={m._id} member={m} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default TeamMembers;
