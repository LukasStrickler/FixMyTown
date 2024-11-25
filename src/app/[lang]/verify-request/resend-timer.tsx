'use client';

import { useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { Button } from '@/components/ui/button';

interface VerifyRequestDictionary {
    auth: {
        verifyRequest: {
            resendIn: string;
            resend: string;
        };
    };
}

interface ResendTimerProps {
    dictionary: VerifyRequestDictionary;
}

export function ResendTimer({ dictionary }: ResendTimerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { email, callbackUrl } = useUrlParams();
    const { seconds, isActive, setSeconds, setIsActive } = useResendCountdown(30);
    const [cooldownPeriod, setCooldownPeriod] = useState(30);

    const handleResend = async () => {
        setIsLoading(true);

        try {
            const result = await signIn("resend", {
                email,
                redirect: false,
                callbackUrl: callbackUrl ?? "/"
            });

            if (result?.ok) {
                const newCooldown = cooldownPeriod * 2;
                setSeconds(newCooldown);
                setCooldownPeriod(newCooldown);
                setIsActive(true);
            } else {
                console.error("Resend verification email failed:", result?.error);
            }
        } catch (error) {
            console.error("Authentication error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleResend}
            disabled={isActive || isLoading}
            variant="default"
            size="sm"
            className="bg-transparent font-normal hover:bg-transparent disabled:opacity-100 text-black/80 hover:text-black/60 disabled:text-muted-foreground/60 disabled:hover:text-muted-foreground/60"
        >
            {isActive
                ? `${dictionary.auth.verifyRequest.resendIn} ${seconds}s`
                : dictionary.auth.verifyRequest.resend}
        </Button>
    );
}

function useUrlParams() {
    const [params, setParams] = useState<{ email: string | null, callbackUrl: string }>({ email: null, callbackUrl: "/" });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setParams({
            email: searchParams.get("email"),
            callbackUrl: searchParams.get("callbackUrl") ?? "/"
        });
    }, []);

    return params;
}

function useResendCountdown(initialSeconds: number) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((current) => current - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
        }

        return () => clearInterval(interval);
    }, [seconds, isActive]);

    return {
        seconds,
        isActive,
        setSeconds,
        setIsActive
    };
}   