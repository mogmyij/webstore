// app/api/create-payment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { CreatePaymentRequest, CreatePaymentResponse, HitPayPaymentRequestPayload } from '@/types/hitpay';
import { CreateOrderData } from '@/types/order';
import { createPendingOrderInDB, updateOrderWithHitPayId } from '@/utils/database';
import { createHitPayPaymentRequest, generateOrderReference } from '@/utils/hitpay';

export async function POST(request: NextRequest): Promise<NextResponse<CreatePaymentResponse>> {
  try {
    // Parse and validate request body
    const body: CreatePaymentRequest = await request.json();
    
    // Validate required fields
    if (!body.customerDetails?.fullName || !body.customerDetails?.email || !body.customerDetails?.phone) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Missing required customer details' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!body.totalAmount || body.totalAmount <= 0) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // ----------------------------- TODO: server side validation of important fields --------------------------------------
    // valide: any fields that could pose a sql injection attack vulnarability, price fileds that could be wrong WRT the items in the order

    // Validate currency (must be SGD as per requirements)
    const currency = 'SGD';
    
    // Generate unique order reference for HitPay
    const orderReference = generateOrderReference();
    
    // Prepare order data for database using the correct CreateOrderData type
    const orderData: CreateOrderData = {
      userFacingOrderId: orderReference,
      customerDetails: body.customerDetails,
      shippingAddress: body.shippingAddress,
      items: body.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: body.subtotal,
      discountAmount: body.discountAmount,
      shippingCost: body.shippingCost,
      totalAmount: body.totalAmount,
      customerNotes: body.customerNotes,
      paymentDetails: {
        hitpayReferenceNumber: orderReference,
        currency,
      },
    };

    console.log(orderData)

    // Create pending order in database
    const order = await createPendingOrderInDB(orderData);
    
    // Prepare HitPay payment request payload with correct redirect URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Use NEXT_PUBLIC_HITPAY_REDIRECT_URL if available, otherwise fall back to baseUrl
    const confirmationPageBaseUrl = process.env.NEXT_PUBLIC_HITPAY_REDIRECT_URL || `${baseUrl}/checkout/confirmation`;
    
    const hitpayPayload: HitPayPaymentRequestPayload = {
      amount: body.totalAmount.toFixed(2),
      currency,
      email: body.customerDetails.email,
      webhook: `${baseUrl}/api/webhook`,
      redirect_url: `${confirmationPageBaseUrl}?orderId=${order.id}`,
      reference_number: orderReference,
      name: body.customerDetails.fullName,
      phone: body.customerDetails.phone,
      purpose: `Karvana Order ${orderReference}`,
      send_email: true, 
      allow_repeated_payments: false,
      add_admin_fee: true,
    };

    console.log(`[API] Creating HitPay payment request for order ${order.id} with redirect URL: ${hitpayPayload.redirect_url}`);

    console.log("test")

    // Create payment request with HitPay
    const hitpayResponse = await createHitPayPaymentRequest(hitpayPayload);
    
    // Update order with HitPay payment request ID
    await updateOrderWithHitPayId(order.id, hitpayResponse.id);
    
    console.log(`[API] HitPay payment request created successfully. Payment URL: ${hitpayResponse.url}`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      orderId: order.id,
      hitpayUrl: hitpayResponse.url,
      hitpayPaymentRequestId: hitpayResponse.id,
    });

  } catch (error) {
    console.error('[API] Create payment error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        orderId: '', 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
