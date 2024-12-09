import React from 'react';
import { Text, Heading, Section } from '@react-email/components';

type MailNotificationContentProps = {
  firstName: string;
  status: string;
  title: string;
  status_color: string;
};

const MailNotificationContent: React.FC<MailNotificationContentProps> = ({
  firstName,
  status,
  title,
  status_color,
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
        Hello {firstName}, thank you for submitting a new issue!
      </Heading>
      <Text
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "16px",
          marginBottom: "16px",
        }}
      >
          We received your report for the issue
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          fontStyle: "italic",
          textAlign: "center",
          fontSize: "23px",
          marginBottom: "16px",
          lineHeight: "1.4",
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
          Thank you for your support in keeping our town a clean and friendly place! <br/>
          We will do our best to resolve the issues as fast as possible.
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          color: status_color,
          fontSize: "33px",
          textAlign: "center",
          marginBottom: "8px",
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
