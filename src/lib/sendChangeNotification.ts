import { resend } from "@/server/email";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Dictionary } from '@/dictionaries/dictionary';
import ModularNotificationTemplate from "@/emails/modularNotificationTemplate";

interface ChangeNotificationParams {
    firstName: string;
    title: string;
    status: string;
    status_color: string;
    link: string;
    dictionary: Dictionary;
    provider: {
        from: string; // Sender's email
    };
    recipient: string; // Recipient's email
}

export async function sendChangeNotification(params: ChangeNotificationParams) {
    const { firstName, title, status, status_color, link, dictionary, provider, recipient } = params;

    let lang: Locale = 'de'; // Default language
    // You can add logic here to determine the language if needed

    const subject = dictionary.emails.statusUpdate.mailData.subject ?? "Status Update Notification";

    await resend.emails.send({
        from: provider.from, // Use the sender's email from provider
        to: recipient, // Use the recipient's email
        subject: subject,
        react: ModularNotificationTemplate({
            data: {
                firstName,
                title,
                status,
                status_color,
                link,
            },
            dictionary,
        }),
    });
}
