# HitPay API Integration Guide for E-commerce Project

This document outlines the key aspects of the HitPay API relevant for integrating online payment processing into your e-commerce application.

## 1. Introduction

HitPay provides REST APIs to integrate various payment methods into your platform [4]. For development and testing, HitPay offers a sandbox environment.

*   **Sandbox Account Registration**: `https://dashboard.sandbox.hit-pay.com/register` [4]
*   **API Type**: RESTful APIs are recommended for robust integration [4]. While a PHP SDK exists, it is community-driven and not actively maintained by HitPay [4].

## 2. Authentication

API requests to HitPay are authenticated using an API key.

*   **API Key**: Obtain your API key from the HitPay Dashboard under "Settings" > "Payment Gateway" > "API Keys" [2] or simply "API keys" [5].
*   **HTTP Header**: Include your API key in the `X-BUSINESS-API-KEY` header for all requests [5].

    ```
    X-BUSINESS-API-KEY: YOUR_API_KEY
    ```
*   **Content Type**: Requests, particularly for creating payment requests, should typically use `Content-Type: application/x-www-form-urlencoded` [5].
*   **Additional Header**: Examples also show `X-Requested-With: XMLHttpRequest` [5].

## 3. Online Payments (Payment Request API)

The core flow for online payments involves three main steps: creating a payment request, presenting the checkout page to the user, and handling webhooks for payment confirmation [5].

### 3.1. Create Payment Request

This server-to-server call initiates a payment transaction.

*   **Endpoint**:
    *   Sandbox: `POST https://api.sandbox.hit-pay.com/v1/payment-requests` [5]
    *   Live: `POST https://api.hit-pay.com/v1/payment-requests` (Inferred from sandbox URL structure)
*   **Request Parameters** (sent as `application/x-www-form-urlencoded`) [5]:
    | Parameter          | Type   | Description                                                                                             | Example             | Required    |
    |--------------------|--------|---------------------------------------------------------------------------------------------------------|---------------------|-------------|
    | `amount`           | String | The payment amount.                                                                                     | `"599.00"`          | Yes         |
    | `currency`         | String | The currency code (e.g., SGD, USD).                                                                     | `"SGD"`             | Yes         |
    | `email`            | String | Customer's email address.                                                                               | `"user@example.com"`| Yes (implied from example) |
    | `webhook`          | String | URL on your server where HitPay will send a POST request upon payment completion/status change.       | `"https://yourdomain.com/webhook"` | Yes         |
    | `redirect_url`     | String | URL to redirect the user to after payment completion on the HitPay checkout page.                       | `"https://yourdomain.com/payment-success"` | Yes         |
    | `reference_number` | String | Your internal reference for the order/payment.                                                          | `"ORDER12345"`      | No          |
    | `name`             | String | Customer's name.                                                                                        | `"John Doe"`        | No          |
    | `phone`            | String | Customer's phone number.                                                                                | `"1234567890"`      | No          |
    | `purpose`          | String | Purpose of the payment.                                                                                 | `"Purchase of Item X"`| No          |
    | `send_email`       | Bool   | Set to `false` if you do not want HitPay to send an email receipt. Defaults to `true`.                  | `false`             | No          |
    | `allow_repeated_payments` | Bool | Whether the payment link can be used multiple times. Defaults to `true`.                         | `false`             | No          |


*   **Example Request Structure**:
    ```
    POST https://api.sandbox.hit-pay.com/v1/payment-requests
    Headers:
      X-BUSINESS-API-KEY: YOUR_SANDBOX_API_KEY
      Content-Type: application/x-www-form-urlencoded
      X-Requested-With: XMLHttpRequest
    Body:
      amount=599.00
      &currency=SGD
      &email=user@example.com
      &webhook=https://yourbackend.com/api/hitpay-webhook
      &redirect_url=https://yourfrontend.com/order-confirmation
      &reference_number=REF123
    ```

*   **Example JSON Response** [5]:
    ```
    {
      "id": "90f28b43-2cff-4f86-a29e-15697424b3e7", // Payment Request ID
      "name": null,
      "email": "tom@test.com",
      "phone": null,
      "amount": "599.00",
      "currency": "SGD",
      "status": "pending",
      "purpose": null,
      "reference_number": "REF123",
      "payment_methods": [
        "paynow_online",
        "card",
        "wechat",
        "alipay"
      ],
      "url": "https://securecheckout.sandbox.hit-pay.com/payment-request/@your-business/90f28b43-2cff-4f86-a29e-15697424b3e7/checkout", // Checkout URL
      "redirect_url": "https://test.com/success",
      "webhook": "https://test.com/webhook",
      "send_sms": true,
      "send_email": true,
      "sms_status": "pending",
      "email_status": "pending",
      "allow_repeated_payments": true,
      "expiry_date": null,
      "created_at": "2020-07-03T02:18:49",
      "updated_at": "2020-07-03T02:18:49"
    }
    ```
    The `url` from the response is used to redirect the customer to the HitPay checkout page. The `id` can be used for Drop-In UI or internal tracking.

### 3.2. Presenting the Checkout UI

After creating a payment request, your server should return the `url` (and optionally `id`) to the client [5].
*   **Redirect to HitPay Checkout**: Navigate the user to the `url` provided in the payment request response. HitPay handles the payment flow and redirects the user back to the `redirect_url` you specified [5].
*   **Drop-In UI (Embedded Checkout)**: Embed the checkout into your webpage. This requires the `default_link` (found in HitPay Dashboard > Payment Links > Default link) and the `payment_request_id` (the `id` from the payment request response) [5]. Sample code for Drop-In UI is available in HitPay's documentation [5].

## 4. Webhooks

Webhooks are essential for receiving real-time notifications about payment statuses. Your backend must have an endpoint to receive these POST requests from HitPay. **Only mark an order as paid after a webhook is received and validated** [7].

HitPay provides two main ways of handling webhooks:

### 4.1. Webhook V1 (Parameter-based, Form Data)

This is typically used when you specify a `webhook` URL in the `Create Payment Request` API call [6, 7]. The request is `application/x-www-form-urlencoded`.

*   **Key Webhook Fields (POST body)** [7]:
    | Parameter              | Description                                      | Example                                       |
    |------------------------|--------------------------------------------------|-----------------------------------------------|
    | `payment_id`           | Unique ID for the payment transaction.           | `974f65d6-88ea-42a0-a67a-15acafc4dc66`        |
    | `recurring_billing_id` | ID of the recurring billing plan (if applicable).| `9741164c-06a1-4dd7-a649-72cca8f9603a`        |
    | `amount`               | Amount charged.                                  | `9.90`                                        |
    | `currency`             | Currency of the charge.                          | `SGD`                                         |
    | `status`               | Payment status (`succeeded` or `failed`).        | `succeeded`                                   |
    | `reference`            | Your reference number provided in payment request.| `cust_id_123`                                 |
    | `hmac`                 | Message Authentication Code for validation.      | `7690ff7ab7d88480a480b8be722f6dd12cc58f48...` |

*   **Validation (Webhook V1)** [7]:
    1.  Receive the form data.
    2.  Concatenate all received parameters (except `hmac` itself) in alphabetical order of the keys, with their values. (Actual construction method may vary; consult HitPay specific HMAC generation for V1 if issues arise. The documentation for V2 HMAC is clearer.)
    3.  Calculate the HMAC SHA256 hash of this string using your **Salt Value** as the secret key. The Salt Value can be found in your HitPay Dashboard (usually under API Keys).
    4.  Compare the calculated HMAC with the `hmac` value received in the webhook. If they match, the webhook is authentic.
*   **Response**: Return an HTTP 200 status code to HitPay to acknowledge receipt [7].

### 4.2. Event Webhooks (Webhook V2, JSON Payload)

These are more general webhooks that can be registered in your HitPay Dashboard (Navigate to "API Keys", enter name and URL) for various events [6]. The request body is JSON.

*   **Key HTTP Headers in Webhook Request** [6]:
    | Header                | Description                                                              |
    |-----------------------|--------------------------------------------------------------------------|
    | `Hitpay-Signature`    | SHA256 HMAC of the JSON payload, signed with your Salt Value.            |
    | `Hitpay-Event-Type`   | Type of event (e.g., `created`, `updated`).                              |
    | `Hitpay-Event-Object` | The type of object the event relates to (e.g., `charge`, `order`).       |
    | `User-Agent`          | `HitPay v2.0`                                                            |

*   **Key Events for E-commerce** [6]:
    *   `charge.created`: A payment was successfully completed.
    *   `charge.updated`: A payment was refunded or partially refunded.
    *   `order.updated`: An order status was updated.

*   **Example JSON Payload Snippet (`charge` event)** [6]:
    ```
    {
      "id": "9e9a3451-a3e5-4fc5-9dfc-bc75e67c8808", // Charge ID
      "business_id": "98567029-f559-49f9-916b-042a4255b32a",
      "status": "succeeded", // or "failed", "pending"
      "amount": 913.84,
      "currency": "sgd",
      "order_id": "9e9a344b-2c04-44f4-b521-e36dce8f4ade",
      // ... other fields like customer details, order details
    }
    ```

*   **Validation (Webhook V2 - JSON)** [6]:
    1.  Receive the JSON payload and the `Hitpay-Signature` header.
    2.  Use your **Salt Value** (from HitPay Dashboard > API Keys) as the secret key.
    3.  Compute an HMAC SHA256 hash of the raw JSON payload string using the Salt Value.
    4.  Compare the computed HMAC (hex-encoded) with the value of the `Hitpay-Signature` header. If they match, the webhook is valid.

*   **Response**: Return an HTTP 200 status code to HitPay.

## 5. Technical Implementation Notes for Next.js/TypeScript Project

*   **Backend Logic**: All API calls to HitPay (creating payment requests) and handling of webhooks **must** be done on the server-side (e.g., Next.js API Routes). Do not expose your API key or Salt Value on the client-side.
*   **State Management**: Use React Context API or other state management solutions to manage cart state and update UI based on payment status received via webhooks (e.g., by re-fetching order status after a webhook is processed by the backend).
*   **Error Handling**: Implement robust error handling for API calls and webhook processing.
*   **Idempotency**: Design webhook handling to be idempotent if possible, as webhooks might occasionally be sent more than once. Check if a payment/order has already been processed based on `payment_id` or `reference_number`.
