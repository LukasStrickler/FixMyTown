import React from 'react';

type MailAuthButtonProps = {
  label: string;
  onClick: () => void;
};

const MailAuthButton: React.FC<MailAuthButtonProps> = ({ label, onClick }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <button onClick={onClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {label}
      </button>
    </div>
  );
};

export default MailAuthButton;
