import React from 'react';
import { Order } from '@/types/order';
import PurchasedItemsList from '@/components/checkout/PurchasedItemsList';
import CustomerDetails from '@/components/checkout/CustomerDetails';
import PaymentInfo from '@/components/checkout/PaymentInfo';
import InvoiceDetails from '@/components/checkout/InvoiceDetails';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  // Handle click on overlay to close modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Transform order data for CustomerDetails component
  const billingDetails = {
    name: order.customerDetails.fullName,
    company: undefined,
    address: order.shippingAddress.address1 + (order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ''),
    city: order.shippingAddress.city,
    postalCode: order.shippingAddress.postalCode,
    phone: order.customerDetails.phone,
    email: order.customerDetails.email,
  };

  const shippingDetails = {
    name: order.customerDetails.fullName,
    address: order.shippingAddress.address1 + (order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ''),
    city: order.shippingAddress.city,
    postalCode: order.shippingAddress.postalCode,
  };

  // Transform payment data for PaymentInfo component
  const paymentMethod = {
    type: order.paymentDetails?.paymentMethodType || 'Pending',
    last4: order.paymentDetails?.paymentMethodLast4 || '0000',
    brand: order.paymentDetails?.paymentMethodBrand || 'Unknown'
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Order Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Order ID: {order.userFacingOrderId || order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6 space-y-8">
          {/* Purchased Items */}
          <PurchasedItemsList items={order.items} />

          {/* Customer Details */}
          <CustomerDetails
            billingDetails={billingDetails}
            shippingDetails={shippingDetails}
          />

          {/* Invoice Details & Payment Info Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InvoiceDetails
              transactionId={order.userFacingOrderId || order.id}
              subtotal={order.subtotal}
              discount={order.discountAmount || 0}
              shipping={order.shippingCost || 0}
              total={order.totalAmount}
            />
            
            <PaymentInfo
              paymentMethod={paymentMethod}
              orderDate={new Date(order.createdAt)}
              paymentStatus={order.paymentDetails?.status || 'pending'}
            />
          </div>

          {/* Customer Notes (if any) */}
          {order.customerNotes && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Customer Notes
              </h3>
              <p className="text-gray-700 text-sm">
                {order.customerNotes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;