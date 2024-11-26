import { resend } from "@/server/email"

import MagicLinkEmail from "@/emails/magic-links"

interface VerificationRequestParams {
    identifier: string
    provider: {
        from: string
    }
    url: string
}


export async function sendVerificationRequest(params: VerificationRequestParams) {
    const { identifier: to, provider, url } = params

    try {
        const { error } = await resend.emails.send({
            from: provider.from,
            to: to,
            subject: `Ihr Anmeldelink für FixMyTown`,
            react: MagicLinkEmail({ magicLink: url }),
        })

        if (error) {
            throw new Error(`Error sending verification email: ${error instanceof Error ? error.message : JSON.stringify(error)}`)
        }
    } catch (error) {
        throw new Error(`Error sending verification email: ${error instanceof Error ? error.message : JSON.stringify(error)}`)
    }
}