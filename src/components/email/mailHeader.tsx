import React from 'react';
import { Img, Heading } from '@react-email/components';

const MailHeader: React.FC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "0 auto",
        maxWidth: "480px",
      }}
    >
      <Img
        src="https://projects.jstaehle.de/assets/images/hwg_only_temporary_FIXMYTOWN_logo.png"
        alt="logo"
        style={{
          width: "100%",
          maxWidth: "350px",
          display: "block",
          margin: "0 auto",
        }}
      />
      <Heading
        as="h1"
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          paddingTop: "20px",
        }}
      >
          FixMy<span>.</span>Town
      </Heading>
    </div>
  );
};

export default MailHeader;
