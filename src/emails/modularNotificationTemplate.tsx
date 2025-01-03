import React from 'react';
import { Body, Container, Preview, Tailwind } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailNotificationContent from '@/components/email/mailNotificationContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';
import type { Dictionary } from '@/dictionaries/dictionary';
import de from '@/dictionaries/de.json';
import en from '@/dictionaries/en.json';
interface ModularNotificationTemplateProps {
    data: {
        firstName: string;
        title: string;
        status: string;
        status_color: string;
        link: string;
    };
    dictionaries: Dictionary[];
}

const ModularNotificationTemplate = ({
    data: { firstName, title, status, status_color, link },
    dictionaries,
}: ModularNotificationTemplateProps) => {
    return (
        <>
            {dictionaries.map((dictionary, index) => (
                <React.Fragment key={index}>
                    <Tailwind>
                        <Body className="bg-white font-sans text-center">
                            <Preview>{dictionary.emails.statusUpdate.mailData.preview}</Preview>
                            <Container className="bg-white border border-gray-300 rounded-md mx-auto py-[32px] px-[8px]">
                                <MailHeader />
                                <MailNotificationContent
                                    firstName={firstName}
                                    status={status}
                                    title={title}
                                    status_color={status_color}
                                    dictionary={dictionary}
                                />
                                <MailGenericButton
                                    label={dictionary.emails.statusUpdate.content.learnMore}
                                    link={link}
                                />
                                <MailFooter dictionary={dictionary} />
                            </Container>
                        </Body>
                    </Tailwind>
                    {index < dictionaries.length - 1 && (
                        <div className="border-t-4 border-gray-300 my-6 mx-auto w-4/5 shadow-sm" />
                    )}
                </React.Fragment>
            ))}
        </>
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
    dictionaries: [de, en],
} as ModularNotificationTemplateProps;

export default ModularNotificationTemplate;
