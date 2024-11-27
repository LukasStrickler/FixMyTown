import React from 'react';
import { Body, Container, Preview } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailMainContent from '@/components/email/mailMainContent';
import MailAuthButton from '@/components/email/mailAuthButton';
import MailFooter from '@/components/email/mailFooter';

type ModularAuthTemplateProps = {
  firstName: string;
  userPrompt: string;
  authCode: string;
  authLink: string;
  preview: string;
};

const ModularAuthTemplate: React.FC<ModularAuthTemplateProps> = ({
  firstName,
  userPrompt,
  authCode,
  authLink,
  preview,
}) => {
  return (
    <Body
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
        textAlign: "center",
      }}
    >
      <Preview>{preview}</Preview>
      <Container
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "5px",
          maxWidth: "480px",
          margin: "0 auto",
          padding: "12% 6%",
        }}
      >
        <MailHeader />
        <MailMainContent
          firstName={firstName}
          userPrompt={userPrompt}
          authCode={authCode}
        />
        <MailAuthButton label="Confirm" authLink={authLink} />
        <MailFooter />
      </Container>
    </Body>
  );
};

export default ModularAuthTemplate;
