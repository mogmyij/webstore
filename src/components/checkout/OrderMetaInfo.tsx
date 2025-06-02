import React from 'react';

interface OrderMetaInfoProps {
  orderDate: Date;
  customerName: string;
}

const OrderMetaInfo: React.FC<OrderMetaInfoProps> = ({ orderDate, customerName }) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })}`;
    }
    
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="mt-6 space-y-2">
      <p className="text-gray-600">
        {formatDate(orderDate)}
      </p>
      <p className="text-gray-800 font-medium">
        {customerName}
      </p>
    </div>
  );
};

export default OrderMetaInfo;