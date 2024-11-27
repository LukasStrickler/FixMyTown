import React from 'react';

type MailMainContentProps = {
  message: string;
};

const MailMainContent: React.FC<MailMainContentProps> = ({ message }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>{message}</p>
    </div>
  );
};

export default MailMainContent;
