'use client';

import { type Dictionary } from "@/dictionaries/dictionary";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReportData } from "@/components/reporting/report";

const DynamicReportMap = dynamic(
    () => import("@/components/ReportOverview/Map/report-map"),
    {
        ssr: false,
        loading: () => (
            <div className="w-full">
                <Skeleton className="w-full h-[620px] rounded-lg" />
            </div>
        ),
    }
);

interface MapViewClientProps {
    reports: ReportData[];
    dictionary: Dictionary;
}

export default function MapViewClient({ reports, dictionary }: MapViewClientProps) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <div className="w-full p-4">
                <DynamicReportMap
                    reports={reports}
                    dictionary={dictionary}
                    worker={true}
                />
            </div>
        </main>
    );
} 