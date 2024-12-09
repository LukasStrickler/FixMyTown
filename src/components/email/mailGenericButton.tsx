import React from 'react';
import { Button } from '@react-email/components';

type MailGenericButtonProps = {
  label: string;
  link: string;
};

const MailGenericButton: React.FC<MailGenericButtonProps> = ({ label, link }) => {
  return (
    <Button
      href={link}
      style={{
        backgroundColor: "#5e6ad2",
        borderRadius: "3px",
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
        padding: "12px 24px",
        textDecoration: "none",
        display: "inline-block",
        margin: "27px auto",
        width: "auto",
      }}
    >
      {label}
    </Button>
  );
};

export default MailGenericButton;
