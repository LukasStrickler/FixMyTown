import React from 'react';
import { Text, Heading, Section } from '@react-email/components';
import type { Dictionary } from '@/dictionaries/dictionary';

type MailAuthContentProps = {
    authCode: string;
    dictionary: Dictionary;
};

const MailAuthContent: React.FC<MailAuthContentProps> = ({
    authCode,
    dictionary,
}) => {
    return (
        <Section>
            <Heading className="font-bold text-[33px] text-center mb-2">
                {dictionary.emails.magicLink.content.heading}
            </Heading>
            <Text className="text-center text-[#666] text-sm mb-4">
                {dictionary.emails.magicLink.content.codeInstructions}
            </Text>
            <div className="bg-black/5 rounded mx-auto my-4 text-center w-[320px] max-w-full">
                <Heading className="text-black inline-block py-2 w-full text-center tracking-[8px]">
                    {authCode}
                </Heading>
            </div>
        </Section>
    );
};

export default MailAuthContent;
