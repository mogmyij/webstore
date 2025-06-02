// types/order.ts

// Represents a single item in an order
// This should align with product data and what's needed in an order summary.
// You can adapt from `data/Products.ts -> Product` or `context/CartContext.tsx -> CartItem`.
export interface OrderItem {
  productId: number; // Or string, consistent with your Product ID type
  name: string;
  price: number; // Price at the time of purchase
  quantity: number;
  image: string; // URL to product image
  // Potentially add SKU or other product-specific identifiers if needed later
}

// Customer details collected during checkout
export interface OrderCustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

// Shipping address details
export interface OrderShippingAddress {
  address1: string;
  address2?: string; // Optional
  city: string;
  postalCode: string;
  country: string; // Should default to "Singapore" as per requirements
}

// Details about the payment transaction
// This will be populated more fully during HitPay integration (Block 4)
export interface OrderPaymentDetails {
  hitpayPaymentRequestId?: string; // ID from HitPay create payment API response
  hitpayPaymentId?: string;       // ID from HitPay webhook (e.g., charge.created)
  hitpayReferenceNumber?: string; // The reference_number sent to HitPay
  status?: 'pending' | 'succeeded' | 'failed' | 'requires_action'; // Reflects payment gateway status
  amountCharged?: number;         // Actual amount charged by payment gateway
  currency?: string;              // Currency of the charge (e.g., 'SGD')
  paymentMethodType?: string;     // e.g., 'card', 'paynow_online' from HitPay
  paymentMethodBrand?: string;    // e.g., 'Visa' for cards
  paymentMethodLast4?: string;    // e.g., '1234' for cards
  transactionDate?: string;       // ISO 8601 timestamp of the payment transaction
  webhookReceivedAt?: string;     // ISO 8601 timestamp when webhook was processed
}

// The main Order type
export interface Order {
  // Core Order Identifiers
  id: string;                         // Unique system-generated order ID (e.g., using UUID v4)
  userFacingOrderId?: string;         // A more human-readable order number if different from id (e.g., "KV-20250001")
                                      // The `mockOrderData.transactionId` currently acts like this.
  createdAt: string;                  // ISO 8601: Order creation timestamp
  updatedAt: string;                  // ISO 8601: Order last update timestamp

  // Customer & Shipping Information
  customerDetails: OrderCustomerDetails;
  shippingAddress: OrderShippingAddress;
  // Note: Billing address can be added later if it differs from shipping.
  // For now, assume customerDetails (email, phone) and shippingAddress are primary.

  // Order Items
  items: OrderItem[];

  // Financial Summary
  subtotal: number;                   // Sum of (item.price * item.quantity) for all items
  discountAmount?: number;            // Optional: Total discount applied to the order
  shippingCost?: number;              // Optional: Cost for shipping
  totalAmount: number;                // Final amount (subtotal - discountAmount + shippingCost)

  // Order Status (Application's internal perspective)
  status:
    | 'pending_payment'     // Order created, awaiting payment
    | 'payment_failed'      // Payment attempt failed
    | 'awaiting_shipment'   // Payment successful, order being processed
    | 'shipped'             // Order has been shipped
    | 'delivered'           // Order has been delivered
    | 'cancelled';          // Order has been cancelled

  // Payment Information (Linked to OrderPaymentDetails)
  paymentDetails?: OrderPaymentDetails; // Will be populated/updated after payment attempts/webhooks

  // Optional Notes
  customerNotes?: string;             // Notes provided by the customer during checkout
}