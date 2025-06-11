"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { OrderResponse } from '@/types/hitpay';
import { useCart } from '@/context/CartContext';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [hasCartBeenCleared, setHasCartBeenCleared] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = searchParams.get('orderId');
      
      if (!orderId) {
        setOrderError('No order ID provided in URL');
        setIsLoadingOrder(false);
        return;
      }

      try {
        console.log(`[Confirmation] Fetching order details for: ${orderId}`);
        
        const response = await fetch(`/api/orders?id=${orderId}`);
        const data: OrderResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch order details');
        }

        if (!data.order) {
          throw new Error('Order not found');
        }

        console.log(`[Confirmation] Order fetched successfully:`, data.order);
        setOrder(data.order);

        // Clear cart only once for successfully paid orders
        if (!hasCartBeenCleared && (data.order.status === 'awaiting_shipment' || data.order.status === 'shipped' || data.order.status === 'delivered')) {
          console.log('[Confirmation] Clearing cart for successful order');
          clearCart();
          setHasCartBeenCleared(true);
        }

      } catch (error) {
        console.error('[Confirmation] Error fetching order:', error);
        setOrderError(
          error instanceof Error 
            ? error.message 
            : 'Failed to load order details. Please try again or contact support.'
        );
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [searchParams, clearCart, hasCartBeenCleared]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Checkout', href: '/checkout' },
    { label: 'Confirmation', current: true }
  ];

  // Loading state
  if (isLoadingOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (orderError || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-12 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
              <p className="text-gray-600 mb-6">
                {orderError || 'We could not find the order you are looking for.'}
              </p>
              <div className="space-y-2">
                <ContinueShoppingButton />
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine the display based on payment status
  const isPaymentSuccessful = order.status === 'awaiting_shipment' || order.status === 'shipped' || order.status === 'delivered';
  const isPaymentFailed = order.status === 'payment_failed';
  const isPaymentPending = order.status === 'pending_payment';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Order Status Display */}
          <div className="px-8 py-12 text-center border-b border-gray-100">
            {isPaymentSuccessful && (
              <>
                <OrderSuccessDisplay />
                <OrderMetaInfo 
                  orderDate={new Date(order.createdAt)} 
                  customerName={order.customerDetails.fullName} 
                />
              </>
            )}
            
            {isPaymentFailed && (
              <>
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-4">
                  Unfortunately, your payment could not be processed.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    Order Reference: {order.userFacingOrderId || order.id}
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    Please try again or contact support if you continue to experience issues.
                  </p>
                </div>
              </>
            )}
            
            {isPaymentPending && (
              <>
                <div className="text-yellow-500 text-6xl mb-4">⏳</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h2>
                <p className="text-gray-600 mb-4">
                  Your payment is being processed. This page will update automatically.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    Order Reference: {order.userFacingOrderId || order.id}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Order Details Section - Show for all statuses */}
          <div className="px-8 py-8 space-y-8">
            {/* Purchased Items */}
            <PurchasedItemsList items={order.items} />

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
                paymentMethod={{
                  type: order.paymentDetails?.paymentMethodType || 'Pending',
                  last4: order.paymentDetails?.paymentMethodLast4 || '0000',
                  brand: order.paymentDetails?.paymentMethodBrand || 'Unknown'
                }}
                orderDate={new Date(order.createdAt)}
                paymentStatus={order.paymentDetails?.status || 'pending'}
              />
            </div>

            {/* Customer Information */}
            <CustomerDetails
              billingDetails={{
                name: order.customerDetails.fullName,
                company: undefined, // Not collected in our form
                address: order.shippingAddress.address1,
                city: order.shippingAddress.city,
                postalCode: order.shippingAddress.postalCode,
                phone: order.customerDetails.phone,
                email: order.customerDetails.email
              }}
              shippingDetails={{
                name: order.customerDetails.fullName,
                address: `${order.shippingAddress.address1}${order.shippingAddress.address2 ? ', ' + order.shippingAddress.address2 : ''}`,
                city: order.shippingAddress.city,
                postalCode: order.shippingAddress.postalCode
              }}
            />

            {/* Email Notification - Only show for successful payments */}
            {isPaymentSuccessful && (
              <EmailNotification email={order.customerDetails.email} />
            )}

            {/* Continue Shopping Button */}
            <div className="text-center pt-4">
              <ContinueShoppingButton />
              
              {/* Additional help text for failed payments */}
              {isPaymentFailed && (
                <p className="text-sm text-gray-500 mt-4">
                  Need help? Contact our support team with your order reference: {order.userFacingOrderId || order.id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}