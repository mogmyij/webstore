# Backend API Implementation Documentation

## Overview

This document describes the implementation of the backend API routes for payment processing and order management for the Karvana E-Commerce platform, integrating with the HitPay payment gateway.

## Environment Variables Required

The following environment variables must be configured for the API routes to function properly:

```bash
# HitPay API Configuration
HITPAY_API_KEY=your_hitpay_api_key_here
HITPAY_WEBHOOK_SALT=your_hitpay_webhook_salt_here

# Application URLs (for webhooks and redirects)
VERCEL_URL=your-app.vercel.app  # For production deployment
NEXTAUTH_URL=http://localhost:3000  # For local development
```

### How to obtain HitPay credentials:
1. Register for a HitPay sandbox account at: https://dashboard.sandbox.hit-pay.com/register
2. Navigate to "Settings" > "Payment Gateway" > "API Keys" in the HitPay Dashboard
3. Copy your API key and webhook salt

## API Routes Implemented

### 1. `/api/create-payment` (POST)

Creates a new payment request with HitPay and stores a pending order in the database.

**Request Body:**
```typescript
{
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
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingCost?: number;
  discountAmount?: number;
  totalAmount: number;
  customerNotes?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  orderId: string;
  hitpayUrl?: string;  // URL to redirect user for payment
  hitpayPaymentRequestId?: string;
  error?: string;
}
```

**Features:**
- Validates all required fields
- Enforces SGD currency
- Generates unique order reference numbers
- Creates pending order in database
- Initiates HitPay payment request
- Returns checkout URL for frontend redirection

### 2. `/api/webhook` (POST)

Handles payment status updates from HitPay, supporting both V1 (form data) and V2 (JSON) webhook formats.

**Security Features:**
- HMAC signature verification for both V1 and V2 webhooks
- Validates webhook authenticity using shared salt
- Logs security violations

**Functionality:**
- Automatically detects webhook version based on content type and user agent
- Updates order status based on payment results
- Implements idempotency to prevent duplicate processing
- Maps HitPay payment statuses to internal order statuses

**Status Mapping:**
- `succeeded` → Order status: `awaiting_shipment`, Payment status: `succeeded`
- `failed` → Order status: `payment_failed`, Payment status: `failed`

### 3. `/api/orders` (GET)

Retrieves order information for confirmation pages and order management.

**Query Parameters:**
- `id` (optional): Specific order ID to retrieve

**Response:**
```typescript
{
  success: boolean;
  order?: Order;  // Full order object with all details
  orders?: Order[];  // Array of all orders (when no ID specified)
  error?: string;
}
```

**Usage:**
- `/api/orders?id=order-uuid` - Get specific order
- `/api/orders` - Get all orders (for admin functionality)

## Database Abstraction Layer

The implementation includes a complete database abstraction layer (`utils/database.ts`) with mock implementation:

**Key Functions:**
- `createPendingOrderInDB()` - Creates new pending orders
- `updateOrderStatusInDB()` - Updates order status and payment details
- `getOrderFromDB()` - Retrieves orders by ID
- `getOrderByHitPayReference()` - Finds orders by HitPay reference for webhook processing
- `updateOrderWithHitPayId()` - Links orders to HitPay payment request IDs

**Database Design:**
- Uses in-memory storage with Map objects for easy testing
- Maintains mapping between HitPay references and order IDs
- Structured to be easily replaceable with actual database implementations (PostgreSQL, MongoDB, etc.)

## Security Implementations

### HMAC Verification
- **V1 Webhooks**: Alphabetically sorted parameter concatenation with SHA256 HMAC
- **V2 Webhooks**: Raw JSON payload SHA256 HMAC verification
- Comprehensive logging for security audit trails

### Input Validation
- Validates all API request payloads
- Enforces required fields and data types
- Sanitizes and validates monetary amounts
- Checks order item quantities and pricing

### Error Handling
- Graceful error handling with appropriate HTTP status codes
- Detailed logging for debugging while hiding sensitive details from responses
- Prevents information disclosure in error messages

## Order Status Lifecycle

```
pending_payment → awaiting_shipment (on successful payment)
pending_payment → payment_failed (on failed payment)
awaiting_shipment → shipped → delivered
```

## Integration with Frontend

The API routes are designed to integrate seamlessly with the existing checkout flow:

1. **Checkout Page**: Calls `/api/create-payment` when user proceeds to payment
2. **Redirect**: User is redirected to HitPay checkout URL
3. **Webhook Processing**: HitPay sends payment status to `/api/webhook`
4. **Confirmation Page**: Retrieves order details via `/api/orders?id=orderId`

## Testing Considerations

### Manual Testing
- Use HitPay sandbox environment for testing
- Test both successful and failed payment scenarios
- Verify webhook signature validation
- Test order retrieval functionality

### Webhook Testing
- HitPay provides webhook testing tools in their sandbox dashboard
- Can simulate both V1 and V2 webhook formats
- Test HMAC signature validation with invalid signatures

## Future Enhancements

### Database Integration
The current mock implementation can be easily replaced with actual database operations:

```typescript
// Replace mock functions with real database calls
export const createPendingOrderInDB = async (orderData) => {
  return await db.orders.create(orderData);
};
```

### Additional Features
- Order modification and cancellation endpoints
- Refund processing integration
- Order tracking and shipment updates
- Email notification system integration
- Admin dashboard APIs

## Error Codes and Troubleshooting

### Common Issues
- **Environment Variables**: Ensure HITPAY_API_KEY and HITPAY_WEBHOOK_SALT are set
- **CORS**: API routes are same-origin by default in Next.js
- **Webhook Endpoints**: Ensure webhook URL is publicly accessible for HitPay
- **HTTPS**: HitPay requires HTTPS endpoints for production webhooks

### Logging
All API routes include comprehensive logging:
- Request details (sanitized)
- HitPay API interactions
- Database operations
- Error conditions
- Security events (HMAC failures)

## Architecture Alignment

This implementation aligns with the project's architecture requirements:
- **TypeScript**: Full type safety across all components
- **Next.js App Router**: Uses modern API route structure
- **Modular Design**: Clear separation of concerns
- **Security-First**: HMAC verification and input validation
- **Scalable**: Database abstraction allows easy scaling