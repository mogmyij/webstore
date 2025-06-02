import React from 'react';

interface PaymentMethod {
  type: string;
  last4: string;
  brand: string;
}

interface PaymentInfoProps {
  paymentMethod: PaymentMethod;
  orderDate: Date;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ paymentMethod, orderDate }) => {
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Payment Information
      </h2>
      
      <div className="space-y-4">
        {/* Payment Method */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium text-gray-900">
              {paymentMethod.type} ending in {paymentMethod.last4}
            </p>
            <p className="text-sm text-gray-500">{paymentMethod.brand}</p>
          </div>
        </div>
        
        {/* Order Date & Time */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Order Date</p>
          <p className="font-medium text-gray-900">
            {formatDateTime(orderDate)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PaymentInfo;