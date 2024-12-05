import React from 'react';
import { Text, Heading, Section } from '@react-email/components';

type MailAuthContentProps = {
  firstName: string;
  userPrompt: string;
  authCode: string;
};

const MailAuthContent: React.FC<MailAuthContentProps> = ({
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
        Hallo {firstName}, hier ist Dein Code {userPrompt}
      </Heading>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      >
        Gib den Code in Deinem offenen Browserfenster ein oder drücke auf den Button unten. Dieser Code läuft in 15 Minuten ab.
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

export default MailAuthContent;
