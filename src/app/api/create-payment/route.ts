// app/api/create-payment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { CreatePaymentRequest, CreatePaymentResponse, HitPayPaymentRequestPayload } from '@/types/hitpay';
import { CreateOrderData } from '@/types/order';
import { createPendingOrderInDB, updateOrderWithHitPayId } from '@/utils/database';
import { createHitPayPaymentRequest, generateOrderReference } from '@/utils/hitpay';
import prisma from '@/lib/prisma';
import { 
  sanitizeString, 
  validate, 
  EMAIL_REGEX, 
  SG_PHONE_REGEX, 
  GENERAL_NAME_REGEX, 
  ADDRESS_REGEX, 
  POSTAL_CODE_REGEX 
} from '@/utils/validation';

export async function POST(request: NextRequest): Promise<NextResponse<CreatePaymentResponse>> {
  try {
    // Parse and validate request body
    const body: CreatePaymentRequest = await request.json();
    
    // Step 2: Implement Input Sanitization and Validation (Part A)
    
    // Define validation rules for consistent validation
    const validationRules = {
      fullName: { regex: GENERAL_NAME_REGEX, maxLength: 100, name: 'Full Name' },
      email: { regex: EMAIL_REGEX, maxLength: 100, name: 'Email Address' },
      phone: { regex: SG_PHONE_REGEX, maxLength: 15, name: 'Phone Number' },
      address1: { regex: ADDRESS_REGEX, maxLength: 100, name: 'Address Line 1' },
      address2: { regex: ADDRESS_REGEX, maxLength: 100, name: 'Address Line 2 (Optional)' },
      city: { regex: GENERAL_NAME_REGEX, maxLength: 50, name: 'City' },
      postalCode: { regex: POSTAL_CODE_REGEX, maxLength: 6, name: 'Postal Code' },
    };

    // Validate and sanitize customer details
    const sanitizedCustomerDetails: any = {};
    
    if (!body.customerDetails?.fullName) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Full Name is required' },
        { status: 400 }
      );
    }
    const sanitizedFullName = sanitizeString(body.customerDetails.fullName);
    if (!validate(sanitizedFullName, validationRules.fullName.regex, validationRules.fullName.maxLength)) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Invalid Full Name provided' },
        { status: 400 }
      );
    }
    sanitizedCustomerDetails.fullName = sanitizedFullName;

    if (!body.customerDetails?.email) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Email Address is required' },
        { status: 400 }
      );
    }
    const sanitizedEmail = sanitizeString(body.customerDetails.email);
    if (!validate(sanitizedEmail, validationRules.email.regex, validationRules.email.maxLength)) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Invalid Email Address provided' },
        { status: 400 }
      );
    }
    sanitizedCustomerDetails.email = sanitizedEmail;

    if (!body.customerDetails?.phone) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Phone Number is required' },
        { status: 400 }
      );
    }
    const sanitizedPhone = sanitizeString(body.customerDetails.phone);
    if (!validate(sanitizedPhone, validationRules.phone.regex, validationRules.phone.maxLength)) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Invalid Phone Number provided' },
        { status: 400 }
      );
    }
    sanitizedCustomerDetails.phone = sanitizedPhone;

    // Validate and sanitize shipping address
    const sanitizedShippingAddress: any = {};
    
    if (!body.shippingAddress?.address1) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Address Line 1 is required' },
        { status: 400 }
      );
    }
    const sanitizedAddress1 = sanitizeString(body.shippingAddress.address1);
    if (!validate(sanitizedAddress1, validationRules.address1.regex, validationRules.address1.maxLength)) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Invalid Address Line 1 provided' },
        { status: 400 }
      );
    }
    sanitizedShippingAddress.address1 = sanitizedAddress1;

    // Address2 is optional
    if (body.shippingAddress?.address2) {
      const sanitizedAddress2 = sanitizeString(body.shippingAddress.address2);
      if (!validate(sanitizedAddress2, validationRules.address2.regex, validationRules.address2.maxLength)) {
        return NextResponse.json(
          { success: false, orderId: '', error: 'Invalid Address Line 2 (Optional) provided' },
          { status: 400 }
        );
      }
      sanitizedShippingAddress.address2 = sanitizedAddress2;
    }

    if (!body.shippingAddress?.city) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'City is required' },
        { status: 400 }
      );
    }
    const sanitizedCity = sanitizeString(body.shippingAddress.city);
    if (!validate(sanitizedCity, validationRules.city.regex, validationRules.city.maxLength)) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Invalid City provided' },
        { status: 400 }
      );
    }
    sanitizedShippingAddress.city = sanitizedCity;

    if (!body.shippingAddress?.postalCode) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Postal Code is required' },
        { status: 400 }
      );
    }
    const sanitizedPostalCode = sanitizeString(body.shippingAddress.postalCode);
    if (!validate(sanitizedPostalCode, validationRules.postalCode.regex, validationRules.postalCode.maxLength)) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Invalid Postal Code provided' },
        { status: 400 }
      );
    }
    sanitizedShippingAddress.postalCode = sanitizedPostalCode;

    // Validate cart items
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Validate each item in the cart
    for (const item of body.items) {
      if (!Number.isInteger(item.productId) || item.productId <= 0) {
        return NextResponse.json(
          { success: false, orderId: '', error: 'Invalid product ID in cart' },
          { status: 400 }
        );
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, orderId: '', error: 'Invalid quantity in cart' },
          { status: 400 }
        );
      }
    }

    // Step 3: Implement Price and Cart Verification (Part B)
    
    // Fetch products from database
    const productIds = body.items.map(item => item.productId);
    const uniqueProductIds = [...new Set(productIds)];
    
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: uniqueProductIds } },
    });

    // Verify product existence
    if (dbProducts.length !== uniqueProductIds.length) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Request contains an invalid product.' },
        { status: 400 }
      );
    }

    // Verify product activation status
    for (const product of dbProducts) {
      if (!product.isActive) {
        return NextResponse.json(
          { success: false, orderId: '', error: 'An item in your cart is no longer available.' },
          { status: 400 }
        );
      }
    }

    // Server-side price calculation and verification
    const productPriceMap = new Map(dbProducts.map(product => [product.id, Number(product.price)]));
    let serverCalculatedTotal = 0;

    for (const item of body.items) {
      const dbPrice = productPriceMap.get(item.productId);
      if (dbPrice === undefined) {
        return NextResponse.json(
          { success: false, orderId: '', error: 'Product price not found' },
          { status: 400 }
        );
      }
      const lineItemTotal = dbPrice * item.quantity;
      serverCalculatedTotal += lineItemTotal;
    }

    // Add shipping cost and subtract discount if provided
    const shippingCost = body.shippingCost || 0;
    const discountAmount = body.discountAmount || 0;
    serverCalculatedTotal = serverCalculatedTotal + shippingCost - discountAmount;

    // Compare with client-provided total (allow small epsilon for floating-point precision)
    if (Math.abs(serverCalculatedTotal - body.totalAmount) > 0.01) {
      return NextResponse.json(
        { success: false, orderId: '', error: 'Price tampering detected.' },
        { status: 400 }
      );
    }

    // Step 4: Update Order Creation Logic using sanitized and verified data
    
    // Validate currency (must be SGD as per requirements)
    const currency = 'SGD';
    
    // Generate unique order reference for HitPay
    const orderReference = generateOrderReference();
    
    // Prepare order data for database using sanitized data and server-calculated prices
    const orderData: CreateOrderData = {
      userFacingOrderId: orderReference,
      customerDetails: sanitizedCustomerDetails,
      shippingAddress: sanitizedShippingAddress,
      items: body.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: productPriceMap.get(item.productId)!, // Use database price, not client price
      })),
      subtotal: body.subtotal,
      discountAmount: body.discountAmount,
      shippingCost: body.shippingCost,
      totalAmount: serverCalculatedTotal, // Use server-calculated total
      customerNotes: body.customerNotes ? sanitizeString(body.customerNotes) : undefined,
      paymentDetails: {
        hitpayReferenceNumber: orderReference,
        currency,
      },
    };

    console.log(orderData)

    // Create pending order in database
    const order = await createPendingOrderInDB(orderData);
    
    // Prepare HitPay payment request payload with correct redirect URL
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Use NEXT_PUBLIC_HITPAY_REDIRECT_URL if available, otherwise fall back to baseUrl
    const confirmationPageBaseUrl = process.env.NEXT_PUBLIC_HITPAY_REDIRECT_URL || `${baseUrl}/checkout/confirmation`;
    
    const hitpayPayload: HitPayPaymentRequestPayload = {
      amount: serverCalculatedTotal.toFixed(2), // Use server-calculated total
      currency,
      email: sanitizedCustomerDetails.email, // Use sanitized email
      webhook: `${baseUrl}/api/webhook`,
      redirect_url: `${confirmationPageBaseUrl}?orderId=${order.id}`,
      reference_number: orderReference,
      name: sanitizedCustomerDetails.fullName, // Use sanitized name
      phone: sanitizedCustomerDetails.phone, // Use sanitized phone
      purpose: `Karvana Order ${orderReference}`,
      send_email: true, 
      allow_repeated_payments: false,
      add_admin_fee: true,
    };

    console.log(`[API] Creating HitPay payment request for order ${order.id} with redirect URL: ${hitpayPayload.redirect_url} and webhook: ${baseUrl}/api/webhook`);

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
