import React from 'react';
import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import OrderSuccessDisplay from '@/components/checkout/OrderSuccessDisplay';
import OrderMetaInfo from '@/components/checkout/OrderMetaInfo';
import PurchasedItemsList from '@/components/checkout/PurchasedItemsList';
import InvoiceDetails from '@/components/checkout/InvoiceDetails';
import PaymentInfo from '@/components/checkout/PaymentInfo';
import CustomerDetails from '@/components/checkout/CustomerDetails';
import EmailNotification from '@/components/checkout/EmailNotification';
import ContinueShoppingButton from '@/components/checkout/ContinueShoppingButton';
import { Order } from '@/types/order';

// Mock data refactored to use the new Order interface
const mockOrderData: Order = {
  // Core Order Identifiers
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // UUID v4
  userFacingOrderId: 'txn_kv_20250524_001234',
  createdAt: '2025-05-24T14:20:00.000Z', // ISO 8601
  updatedAt: '2025-05-24T14:20:00.000Z', // ISO 8601

  // Customer & Shipping Information
  customerDetails: {
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+65 9123 4567'
  },
  shippingAddress: {
    address1: '456 Orchard Road, #10-15',
    address2: undefined,
    city: 'Singapore',
    postalCode: '238883',
    country: 'Singapore'
  },

  // Order Items
  items: [
    {
      productId: 1,
      name: 'PowerGlide X500 Electric Wheelchair',
      price: 3599.99,
      quantity: 1,
      image: '/powerglide-x500.jpg'
    },
    {
      productId: 2,
      name: 'EasyFold Lite Travel Wheelchair',
      price: 1299.99,
      quantity: 2,
      image: '/easyfold-lite.jpg'
    }
  ],

  // Financial Summary
  subtotal: 6199.97,
  discountAmount: 200.00,
  shippingCost: 50.00,
  totalAmount: 6049.97,

  // Order Status
  status: 'awaiting_shipment',

  // Payment Information
  paymentDetails: {
    paymentMethodType: 'Credit Card',
    paymentMethodBrand: 'Visa',
    paymentMethodLast4: '1234',
    transactionDate: '2025-05-24T14:20:00.000Z',
    status: 'succeeded',
    amountCharged: 6049.97,
    currency: 'SGD'
  }
};

export const metadata: Metadata = {
  title: 'Order Confirmation - Karvana',
  description: 'Your order has been successfully placed. Thank you for choosing Karvana for your mobility needs.',
};

export default function OrderConfirmationPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Checkout', href: '/checkout' },
    { label: 'Confirmation', current: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Order Success Display */}
          <div className="px-8 py-12 text-center border-b border-gray-100">
            <OrderSuccessDisplay />
            <OrderMetaInfo 
              orderDate={new Date(mockOrderData.createdAt)} 
              customerName={mockOrderData.customerDetails.fullName} 
            />
          </div>

          {/* Order Details Section */}
          <div className="px-8 py-8 space-y-8">
            {/* Purchased Items */}
            <PurchasedItemsList items={mockOrderData.items} />

            {/* Invoice Details & Payment Info Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InvoiceDetails
                transactionId={mockOrderData.userFacingOrderId || mockOrderData.id}
                subtotal={mockOrderData.subtotal}
                discount={mockOrderData.discountAmount || 0}
                shipping={mockOrderData.shippingCost || 0}
                total={mockOrderData.totalAmount}
              />
              
              <PaymentInfo
                paymentMethod={{
                  type: mockOrderData.paymentDetails?.paymentMethodType || 'Unknown',
                  last4: mockOrderData.paymentDetails?.paymentMethodLast4 || '0000',
                  brand: mockOrderData.paymentDetails?.paymentMethodBrand || 'Unknown'
                }}
                orderDate={new Date(mockOrderData.createdAt)}
              />
            </div>

            {/* Customer Information */}
            <CustomerDetails
              billingDetails={{
                name: mockOrderData.customerDetails.fullName,
                company: 'Smith & Associates', // Keep from original mock for now
                address: '123 Marina Bay Street, #15-06', // Keep from original mock for now
                city: 'Singapore',
                postalCode: '018988', // Keep from original mock for now
                phone: mockOrderData.customerDetails.phone,
                email: mockOrderData.customerDetails.email
              }}
              shippingDetails={{
                name: mockOrderData.customerDetails.fullName,
                address: mockOrderData.shippingAddress.address1,
                city: mockOrderData.shippingAddress.city,
                postalCode: mockOrderData.shippingAddress.postalCode
              }}
            />

            {/* Email Notification */}
            <EmailNotification email={mockOrderData.customerDetails.email} />

            {/* Continue Shopping Button */}
            <div className="text-center pt-4">
              <ContinueShoppingButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}