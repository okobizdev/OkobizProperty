"use client";

import PropertyEditForm from "@/components/listing/PropertyEditForm";
import { useRouter, useParams } from "next/navigation";



export default function EditPropertyPage() {
    const router = useRouter();
    const { id } = useParams();
    return (
        <PropertyEditForm
            propertyId={id as string}
            onUpdateSuccess={() => {
                router.push('/host-dashboard/listed-properties');
            }}
        />
    );
}