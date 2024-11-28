"use client";

import { useState } from "react";
import { type Locale } from "@/i18n-config";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import LocationPicker from "@/components/LocationPicker/LocationPicker";
import type { Location, Address } from "@/components/LocationPicker/LocationPicker";

export default function DevPage({
    params: { lang },
}: {
    params: { lang: Locale };
}) {
    const [location, setLocation] = useState<Location | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address>({ displayName: '' });

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Development Page</h1>
                <p className="text-muted-foreground">
                    Test and preview components in development.
                </p>
            </div>
            <Separator />


            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Location Picker</CardTitle>
                        <Badge variant={isLocked ? "success" : "secondary"}>
                            {isLocked ? "Locked" : "Unlocked"}
                        </Badge>
                    </div>
                    <CardDescription>
                        Interactive map component for selecting and managing locations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <LocationPicker
                            onLocationSelected={setLocation}
                            onLockStatusChange={setIsLocked}
                            onAddressChange={setCurrentAddress}
                        />
                    </div>
                </CardContent>
            </Card>

            {location && (
                <Card>
                    <CardHeader>
                        <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p>Status: {isLocked ? "Locked" : "Unlocked"}</p>
                            <p>Address: {currentAddress.displayName}</p>
                            <p>Coordinates: {location?.lat}, {location?.lng}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

        </div >
    );
}
