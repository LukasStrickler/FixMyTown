import React from 'react';
import { Text, Link } from '@react-email/components';

const MailFooter: React.FC = () => {
  return (
    <div>
    <Text
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "12px",
          marginBottom: "16px",
        }}
      >
        Not expecting this email?<br/>
        Contact{" "}
      <Link
        href="mailto:support@fixmy.town"
        style={{ color: "#444", textDecoration: "underline" }}
      >
        support@fixmy.town
      </Link>{" "}
      if you did not request this code.
      </Text>
    </div>
  );
};

export default MailFooter;
