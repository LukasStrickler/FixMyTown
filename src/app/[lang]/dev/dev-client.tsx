"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LocationPicker from "@/components/LocationPicker/LocationPicker";
import type { Location, Address } from "@/components/LocationPicker/LocationPicker";
import { useDictionary } from "@/components/provider/dictionaryProvider";

function DevContent() {
    const { dictionary } = useDictionary();
    const [location, setLocation] = useState<Location | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address>({ displayName: '' });

    if (!dictionary) return null;
    const dict = dictionary.components.locationPicker;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{dict.title}</CardTitle>
                        <Badge variant={isLocked ? "success" : "secondary"}>
                            {isLocked ? dict.status.locked : dict.status.unlocked}
                        </Badge>
                    </div>
                    <CardDescription>
                        {dict.description}
                        <br />
                        {dict.help}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <LocationPicker
                            onLocationSelected={setLocation}
                            onLockStatusChange={setIsLocked}
                            onAddressChange={setCurrentAddress}
                            dictionary={dictionary}
                        />
                    </div>
                </CardContent>
            </Card>

            {location && (
                <Card>
                    <CardHeader>
                        <CardTitle>{dict.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p>{dict.info.status}: {isLocked ? dict.status.locked : dict.status.unlocked}</p>
                            <p>{dict.info.address}: {currentAddress.displayName}</p>
                            <p>{dict.info.latitude}: {location?.lat}, {dict.info.longitude}: {location?.lng}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export function DevPageClient() {
    return <DevContent />;
} 