import React from 'react';

interface InvoiceDetailsProps {
  transactionId: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  transactionId,
  subtotal,
  discount,
  shipping,
  total
}) => {
  return (
    <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Invoice Details
        </h2>
        <span className="text-sm font-mono text-gray-600 bg-white px-3 py-1 rounded border">
          {transactionId}
        </span>
      </div>
      
      <div className="space-y-3">
        {/* Cost Breakdown */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Sub Total</span>
          <span className="text-gray-900">S${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600">-S${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shipping and Handling</span>
          <span className="text-gray-900">S${shipping.toFixed(2)}</span>
        </div>
        
        {/* Order Total */}
        <div className="border-t border-gray-300 pt-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Order Total</span>
            <span className="text-xl font-bold text-gray-900">S${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceDetails;