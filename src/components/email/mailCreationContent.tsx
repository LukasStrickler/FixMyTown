import React from 'react';
import { Text, Heading, Section } from '@react-email/components';
import { type Dictionary } from '@/dictionaries/dictionary';

type MailCreationContentProps = {
    firstName: string;
    title: string;
    dictionary: Dictionary;
};

const MailCreationContent: React.FC<MailCreationContentProps> = ({
    firstName,
    title,
    dictionary,
}) => {
    return (
        <Section>
            <Heading className="font-bold text-[33px] text-center mb-2">
                {dictionary.emails.creationNotification.content.greeting.replace('{firstName}', firstName)}
            </Heading>
            <Text className="text-center text-gray-600 text-base mb-4">
                {dictionary.emails.creationNotification.content.reportReceived}
            </Text>
            <Text className="font-bold italic text-center text-[23px] mb-4 leading-relaxed">
                {title}
            </Text>
            <Text className="text-center text-gray-600 text-base mb-4">
                {dictionary.emails.creationNotification.content.thankYou}
                <br />
                {dictionary.emails.creationNotification.content.promise}
            </Text>
        </Section>
    );
};

export default MailCreationContent;
