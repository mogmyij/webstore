// types/hitpay.ts

// HitPay API request payload for creating payment requests
export interface HitPayPaymentRequestPayload {
  amount: string;
  currency: string;
  email: string;
  webhook: string;
  redirect_url: string;
  reference_number?: string;
  name?: string;
  phone?: string;
  purpose?: string;
  send_email?: boolean;
  allow_repeated_payments?: boolean;
  add_admin_fee?: boolean;
}

// HitPay API response for creating payment requests
export interface HitPayPaymentRequestResponse {
  id: string; // Payment Request ID
  name: string | null;
  email: string;
  phone: string | null;
  amount: string;
  currency: string;
  status: string;
  purpose: string | null;
  reference_number: string;
  payment_methods: string[];
  url: string; // Checkout URL for redirection
  redirect_url: string;
  webhook: string;
  send_sms: boolean;
  send_email: boolean;
  sms_status: string;
  email_status: string;
  allow_repeated_payments: boolean;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
}

// HitPay Webhook V1 payload (form data)
export interface HitPayWebhookPayload {
  payment_id: string;
  payment_request_id: string;
  phone: string;
  amount: string;
  currency: string;
  status: "completed" | "failed";
  reference_number: string;
  hmac: string;
}
// HitPay Webhook V2 payload (JSON)
export interface HitPayWebhookV2Payload {
  id: string; // Charge ID
  business_id: string;
  status: 'succeeded' | 'failed' | 'pending';
  amount: number;
  currency: string;
  order_id?: string;
  reference_number?: string;
  customer?: {
    email: string;
    name?: string;
    phone?: string;
  };
  payment_method?: {
    type: string;
    brand?: string;
    last_four?: string;
  };
  created_at: string;
  updated_at: string;
}

// Request body for create-payment API route
export interface CreatePaymentRequest {
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingCost?: number;
  discountAmount?: number;
  totalAmount: number;
  customerNotes?: string;
}

// Response from create-payment API route
export interface CreatePaymentResponse {
  success: boolean;
  orderId: string;
  hitpayUrl?: string;
  hitpayPaymentRequestId?: string;
  error?: string;
}

// Response from orders API route
export interface OrderResponse {
  success: boolean;
  order?: any; // Will use Order type from order.ts
  error?: string;
}
