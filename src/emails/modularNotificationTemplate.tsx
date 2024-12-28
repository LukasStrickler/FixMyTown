import React from 'react';
import { Body, Container, Preview, Tailwind } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailNotificationContent from '@/components/email/mailNotificationContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';
import type { Dictionary } from '@/dictionaries/dictionary';
import de from '@/dictionaries/de.json';

interface ModularNotificationTemplateProps {
    data: {
        firstName: string;
        title: string;
        status: string;
        status_color: string;
        link: string;
    };
    dictionary: Dictionary;
}

const ModularNotificationTemplate = ({
    data: { firstName, title, status, status_color, link },
    dictionary,
}: ModularNotificationTemplateProps) => {
    return (
        <Tailwind>
            <Body className="bg-white font-sans text-center">
                <Preview>{dictionary.emails.statusUpdate.mailData.preview}</Preview>
                <Container className="bg-white border border-gray-300 rounded-md mx-auto py-[12%] px-[6%]">
                    <MailHeader />
                    <MailNotificationContent
                        firstName={firstName}
                        status={status}
                        title={title}
                        status_color={status_color}
                        dictionary={dictionary}
                    />
                    <MailGenericButton label={dictionary.emails.statusUpdate.content.learnMore} link={link} />
                    <MailFooter dictionary={dictionary} />
                </Container>
            </Body>
        </Tailwind>
    );
};

ModularNotificationTemplate.PreviewProps = {
    data: {
        firstName: "Jane",
        title: "weird liquid leaking from BASF plant",
        status: "Resolved",
        status_color: "green",
        link: "https://fixmy.town/issues/12345",
    },
    dictionary: de as Dictionary,
} as ModularNotificationTemplateProps;

export default ModularNotificationTemplate;
