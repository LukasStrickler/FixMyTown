import React from 'react';
import { Button } from '@react-email/components';

type MailGenericButtonProps = {
  label: string;
  link: string;
};

const MailGenericButton: React.FC<MailGenericButtonProps> = ({ label, link }) => {
  return (
    <Button
      href={link}
      className="bg-[#5e6ad2] rounded px-6 py-3 font-semibold text-white text-center no-underline inline-block my-[27px] mx-auto w-auto"
    >
      {label}
    </Button>
  );
};

export default MailGenericButton;
