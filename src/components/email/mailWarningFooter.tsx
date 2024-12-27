import React from 'react';
import { Text, Link } from '@react-email/components';
import type { Dictionary } from '@/dictionaries/dictionary';

interface MailWarningFooterProps {
  dictionary: Dictionary;
}

const MailWarningFooter: React.FC<MailWarningFooterProps> = ({ dictionary }) => {
  return (
    <div>
      <Text className="text-center text-gray-500 text-xs mb-4">
        {dictionary.emails.magicLink.content.disclaimerText1}
        <br />
        {dictionary.emails.magicLink.content.disclaimerText2}
        <Link
          href="mailto:support@fixmy.town"
          className="text-gray-600 underline"
        >
          {dictionary.emails.magicLink.content.disclaimerLink}
        </Link>
        {" "}{dictionary.emails.magicLink.content.disclaimerText3}
      </Text>
    </div>
  );
};

export default MailWarningFooter;