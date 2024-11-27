import React from 'react';
import { Text, Heading, Section } from '@react-email/components';

type MailNotificationContentProps = {
  firstName: string;
  status: string;
  title: string;
};

const MailNotificationContent: React.FC<MailNotificationContentProps> = ({
  firstName,
  status,
  title,
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
        Hello {firstName}, we have an update to your submitted issue!
      </Heading>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "16px",
          marginBottom: "16px",
        }}
      >
          Your reported issue
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: "21px",
          marginBottom: "16px",
        }}
      >
          {title}
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "16px",
          marginBottom: "16px",
        }}
      >
          now has the status:
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "black",
          fontSize: "21px",
          marginBottom: "16px",
          fontWeight: "bold",
        }}
      >
          {status}
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
      </div>
    </Section>
  );
};

export default MailNotificationContent;
