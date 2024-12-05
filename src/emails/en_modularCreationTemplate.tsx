import React from 'react';
import { Body, Container, Preview } from '@react-email/components';
import MailHeader from '@/components/email/mailHeader';
import MailCreationContent from '@/components/email/en_mailCreationContent';
import MailGenericButton from '@/components/email/mailGenericButton';
import MailFooter from '@/components/email/mailFooter';


interface ModularCreationTemplateProps {
  firstName: string;
  title: string;
  status: string;
  status_color: string;
  link: string;
};
  
const ModularCreationTemplate = ({
  firstName,
  title,
  status,
  status_color,
  link,
}: ModularCreationTemplateProps) => {
  return (
    <Body
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
        textAlign: "center",
      }}
    >
      <Preview>Thank you for submitting a new issue on fixmy.town</Preview>
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
        <MailCreationContent
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

ModularCreationTemplate.PreviewProps = {
  firstName: "James",
  title: "weird liquid leaking from BASF plant",
  link: "https://fixmy.town/issues/12345",
} as ModularCreationTemplateProps;


export default ModularCreationTemplate;
