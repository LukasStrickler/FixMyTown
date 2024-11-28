import React from 'react';
import { Text, Heading, Section } from '@react-email/components';

type MailMainContentProps = {
  firstName: string;
  userPrompt: string;
  authCode: string;
};

const MailMainContent: React.FC<MailMainContentProps> = ({
  firstName,
  userPrompt,
  authCode,
}) => {
  return (
    <Section>
      <Heading
        style={{
          fontWeight: "bold",
          fontSize: "33px",
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        Hello {firstName}, here is your code {userPrompt}
      </Heading>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      >
        Enter it in your open browser window or press the button below. This code will expire in 15 minutes.
      </Text>
      <div
        style={{
          background: "rgba(0,0,0,.05)",
          borderRadius: "4px",
          margin: "16px auto 14px",
          textAlign: "center",
          width: "320px",
          maxWidth: "100%",
        }}
      >
        <Heading
          style={{
            color: "#000",
            display: "inline-block",
            paddingBottom: "8px",
            paddingTop: "8px",
            margin: "0 auto",
            width: "100%",
            textAlign: "center" as const,
            letterSpacing: "8px",
            }}
        >
          {authCode}
        </Heading>
      </div>
    </Section>
  );
};

export default MailMainContent;
