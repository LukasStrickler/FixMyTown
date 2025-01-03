import { resend } from "@/server/email";
import type { Dictionary } from '@/dictionaries/dictionary';
import ModularCreationTemplate from "@/emails/modularCreationTemplate";
import { env } from "@/env";

interface CreationNotificationParams {
    firstName: string;
    title: string;
    link: string;
    dictionary: Dictionary;
    recipient: string;
}

export async function sendCreationNotification(params: CreationNotificationParams) {
    const { firstName, title, link, dictionary, recipient } = params;

    const subject = dictionary.emails.creationNotification.mailData.subject;

    await resend.emails.send({
        from: env.RESEND_FROM,
        to: recipient,
        subject: subject,
        react: ModularCreationTemplate({
            data: {
                firstName,
                title,
                link,
            },
            dictionary,
        }),
    });
}
