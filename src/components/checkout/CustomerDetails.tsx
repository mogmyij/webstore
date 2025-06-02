import React from 'react';
import { OrderCustomerDetails, OrderShippingAddress } from '@/types/order';

interface BillingDetails {
  name: string;
  company?: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CustomerDetailsProps {
  billingDetails: BillingDetails;
  shippingDetails: ShippingDetails;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ billingDetails, shippingDetails }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Customer Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Details */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Billing Details
          </h3>
          
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-900">{billingDetails.name}</p>
            {billingDetails.company && (
              <p className="text-gray-600">{billingDetails.company}</p>
            )}
            <p className="text-gray-600">{billingDetails.address}</p>
            <p className="text-gray-600">{billingDetails.city} {billingDetails.postalCode}</p>
            <p className="text-gray-600">{billingDetails.phone}</p>
            <p className="text-gray-600">{billingDetails.email}</p>
          </div>
        </div>
        
        {/* Shipping Details */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Shipping Details
          </h3>
          
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-900">{shippingDetails.name}</p>
            <p className="text-gray-600">{shippingDetails.address}</p>
            <p className="text-gray-600">{shippingDetails.city} {shippingDetails.postalCode}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerDetails;