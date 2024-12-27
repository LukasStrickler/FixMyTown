"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import type { Dictionary } from '@/dictionaries/dictionary';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

interface MapContentProps {
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
    worker?: boolean;
}

export const createSvgContent = (typeId: number, prioId: number, statusId: number, restrictTo = 'all'): string => {
    // Size based on priority (0: unset, 1: small, 2: medium, 3: large)
    const size = restrictTo === 'all' || restrictTo === 'size'
        ? 24 + (prioId * 8)
        : 32; // Default size if size is not included

    // Color based on status
    const color = restrictTo === 'all' || restrictTo === 'color'
        ? `hsl(${(statusId * 100) % 360} 40% 40%)`
        : 'hsl(223 40% 40%)'; // Default blue-ish color if color is not included

    // Different shapes for the center based on type
    const innerShapes = {
        1: `<circle cx="12" cy="10" r="3"/>`, // Circle
        2: `<rect x="9" y="7" width="6" height="6"/>`, // Square
        3: `<polygon points="12 7 15 13 9 13"/>`, // Triangle
    };

    const innerShape = restrictTo === 'all' || restrictTo === 'shape'
        ? (innerShapes[typeId as keyof typeof innerShapes] || innerShapes[1])
        : ''; // No inner shape if shape is not included

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="hsl(0 0% 100%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            ${innerShape}
        </svg>
    `;
};

export const createCustomIcon = (typeId: number, prioId: number, statusId: number, restrictTo = 'all') => {
    const svgContent = createSvgContent(typeId, prioId, statusId, restrictTo);
    const iconHtml = document.createElement('div');
    iconHtml.innerHTML = svgContent;

    return divIcon({
        html: iconHtml.innerHTML,
        className: 'custom-marker-icon',
        iconSize: [24 + (prioId * 8), 24 + (prioId * 8)],
        iconAnchor: [(24 + (prioId * 8)) / 2, 24 + (prioId * 8)],
    });
};

export default function MapContent({
    reports,
    dictionary,
    worker
}: MapContentProps) {
    const router = useRouter()
    const defaultCenter = [49.4804, 8.4459] as const;
    const center = reports.length > 0 && reports[0]
        ? [reports[0].report.latitude, reports[0].report.longitude] as const
        : defaultCenter;

    return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-border">
            <MapContainer
                center={[center[0], center[1]]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {reports.map((report) => (
                    <Marker
                        key={report.report.id}
                        position={[report.report.latitude, report.report.longitude]}
                        icon={createCustomIcon(
                            report.typeId,
                            report.prioId,
                            report.protocols[report.protocols.length - 1]?.statusId ?? 0
                        )}
                    >
                        <Popup minWidth={300}>
                            <div className="space-y-2 p-1">
                                <div className="grid grid-cols-[auto,1fr] gap-x-2 text-sm">
                                    <span className="font-medium">ID:</span>
                                    <span>{report.report.id}</span>

                                    <span className="font-medium">{dictionary.reportTable.columns.name}:</span>
                                    <span>{report.report.name}</span>

                                    {report.report.description && (
                                        <>
                                            <span className="font-medium">{dictionary.reportTable.columns.description}:</span>
                                            <span className="break-words">{report.report.description}</span>
                                        </>
                                    )}

                                    <span className="font-medium">{dictionary.reportTable.columns.type}:</span>
                                    <span>
                                        {dictionary.metadata?.types?.[report.typeId.toString() as keyof typeof dictionary.metadata.types]?.name}
                                    </span>
                                    <span className="font-medium">{dictionary.reportTable.columns.status}:</span>
                                    <span>
                                        {dictionary.metadata?.statuses?.[(report.protocols[report.protocols.length - 1]?.statusId ?? 0).toString() as keyof typeof dictionary.metadata.statuses]?.name}
                                    </span>

                                    <span className="font-medium">{dictionary.reportTable.columns.pictures}:</span>
                                    <span>{report.pictures.length}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-2 text-foreground hover:text-foreground"
                                    onClick={() => router.push(worker ? `/worker/report/details/${report.report.id}` : `/myReports/${report.report.id}`)}
                                >
                                    {dictionary.common.seeDetails}
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
} 