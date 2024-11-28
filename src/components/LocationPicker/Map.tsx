"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { LatLng, Marker as LeafletMarker } from 'leaflet';
import { divIcon } from 'leaflet';
import { Button } from "@/components/ui/button";
import { Lock, Unlock, X } from "lucide-react";
import type { Location, Address } from './LocationPicker';
import type { Dictionary } from '@/dictionaries/dictionary';

interface MapProps {
    onLocationSelected?: (location: Location) => void;
    initialLocation: Location;
    onLockStatusChange?: (isLocked: boolean) => void;
    onAddressChange?: (address: Address) => void;
    dictionary: Dictionary;
}

const createCustomIcon = () => {
    const iconHtml = document.createElement('div');
    iconHtml.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="hsl(223 40% 40%)" stroke="hsl(0 0% 100%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

    return divIcon({
        html: iconHtml.innerHTML,
        className: 'custom-marker-icon',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    });
};

function DraggableMarker({ position, onPositionChange, address, isLocked, dictionary }: {
    position: LatLng;
    onPositionChange?: (pos: LatLng) => void;
    address: Address;
    isLocked: boolean;
    dictionary: Dictionary;
}) {
    const [draggable, setDraggable] = useState(true);
    const markerRef = useRef<LeafletMarker | null>(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null && onPositionChange) {
                    onPositionChange(marker.getLatLng());
                }
            },
        }),
        [onPositionChange],
    );

    useEffect(() => {
        setDraggable(!!onPositionChange);
    }, [onPositionChange]);

    return (
        <Marker
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={createCustomIcon()}>
            <Popup minWidth={300}>
                <div className="space-y-2 p-1">
                    <div className="grid grid-cols-[auto,1fr] gap-x-2 text-sm">
                        <span className="font-medium">{dictionary.components.locationPicker.info.latitude}:</span>
                        <span>{position.lat.toFixed(5)}</span>

                        <span className="font-medium">{dictionary.components.locationPicker.info.longitude}:</span>
                        <span>{position.lng.toFixed(5)}</span>

                        <span className="font-medium">{dictionary.components.locationPicker.info.address}:</span>
                        <span className="break-words">{address.displayName}</span>

                        <span className="font-medium">{dictionary.components.locationPicker.info.status}:</span>
                        <span className={`${isLocked ? 'text-orange-600' : 'text-green-600'}`}>
                            {isLocked ? dictionary.components.locationPicker.status.locked : dictionary.components.locationPicker.status.unlocked}
                        </span>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

export default function Map({
    onLocationSelected,
    initialLocation,
    onLockStatusChange,
    onAddressChange,
    dictionary
}: MapProps) {
    const [position, setPosition] = useState<LatLng | null>(null);
    const [address, setAddress] = useState<Address>({ displayName: '' });
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        onLockStatusChange?.(isLocked);
    }, [isLocked, onLockStatusChange]);

    useEffect(() => {
        onAddressChange?.(address);
    }, [address, onAddressChange]);

    const handleLocationUpdate = useCallback(async (latlng: LatLng) => {
        setPosition(latlng);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
            const data = await response.json() as { display_name?: string };
            const fetchedAddress = data.display_name ?? 'Address not found';
            setAddress({ displayName: fetchedAddress });
            onLocationSelected?.({
                lat: latlng.lat,
                lng: latlng.lng
            });
        } catch (error) {
            console.error('Error fetching address:', error);
            setAddress({ displayName: 'Error fetching address' });
            onLocationSelected?.({
                lat: latlng.lat,
                lng: latlng.lng
            });
        }
    }, [onLocationSelected]);

    const handleMapClick = useCallback((e: { latlng: LatLng }) => {
        if (!position && !isLocked) {
            void handleLocationUpdate(e.latlng);
        }
    }, [position, isLocked, handleLocationUpdate]);

    const handleClearLocation = () => {
        setPosition(null);
        setIsLocked(false);
        onLocationSelected?.({
            lat: 0,
            lng: 0
        });
        setAddress({ displayName: '' });
    };

    return (
        <div className="w-full space-y-2">
            <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
                <MapContainer
                    center={[initialLocation.lat, initialLocation.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {position && (
                        <DraggableMarker
                            position={position}
                            onPositionChange={!isLocked ? handleLocationUpdate : undefined}
                            address={address}
                            isLocked={isLocked}
                            dictionary={dictionary}
                        />
                    )}
                    <MapClickHandler onClick={handleMapClick} />
                </MapContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    onClick={() => setIsLocked(!isLocked)}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={!position}
                >
                    {isLocked ? (
                        <>
                            <Unlock className="h-4 w-4" />
                            <span>{dictionary.components.locationPicker.actions.unlock}</span>
                        </>
                    ) : (
                        <>
                            <Lock className="h-4 w-4" />
                            <span>{dictionary.components.locationPicker.actions.lock}</span>
                        </>
                    )}
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleClearLocation}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={!position || isLocked}
                >
                    <X className="h-4 w-4" />
                    <span>{dictionary.components.locationPicker.actions.clear}</span>
                </Button>
            </div>
        </div>
    );
}

function MapClickHandler({ onClick }: { onClick: (e: { latlng: LatLng }) => void }) {
    useMapEvents({
        click: onClick
    });
    return null;
}