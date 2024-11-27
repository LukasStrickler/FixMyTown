import React from 'react';
import { Body, Container, Preview } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';
import MailNotificationContent from '@/components/email/mailNotificationContent';

type ModularAuthTemplateProps = {
  firstName: string;
  title: string;
  status: string;
  status_color: string;
  link: string;
};
  
const ModularAuthTemplate: React.FC<ModularAuthTemplateProps> = ({
  firstName,
  title,
  status,
  status_color,
  link,
}) => {
  return (
    <Body
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
        textAlign: "center",
      }}
    >
      <Preview>You have a new update from fixmy.town</Preview>
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
        <MailNotificationContent
          firstName={firstName}
          status={status}
          title={title} 
          status_color={status_color}          />
        <MailGenericButton label="Learn more" link={link} />
        <MailFooter />
      </Container>
    </Body>
  );
};

export default ModularAuthTemplate;
