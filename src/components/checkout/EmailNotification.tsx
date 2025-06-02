import React from 'react';

interface EmailNotificationProps {
  email: string;
}

const EmailNotification: React.FC<EmailNotificationProps> = ({ email }) => {
  return (
    <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Confirmation Email Sent
          </h3>
          <p className="text-gray-700">
            A confirmation email with your order details and invoice has been sent to{' '}
            <span className="font-medium text-blue-800">{email}</span>.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Please check your inbox and spam folder if you don't receive it within a few minutes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmailNotification;