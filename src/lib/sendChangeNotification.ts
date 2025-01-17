import { resend } from "@/server/email";
import type { Dictionary } from '@/dictionaries/dictionary';
import ModularNotificationTemplate from "@/emails/modularNotificationTemplate";
import { env } from "@/env";

interface ChangeNotificationParams {
    firstName: string;
    title: string;
    status: string;
    status_color: string;
    link: string;
    dictionaries: Dictionary[];
    recipient: string;
}

export async function sendChangeNotification(params: ChangeNotificationParams) {
    const { firstName, title, status, status_color, link, dictionaries, recipient } = params;

    const emailSafeColor = status_color.startsWith('#') ? status_color : `#${status_color}`;

    const subject = dictionaries[0]?.emails?.statusUpdate?.mailData?.subject ?? "Status Update Notification";

    await resend.emails.send({
        from: env.RESEND_FROM,
        to: recipient,
        subject: subject,
        react: ModularNotificationTemplate({
            data: {
                firstName,
                title,
                status,
                status_color: emailSafeColor,
                link,
            },
            dictionaries,
        }),
    });
}
