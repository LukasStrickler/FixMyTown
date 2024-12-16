"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { Dictionary } from '@/dictionaries/dictionary';
import { Skeleton } from "@/components/ui/skeleton";

interface ReportMapProps {
    reports: {
        report: {
            id: number;
            name: string;
            description: string | null;
            latitude: number;
            longitude: number;
            locationDescription: string | null;
        };
        protocols: {
            id: number;
            time: Date;
            statusId: number;
            comment: string | null;
        }[];
        pictures: {
            id: string;
            timestamp: Date;
        }[];
        typeId: number;
        prioId: number;
    }[];
    dictionary: Dictionary;
    height?: string;
    worker?: boolean;
}

const MapWithNoSSR = dynamic(
    () => import('./map-content'),
    {
        ssr: false,
        loading: () => (
            <Skeleton className="w-full h-[400px] rounded-lg" />
        )
    }
);

export default function ReportMap({
    reports,
    dictionary,
    height = '400px',
    worker = false,
}: ReportMapProps) {

    return (
        <div style={{ '--map-height': height } as React.CSSProperties}>
            <MapWithNoSSR
                reports={reports}
                dictionary={dictionary}
                worker={worker}
            />
        </div>
    );
} 