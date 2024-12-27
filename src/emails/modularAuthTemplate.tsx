import React from 'react';
import { Body, Container, Preview, Tailwind } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailAuthContent from '@/components/email/mailauthContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailWarningFooter from '@/components/email/mailWarningFooter';
import MailFooter from '@/components/email/mailFooter';
import type { Dictionary } from '@/dictionaries/dictionary';
import de from '@/dictionaries/de.json';

interface ModularAuthTemplateProps {
    authLink: string;
    dictionary: Dictionary;
}

const extractToken = (magicLink: string): string => {
    try {
        const url = new URL(magicLink);
        return url.searchParams.get("token") ?? "";
    } catch {
        return "";
    }
};

const ModularAuthTemplate = ({
    dictionary,
    authLink,
}: ModularAuthTemplateProps) => {
    return (
        <Tailwind>
            <Body className="bg-white font-sans text-center">
                <Preview>{dictionary.emails.magicLink.mailData.preview}</Preview>
                <Container className="bg-white border border-gray-300 rounded-md mx-auto py-[12%] px-[6%]">
                    <MailHeader />
                    <MailAuthContent
                        authCode={extractToken(authLink ?? "")}
                        dictionary={dictionary}
                    />
                    <MailGenericButton label="Bestätigen" link={authLink} />
                    <MailFooter dictionary={dictionary} />
                    <MailWarningFooter dictionary={dictionary} />
                </Container>
            </Body>
        </Tailwind>
    );
};

ModularAuthTemplate.PreviewProps = {
    authLink: "https://fixmy.town/api/auth/callback/resend?token=302cf15d-07f",
    dictionary: de as Dictionary,
} as ModularAuthTemplateProps;


export default ModularAuthTemplate;
