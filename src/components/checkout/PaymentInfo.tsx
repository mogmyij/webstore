import React from 'react';

interface PaymentMethod {
  type: string;
  last4: string;
  brand: string;
}

interface PaymentInfoProps {
  paymentMethod: PaymentMethod;
  orderDate: Date;
  paymentStatus?: string;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ paymentMethod, orderDate, paymentStatus = 'succeeded' }) => {
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

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return { text: 'Payment Successful', color: 'text-green-600', bg: 'bg-green-100' };
      case 'failed':
        return { text: 'Payment Failed', color: 'text-red-600', bg: 'bg-red-100' };
      case 'pending':
        return { text: 'Payment Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      default:
        return { text: 'Payment Status Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const statusDisplay = getStatusDisplay(paymentStatus);

  return (
    <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Payment Information
      </h2>
      
      <div className="space-y-4">
        {/* Payment Status */}
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${statusDisplay.bg} rounded flex items-center justify-center`}>
            {paymentStatus === 'succeeded' && (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {paymentStatus === 'failed' && (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {paymentStatus === 'pending' && (
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <p className={`font-medium ${statusDisplay.color}`}>
              {statusDisplay.text}
            </p>
          </div>
        </div>

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