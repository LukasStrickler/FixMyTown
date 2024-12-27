import React from 'react';
import { Body, Container, Preview, Tailwind } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailCreationContent from '@/components/email/mailCreationContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';
import type { Dictionary } from '@/dictionaries/dictionary';
import de from '@/dictionaries/de.json';

interface ModularCreationTemplateProps {
    data: {
        firstName: string;
        title: string;
        link: string;
    };
    dictionary: Dictionary;
}

const ModularCreationTemplate = ({
    data: { firstName, title, link },
    dictionary,
}: ModularCreationTemplateProps) => {
    return (
        <Tailwind>
            <Body className="bg-white font-sans text-center">
                <Preview>{dictionary.emails.creationNotification.mailData.preview}</Preview>
                <Container className="bg-white border border-gray-300 rounded-md mx-auto py-[12%] px-[6%]">
                    <MailHeader />
                    <MailCreationContent
                        firstName={firstName}
                        title={title}
                        dictionary={dictionary}
                    />
                    <MailGenericButton label={dictionary.common.seeDetails} link={link} />
                    <MailFooter dictionary={dictionary} />
                </Container>
            </Body>
        </Tailwind>
    );
};

ModularCreationTemplate.PreviewProps = {
    data: {
        firstName: "Max",
        title: "seltsame Flüssigkeit tritt aus BASF-Fabrik aus",
        link: "https://fixmy.town/issues/12345",
    },
    dictionary: de as Dictionary,
} as ModularCreationTemplateProps;

export default ModularCreationTemplate;
