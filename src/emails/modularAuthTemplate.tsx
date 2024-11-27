import React from 'react';
import { Body, Container, Preview } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailAuthContent from '@/components/email/mailAuthContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';

type ModularAuthTemplateProps = {
  firstName: string;
  userPrompt: string;
  authLink: string;
  preview: string;
};

const extractToken = (magicLink: string): string => {
    try {
      const url = new URL(magicLink);
      return url.searchParams.get("token") ?? ""; 
    } catch {
      return "";
    }
  };
  
const ModularAuthTemplate: React.FC<ModularAuthTemplateProps> = ({
  firstName,
  userPrompt,
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
        <MailAuthContent
          firstName={firstName}
          userPrompt={userPrompt}
          authCode={extractToken(authLink ?? "")}
        />
        <MailGenericButton label="Confirm" authLink={authLink} />
        <MailFooter />
      </Container>
    </Body>
  );
};

export default ModularAuthTemplate;
