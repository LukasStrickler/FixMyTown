import React from 'react';
import { Text, Heading, Section } from '@react-email/components';
import { type Dictionary } from '@/dictionaries/dictionary';

type MailNotificationContentProps = {
    firstName: string;
    status: string;
    title: string;
    status_color: string;
    dictionary: Dictionary;
};

const MailNotificationContent: React.FC<MailNotificationContentProps> = ({
    firstName,
    status,
    title,
    status_color,
    dictionary,
}) => {
    return (
        <Section>
            <Heading className="font-bold text-[33px] text-center mb-2">
                {dictionary.emails.statusUpdate.content.greeting.replace('{firstName}', firstName)}
            </Heading>
            <Text className="text-center text-gray-600 text-base mb-4">
                {dictionary.emails.statusUpdate.content.reportTitle}
            </Text>
            <Text className="font-bold italic text-center text-[23px] mb-4 leading-relaxed">
                {title}
            </Text>
            <Text className="text-center text-gray-600 text-base mb-4">
                {dictionary.emails.statusUpdate.content.newStatus}
            </Text>
            <Text className={`font-bold text-[33px] text-center mb-2`} style={{ color: status_color }}>
                {status}
            </Text>
        </Section>
    );
};

export default MailNotificationContent;