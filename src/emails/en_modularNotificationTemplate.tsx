import React from 'react';
import { Body, Container, Preview } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailNotificationContent from '@/components/email/en_mailNotificationContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';


interface ModularNotificationTemplateProps {
  firstName: string;
  title: string;
  status: string;
  status_color: string;
  link: string;
};
  
const ModularNotificationTemplate = ({
  firstName,
  title,
  status,
  status_color,
  link,
}: ModularNotificationTemplateProps) => {
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

ModularNotificationTemplate.PreviewProps = {
  firstName: "Jane",
  title: "weird liquid leaking from BASF plant",
  status: "Resolved",
  link: "https://fixmy.town/issues/12345",
  status_color: "green",
} as ModularNotificationTemplateProps;


export default ModularNotificationTemplate;