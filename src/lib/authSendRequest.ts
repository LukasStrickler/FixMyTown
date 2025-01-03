import { resend } from "@/server/email"

import { getDictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import ModularAuthTemplate from "@/emails/modularAuthTemplate"
import { logger } from "@/lib/logger"

interface VerificationRequestParams {
    identifier: string
    provider: {
        from: string
    }
    url: string
}


export async function sendVerificationRequest(params: VerificationRequestParams) {
    const { identifier: to, provider, url } = params

    let lang: Locale = 'de';
    try {
        const callbackUrl = new URL(url).searchParams.get('callbackUrl');
        if (callbackUrl) {
            const pathSegments = new URL(decodeURIComponent(callbackUrl)).pathname.split('/');
            if (pathSegments.length > 1 && pathSegments[1]) {
                lang = pathSegments[1] as Locale;
            }
        }
    } catch (error) {
        logger.warn('Failed to extract language from URL, using default:', error);
    }

    const dictionary = await getDictionary(lang);

    try {
        const { error } = await resend.emails.send({
            from: provider.from,
            to: to,
            subject: dictionary.emails.magicLink?.mailData?.subject ?? "Ihr Anmeldelink für FixMyTown",
            react: ModularAuthTemplate({
                authLink: url,
                dictionary: dictionary
            }),
        })

        if (error) {
            throw new Error(`Error sending verification email: ${error instanceof Error ? error.message : JSON.stringify(error)}`)
        }
    } catch (error) {
        throw new Error(`Error sending verification email: ${error instanceof Error ? error.message : JSON.stringify(error)}`)
    }
}