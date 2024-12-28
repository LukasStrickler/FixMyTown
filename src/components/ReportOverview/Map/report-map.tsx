"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { Dictionary } from '@/dictionaries/dictionary';
import { Skeleton } from "@/components/ui/skeleton";
import Legend from './map-legend';
import { useState, useMemo } from 'react';

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
            <Skeleton className="w-full h-[620px] rounded-lg" />
        )
    }
);

export default function ReportMap({
    reports,
    dictionary,
    height = '620px',
    worker = false,
}: ReportMapProps) {
    const [filters, setFilters] = useState({
        types: new Set(Object.keys(dictionary.metadata.types).map(Number)),
        statuses: new Set(Object.keys(dictionary.metadata.statuses).map(Number)),
        prios: new Set(Object.keys(dictionary.metadata.prios).map(Number))
    });

    const handleFilterChange = (category: 'types' | 'statuses' | 'prios', id: number, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            [category]: checked
                ? new Set(prev[category]).add(id)
                : new Set([...prev[category]].filter(x => x !== id))
        }));
    };

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const typeMatch = filters.types.has(report.typeId);
            const prioMatch = filters.prios.has(report.prioId);
            const statusMatch = report.protocols.length === 0 ||
                filters.statuses.has(report.protocols[report.protocols.length - 1]?.statusId ?? 0);
            return typeMatch && prioMatch && statusMatch;
        });
    }, [reports, filters]);

    return (
        <div style={{ '--map-height': height } as React.CSSProperties}>
            <div className="flex gap-4">
                <div className="flex-1">
                    <MapWithNoSSR
                        reports={filteredReports}
                        dictionary={dictionary}
                        worker={worker}
                    />
                </div>
                <div className="w-[250px]">
                    <Legend
                        dictionary={dictionary}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>
            </div>
        </div>
    );
} 