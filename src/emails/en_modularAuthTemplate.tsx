import React from 'react';
import { Body, Container, Preview } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailAuthContent from '@/components/email/en_mailAuthContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';

interface ModularAuthTemplateProps {
  firstName: string;
  userPrompt: string;
  authLink: string;
  preview: string;
}

const extractToken = (magicLink: string): string => {
    try {
      const url = new URL(magicLink);
      return url.searchParams.get("token") ?? ""; 
    } catch {
      return "";
    }
  };
  
  const ModularAuthTemplate = ({
    firstName,
    userPrompt,
    authLink,
    preview,
  }: ModularAuthTemplateProps) => {
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
        <MailGenericButton label="Confirm" link={authLink} />
        <MailFooter />
      </Container>
    </Body>
  );
};

ModularAuthTemplate.PreviewProps = {
  firstName: "John",
  userPrompt: "to complete sign-up",
  authLink: "https://fixmy.town/api/auth/callback/resend?token=302cf15d-07f",
  preview: "Confirm your registration for FixMy.town",
} as ModularAuthTemplateProps;


export default ModularAuthTemplate;
