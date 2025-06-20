// utils/database.ts (Prisma Implementation)

import prisma from '@/lib/prisma';
import { Order, OrderStatus, OrderPaymentDetails, CreateOrderData } from '@/types/order';
import { Prisma } from '@prisma/client';

/**
 * Creates a new pending order in the database.
 * This transactionally creates the Order and its associated OrderItems.
 */
export const createPendingOrderInDB = async (orderData: CreateOrderData): Promise<Order> => {
  console.log('[DB] Creating pending order with data:', orderData);
  
  let addressParts = [
    orderData.shippingAddress.address1,
    orderData.shippingAddress.address2,
    orderData.shippingAddress.country,
    orderData.shippingAddress.postalCode,
  ]
  addressParts = addressParts.filter(x => x)
  const finalAddress: string = addressParts.join(", ")

  const createdOrder = await prisma.order.create({
    data: {
      userFacingOrderId: orderData.userFacingOrderId,
      customerName: orderData.customerDetails.fullName,
      customerEmail: orderData.customerDetails.email,
      customerPhone: orderData.customerDetails.phone,
      shippingAddress: finalAddress,
      customerNotes: orderData.customerNotes,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost || 0,
      discountAmount: orderData.discountAmount || 0,
      totalAmount: orderData.totalAmount,
      status: 'pending_payment',
      items: {
        create: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      transaction: {
        create: {
          hitpayReferenceNumber: orderData.paymentDetails?.hitpayReferenceNumber,
          status: 'pending',
          currency: orderData.paymentDetails?.currency,
        },
      },
    },
    include: { items: { include: { product: true } }, transaction: true },
  });
  
  console.log(`[DB] Pending order created with ID: ${createdOrder.id}`);
  return transformPrismaOrderToOrder(createdOrder);
};

/**
 * Associates a HitPay Payment Request ID with an order's transaction.
 */
export const updateOrderWithHitPayId = async (orderId: string, hitpayPaymentRequestId: string): Promise<Order | null> => {
  console.log(`[DB] Updating order ${orderId} with HitPay request ID: ${hitpayPaymentRequestId}`);
  
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        transaction: {
          update: {
            paymentRequestId: hitpayPaymentRequestId,
          },
        },
      },
      include: { items: { include: { product: true } }, transaction: true },
    });
    return transformPrismaOrderToOrder(updatedOrder);
  } catch (error) {
    console.error(`[DB] Error updating order ${orderId}:`, error);
    return null;
  }
};

/**
 * Updates an order's status and payment details, typically after a webhook is received.
 */
export const updateOrderStatusInDB = async (
  orderId: string, 
  newStatus: OrderStatus, 
  paymentDetails: Partial<OrderPaymentDetails>
): Promise<Order | null> => {
  console.log(`[DB] Updating order ${orderId} status to ${newStatus} with payment details:`, paymentDetails);
  
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        transaction: {
          update: {
            paymentId: paymentDetails.hitpayPaymentId,
            status: paymentDetails.status as any,
            amount: paymentDetails.amountCharged,
            currency: paymentDetails.currency,
            paymentMethodType: paymentDetails.paymentMethodType,
            paymentMethodBrand: paymentDetails.paymentMethodBrand,
            paymentMethodLast4: paymentDetails.paymentMethodLast4,
            transactionDate: paymentDetails.transactionDate ? new Date(paymentDetails.transactionDate) : null,
            webhookReceivedAt: new Date(),
          },
        },
      },
      include: { items: { include: { product: true } }, transaction: true },
    });
    return transformPrismaOrderToOrder(updatedOrder);
  } catch (error) {
    console.error(`[DB] Error updating order ${orderId} status:`, error);
    return null;
  }
};

/**
 * Retrieves a single order by its internal ID.
 */
export const getOrderFromDB = async (orderId: string): Promise<Order | null> => {
  console.log(`[DB] Fetching order by ID: ${orderId}`);
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, transaction: true },
    });
    return order ? transformPrismaOrderToOrder(order) : null;
  } catch (error) {
    console.error(`[DB] Error fetching order ${orderId}:`, error);
    return null;
  }
};

/**
 * Finds an order by the HitPay reference number.
 */
export const getOrderByHitPayReference = async (referenceNumber: string): Promise<Order | null> => {
  console.log(`[DB] Fetching order by HitPay reference: ${referenceNumber}`);
  
  try {
    const transaction = await prisma.hitPayTransaction.findUnique({ 
      where: { hitpayReferenceNumber: referenceNumber },
      include: { order: { include: { items: { include: { product: true } }, transaction: true } } }
    });

    if (!transaction?.order) return null;
    
    return transformPrismaOrderToOrder(transaction.order);
  } catch (error) {
    console.error(`[DB] Error fetching order by HitPay reference ${referenceNumber}:`, error);
    return null;
  }
};

/**
 * Retrieves all orders from the database.
 * NOTE: In a real app, this should have pagination.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  console.log(`[DB] Fetching all orders`);
  
  try {
    const allOrders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, transaction: true },
      orderBy: { createdAt: 'desc' },
    });
    return allOrders.map(transformPrismaOrderToOrder);
  } catch (error) {
    console.error(`[DB] Error fetching all orders:`, error);
    return [];
  }
};

/**
 * Seeds the database with products from the mock data file.
 * This is a utility function for development and should not be exposed as an API route.
 */
import { products as mockProducts } from '@/data/Products';

export const seedProducts = async () => {
  console.log('Seeding products...');
  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        price: product.price, // Let Prisma handle the Decimal conversion
        image: product.image,
        images: product.images || [],
        brand: product.brand,
        category: product.category,
        description: product.description,
        longDescription: product.longDescription,
        specifications: product.specifications, // Let Prisma handle the JSON conversion
        features: product.features,
        dateAdded: product.dateAdded,
      },
    });
  }
  console.log('Product seeding finished.');
};

/**
 * Helper function to transform Prisma order data to our Order type
 */
function transformPrismaOrderToOrder(prismaOrder: any): Order {
  return {
    id: prismaOrder.id,
    userFacingOrderId: prismaOrder.userFacingOrderId,
    createdAt: prismaOrder.createdAt.toISOString(),
    updatedAt: prismaOrder.updatedAt.toISOString(),
    customerDetails: {
      fullName: prismaOrder.customerName,
      email: prismaOrder.customerEmail,
      phone: prismaOrder.customerPhone,
    },
    shippingAddress: {
      address1: prismaOrder.shippingAddress,
      city: '',
      postalCode: '',
      country: 'Singapore',
    },
    items: prismaOrder.items.map((item: any) => ({
      productId: item.productId,
      name: item.product.name,
      price: parseFloat(item.price.toString()),
      quantity: item.quantity,
      image: item.product.image,
    })),
    subtotal: parseFloat(prismaOrder.subtotal.toString()),
    discountAmount: parseFloat(prismaOrder.discountAmount.toString()),
    shippingCost: parseFloat(prismaOrder.shippingCost.toString()),
    totalAmount: parseFloat(prismaOrder.totalAmount.toString()),
    status: prismaOrder.status,
    customerNotes: prismaOrder.customerNotes,
    paymentDetails: prismaOrder.transaction ? {
      hitpayPaymentRequestId: prismaOrder.transaction.paymentRequestId,
      hitpayPaymentId: prismaOrder.transaction.paymentId,
      hitpayReferenceNumber: prismaOrder.transaction.hitpayReferenceNumber,
      status: prismaOrder.transaction.status,
      amountCharged: prismaOrder.transaction.amount ? parseFloat(prismaOrder.transaction.amount.toString()) : undefined,
      currency: prismaOrder.transaction.currency,
      paymentMethodType: prismaOrder.transaction.paymentMethodType,
      paymentMethodBrand: prismaOrder.transaction.paymentMethodBrand,
      paymentMethodLast4: prismaOrder.transaction.paymentMethodLast4,
      transactionDate: prismaOrder.transaction.transactionDate?.toISOString(),
      webhookReceivedAt: prismaOrder.transaction.webhookReceivedAt?.toISOString(),
    } : undefined,
  };
}
