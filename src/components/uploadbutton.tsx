"use client";

import { UploadButton } from "@/lib/uploadthings";

interface ButtonUploadProps {
    onUploadComplete: (ids: string[]) => void;
}

export function ButtonUpload({ onUploadComplete }: ButtonUploadProps) {
    return (
        <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                const ids = res.map((file) => file.key);
                onUploadComplete(ids);
            }}
        />
    );
}
