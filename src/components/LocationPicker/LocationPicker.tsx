"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
interface LocationPickerProps {
    onLocationSelected?: (location: { lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number };
    height?: string;
    onLockStatusChange?: (isLocked: boolean) => void;
    onAddressChange?: (address: Address) => void;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Address {
    displayName: string;
}

const MapWithNoSSR = dynamic(
    () => import('./Map'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full space-y-2">
                <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border bg-muted animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 rounded-md bg-muted animate-pulse" />
                    <div className="h-10 rounded-md bg-muted animate-pulse" />
                </div>
            </div>
        )
    }
);

export default function LocationPicker({
    onLocationSelected,
    initialLocation = { lat: 49.4804, lng: 8.4459 },
    height = '400px',
    onLockStatusChange,
    onAddressChange
}: LocationPickerProps) {
    return (
        <div style={{ '--map-height': height } as React.CSSProperties}>
            <MapWithNoSSR
                onLocationSelected={onLocationSelected}
                initialLocation={initialLocation}
                onLockStatusChange={onLockStatusChange}
                onAddressChange={onAddressChange}
            />
        </div>
    );
} 