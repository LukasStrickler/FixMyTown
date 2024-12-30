"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/dictionaries/dictionary";

interface VerifyTokenInputProps {
    dictionary: Dictionary;
}

export function VerifyTokenInput({ dictionary }: VerifyTokenInputProps) {
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleVerification = async () => {
        try {
            setIsLoading(true);
            const emailParam = new URLSearchParams(window.location.search).get("email");
            const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
            const decodedEmail = emailParam ? decodeURIComponent(emailParam) : "";

            // Construct the verification URL similar to the email link
            const verificationUrl = `/api/auth/callback/resend?` + new URLSearchParams({
                callbackUrl: callbackUrl ?? "/",
                token: token,
                email: decodedEmail
            }).toString();

            // Redirect to the verification URL
            window.location.href = verificationUrl;

        } catch (error) {
            console.error("Verification error:", error);
            if (error instanceof Error) {
                router.push(`/error?error=Verification&message=${encodeURIComponent(error.message)}`);
            } else {
                router.push("/error?error=Verification");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-center">
                {dictionary.pages.auth.verifyRequest.enterCode}
            </p>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder={dictionary.pages.auth.verifyRequest.enterCodeInput}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleVerification();
                        }
                    }}
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleVerification}
                    disabled={!token || isLoading}
                >
                    {isLoading ? "..." : dictionary.pages.auth.verifyRequest.verifyButton}
                </Button>
            </div>
        </div>
    );
}       