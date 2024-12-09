"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { Dictionary } from '@/dictionaries/dictionary';

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
    metadata: {
        statuses: Record<number, { name: string }>;
        types: Record<number, { name: string }>;
        prios: Record<number, { name: string }>;
    };
    dictionary: Dictionary;
    height?: string;
}

const MapWithNoSSR = dynamic(
    () => import('./map-content'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border bg-muted animate-pulse" />
        )
    }
);

export default function ReportMap({
    reports,
    metadata,
    dictionary,
    height = '400px'
}: ReportMapProps) {
    return (
        <div style={{ '--map-height': height } as React.CSSProperties}>
            <MapWithNoSSR
                reports={reports}
                metadata={metadata}
                dictionary={dictionary}
            />
        </div>
    );
} 