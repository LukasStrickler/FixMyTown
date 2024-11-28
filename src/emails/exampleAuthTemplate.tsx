import React from 'react';
import ModularAuthTemplate from '@/emails/modularAuthTemplate';

const ExampleEmail: React.FC = () => {
  return (
    <ModularAuthTemplate
      firstName="John"
      userPrompt="to complete sign-up"
      authLink="https://fixmy.town/api/auth/callback/resend?token=302cf15d-07f"
      preview="Confirm your registration for FixMy.town"
    />
  );
};

export default ExampleEmail;
