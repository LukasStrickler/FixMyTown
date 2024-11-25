"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function VerifyTokenInput() {
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
                callbackUrl: callbackUrl || "/",
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
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <p className="text-sm text-muted-foreground text-center">
                Enter the verification code from your email
            </p>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter verification code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleVerification}
                    disabled={!token || isLoading}
                >
                    {isLoading ? "Verifying..." : "Verify"}
                </Button>
            </div>
        </div>
    );
} 