import React from 'react';
import ModularAuthTemplate from '@/emails/modularAuthTemplate';

const ExampleEmail: React.FC = () => {
  return (
    <ModularAuthTemplate
      firstName="John"
      userPrompt="to confirm your registration"
      authCode="12c45b78"
      authLink="https://example.com/confirm"
      preview="Confirm your registration for ExampleApp"
    />
  );
};

export default ExampleEmail;
