import React from 'react';
import { Img, Heading } from '@react-email/components';

const MailHeader: React.FC = () => {
  return (
    <div className="mx-auto text-center max-w-[480px]">
      <Img
        src={process.env.NODE_ENV === 'development' ? 'http://localhost:3000/FixMyTown_logo.png' : 'https://fixmy.town/FixMyTown_logo.png'}
        alt="logo"
        className="w-full max-w-[350px] block mx-auto"
      />
      {/* eslint-disable i18next/no-literal-string */}
      <Heading
        as="h1"
        className="font-bold text-lg text-center pt-5"
      >
        FixMy<span>.</span>Town
      </Heading>
      {/* eslint-enable i18next/no-literal-string */}
    </div>
  );
};

export default MailHeader;
