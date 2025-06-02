// app/api/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { HitPayWebhookPayload, HitPayWebhookV2Payload } from '@/types/hitpay';
import { getOrderByHitPayReference, updateOrderStatusInDB } from '@/utils/database';
import { verifyHitPayWebhookSignature, verifyHitPayWebhookV2Signature } from '@/utils/hitpay';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const contentType = request.headers.get('content-type') || '';
    const userAgent = request.headers.get('user-agent') || '';
    
    // Check if this is a V2 webhook (JSON payload)
    const isV2Webhook = contentType.includes('application/json') && userAgent.includes('HitPay');
    
    if (isV2Webhook) {
      return handleWebhookV2(request);
    } else {
      return handleWebhookV1(request);
    }
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handle HitPay Webhook V1 (form data)
async function handleWebhookV1(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse form data
    const formData = await request.formData();
    const webhookData: HitPayWebhookPayload = {
      payment_id: formData.get('payment_id') as string,
      recurring_billing_id: formData.get('recurring_billing_id') as string || undefined,
      amount: formData.get('amount') as string,
      currency: formData.get('currency') as string,
      status: formData.get('status') as 'succeeded' | 'failed',
      reference: formData.get('reference') as string,
      hmac: formData.get('hmac') as string,
    };

    console.log('[Webhook V1] Received:', {
      payment_id: webhookData.payment_id,
      status: webhookData.status,
      reference: webhookData.reference,
      amount: webhookData.amount,
      currency: webhookData.currency,
    });

    // Verify webhook signature
    if (!verifyHitPayWebhookSignature(webhookData)) {
      console.error('[Webhook V1] HMAC verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Find order by reference number
    const order = await getOrderByHitPayReference(webhookData.reference);
    if (!order) {
      console.error(`[Webhook V1] Order not found for reference: ${webhookData.reference}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order has already been processed to ensure idempotency
    if (order.status !== 'pending_payment') {
      console.log(`[Webhook V1] Order ${order.id} already processed with status: ${order.status}`);
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
    }

    // Update order based on payment status
    const newStatus = webhookData.status === 'succeeded' ? 'awaiting_shipment' : 'payment_failed';
    const paymentDetails = {
      hitpayPaymentId: webhookData.payment_id,
      status: (webhookData.status === 'succeeded' ? 'succeeded' : 'failed') as 'succeeded' | 'failed',
      amountCharged: parseFloat(webhookData.amount),
      currency: webhookData.currency.toUpperCase(),
      transactionDate: new Date().toISOString(),
      webhookReceivedAt: new Date().toISOString(),
    };

    const updatedOrder = await updateOrderStatusInDB(order.id, newStatus, paymentDetails);
    
    if (!updatedOrder) {
      console.error(`[Webhook V1] Failed to update order: ${order.id}`);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log(`[Webhook V1] Successfully processed payment for order: ${order.id}, status: ${newStatus}`);
    
    // Return 200 OK to acknowledge webhook receipt
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });

  } catch (error) {
    console.error('[Webhook V1] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handle HitPay Webhook V2 (JSON payload)
async function handleWebhookV2(request: NextRequest): Promise<NextResponse> {
  try {
    // Get signature from headers
    const signature = request.headers.get('hitpay-signature');
    const eventType = request.headers.get('hitpay-event-type');
    const eventObject = request.headers.get('hitpay-event-object');

    if (!signature) {
      console.error('[Webhook V2] Missing signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Get raw payload for signature verification
    const rawPayload = await request.text();
    
    // Verify webhook signature
    if (!verifyHitPayWebhookV2Signature(rawPayload, signature)) {
      console.error('[Webhook V2] HMAC verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Parse JSON payload
    const webhookData: HitPayWebhookV2Payload = JSON.parse(rawPayload);

    console.log('[Webhook V2] Received:', {
      id: webhookData.id,
      status: webhookData.status,
      eventType,
      eventObject,
      reference_number: webhookData.reference_number,
      amount: webhookData.amount,
      currency: webhookData.currency,
    });

    // Only process charge events for now
    if (eventObject !== 'charge') {
      console.log(`[Webhook V2] Ignoring non-charge event: ${eventObject}`);
      return NextResponse.json({ message: 'Event acknowledged' }, { status: 200 });
    }

    // Find order by reference number
    const order = await getOrderByHitPayReference(webhookData.reference_number || '');
    if (!order) {
      console.error(`[Webhook V2] Order not found for reference: ${webhookData.reference_number}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order has already been processed to ensure idempotency
    if (order.status !== 'pending_payment') {
      console.log(`[Webhook V2] Order ${order.id} already processed with status: ${order.status}`);
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
    }

    // Update order based on payment status
    const newStatus = webhookData.status === 'succeeded' ? 'awaiting_shipment' : 'payment_failed';
    // Map HitPay V2 status to our payment status type
    let mappedPaymentStatus: 'pending' | 'succeeded' | 'failed' | 'requires_action';
    if (webhookData.status === 'succeeded') {
      mappedPaymentStatus = 'succeeded';
    } else if (webhookData.status === 'failed') {
      mappedPaymentStatus = 'failed';
    } else {
      mappedPaymentStatus = 'pending';
    }

    const paymentDetails = {
      hitpayPaymentId: webhookData.id,
      status: mappedPaymentStatus,
      amountCharged: webhookData.amount,
      currency: webhookData.currency.toUpperCase(),
      paymentMethodType: webhookData.payment_method?.type,
      paymentMethodBrand: webhookData.payment_method?.brand,
      paymentMethodLast4: webhookData.payment_method?.last_four,
      transactionDate: webhookData.created_at,
      webhookReceivedAt: new Date().toISOString(),
    };

    const updatedOrder = await updateOrderStatusInDB(order.id, newStatus, paymentDetails);
    
    if (!updatedOrder) {
      console.error(`[Webhook V2] Failed to update order: ${order.id}`);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log(`[Webhook V2] Successfully processed payment for order: ${order.id}, status: ${newStatus}`);
    
    // Return 200 OK to acknowledge webhook receipt
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });

  } catch (error) {
    console.error('[Webhook V2] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}