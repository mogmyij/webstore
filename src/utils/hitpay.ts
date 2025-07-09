// utils/hitpay.ts

import crypto from 'crypto';
import { HitPayPaymentRequestPayload, HitPayPaymentRequestResponse, HitPayWebhookPayload } from '@/types/hitpay';

// Generate unique order reference number
export function generateOrderReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KV-${timestamp}-${random}`;
}

// Call HitPay API to create payment request
export async function createHitPayPaymentRequest(payload: HitPayPaymentRequestPayload): Promise<HitPayPaymentRequestResponse> {
  const apiKey = process.env.HITPAY_API_KEY;
  if (!apiKey) {
    throw new Error('HITPAY_API_KEY environment variable is not set');
  }

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' 
    ? 'https://api.hit-pay.com'
    : 'https://api.sandbox.hit-pay.com';

  const url = `${baseUrl}/v1/payment-requests`;

  // Convert payload to form data
  const formData = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-BUSINESS-API-KEY': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[HitPay API Error] ${response.status}: ${errorText}`);
      throw new Error(`HitPay API error: ${response.status} ${response.statusText}`);
    }

    const data: HitPayPaymentRequestResponse = await response.json();
    console.log(`[HitPay] Payment request created: ${data.id}`);
    return data;
  } catch (error) {
    console.error('[HitPay] Failed to create payment request:', error);
    throw error;
  }
}

// Verify HMAC signature for webhook V1 (form data)
export function verifyHitPayWebhookSignature(payload: HitPayWebhookPayload): boolean {
  const salt = process.env.HITPAY_WEBHOOK_SALT;
  if (!salt) {
    console.error('[HitPay] HITPAY_WEBHOOK_SALT environment variable is not set');
    return false;
  }

  try {
    // Extract HMAC from payload
    const receivedHmac = payload.hmac;
    
    // Create payload without HMAC for verification
    const verificationPayload = { ...payload };
    delete (verificationPayload as any).hmac;

    // Sort keys alphabetically and construct verification string
    const sortedKeys = Object.keys(verificationPayload).sort();
    const verificationString = sortedKeys
      .map(key => `${key}${verificationPayload[key as keyof Omit<HitPayWebhookPayload, 'hmac'>]}`)
      .join('');

    // Calculate HMAC
    const calculatedHmac = crypto
      .createHmac('sha256', salt)
      .update(verificationString)
      .digest('hex');

    const isValid = calculatedHmac === receivedHmac;
    
    if (!isValid) {
      console.error('[HitPay] HMAC verification failed');
      console.error('Verification string:', verificationString);
      console.error('Calculated HMAC:', calculatedHmac);
      console.error('Received HMAC:', receivedHmac);
    } else {
      console.log('[HitPay] HMAC verification successful');
    }

    return isValid;
  } catch (error) {
    console.error('[HitPay] HMAC verification error:', error);
    return false;
  }
}

// Verify HMAC signature for webhook V2 (JSON payload)
export function verifyHitPayWebhookV2Signature(rawPayload: string, signature: string): boolean {
  const salt = process.env.HITPAY_WEBHOOK_SALT;
  if (!salt) {
    console.error('[HitPay] HITPAY_WEBHOOK_SALT environment variable is not set');
    return false;
  }

  try {
    const calculatedHmac = crypto
      .createHmac('sha256', salt)
      .update(rawPayload)
      .digest('hex');

    const isValid = calculatedHmac === signature;
    
    if (!isValid) {
      console.error('[HitPay] V2 HMAC verification failed');
      console.error('Calculated HMAC:', calculatedHmac);
      console.error('Received signature:', signature);
    } else {
      console.log('[HitPay] V2 HMAC verification successful');
    }

    return isValid;
  } catch (error) {
    console.error('[HitPay] V2 HMAC verification error:', error);
    return false;
  }
}
