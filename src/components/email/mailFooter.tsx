import React from 'react';
import { Text } from '@react-email/components';
import type { Dictionary } from '@/dictionaries/dictionary';

interface MailFooterProps {
  dictionary: Dictionary;
}

const MailFooter: React.FC<MailFooterProps> = ({ dictionary }) => {
  return (
    <div>
      <Text className="text-center text-gray-500 text-xs mb-4">
        {dictionary.emails.signature.greeting}
        <br />
        {dictionary.emails.signature.team}
      </Text>
    </div>
  );
};

export default MailFooter;
