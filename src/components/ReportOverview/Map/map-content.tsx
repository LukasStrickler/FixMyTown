"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import type { Dictionary } from '@/dictionaries/dictionary';

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
    metadata: {
        statuses: Record<number, { name: string }>;
        types: Record<number, { name: string }>;
        prios: Record<number, { name: string }>;
    };
    dictionary: Dictionary;
}

const createCustomIcon = (typeId: number) => {
    // You could customize the icon color based on type
    const color = `hsl(${(typeId * 100) % 360} 40% 40%)`;
    const iconHtml = document.createElement('div');
    iconHtml.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="hsl(0 0% 100%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

    return divIcon({
        html: iconHtml.innerHTML,
        className: 'custom-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

export default function MapContent({
    reports,
    metadata,
    dictionary
}: MapContentProps) {
    // Calculate center based on reports or default to a central location
    const defaultCenter = [49.4804, 8.4459] as const;
    const center = reports.length > 0 && reports[0]
        ? [reports[0].report.latitude, reports[0].report.longitude] as const
        : defaultCenter;

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
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
                        icon={createCustomIcon(report.typeId)}
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
                                    <span>{metadata.types[report.typeId]?.name}</span>

                                    <span className="font-medium">{dictionary.reportTable.columns.status}:</span>
                                    <span>
                                        {metadata.statuses[report.protocols[report.protocols.length - 1]?.statusId ?? 0]?.name}
                                    </span>

                                    <span className="font-medium">{dictionary.reportTable.columns.pictures}:</span>
                                    <span>{report.pictures.length}</span>
                                </div>
                                <a
                                    href={`/reports/${report.report.id}`}
                                    className="block w-full mt-2 px-4 py-2 text-center text-sm text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                                >
                                    {dictionary.common.seeDetails}
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
} 