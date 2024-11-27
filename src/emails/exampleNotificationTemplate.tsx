import React from 'react';
import ModularNotificationTemplate from '@/emails/modularNotificationTemplate';

const ExampleNotificationTemplate: React.FC = () => {
  const firstName = "Jane";
  const title = "weird liquid leaking from BASF plant";
  const status = "Resolved";
  const link = "https://fixmy.town/issues/12345";
  const status_color = "green";

  return (
    <ModularNotificationTemplate
      firstName={firstName}
      title={title}
      status={status}
      link={link}
      status_color={status_color}
    />
  );
};

export default ExampleNotificationTemplate;
