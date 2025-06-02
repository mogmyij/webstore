// utils/database.ts

import { Order } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';

// Mock database implementation using in-memory storage
// This will be easily replaceable with actual database operations
class MockDatabase {
  private orders: Map<string, Order> = new Map();
  private hitpayReferenceMap: Map<string, string> = new Map(); // Maps HitPay reference to order ID

  // Create a new pending order in the database
  async createPendingOrderInDB(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> {
    const orderId = uuidv4();
    const now = new Date().toISOString();
    
    const order: Order = {
      ...orderData,
      id: orderId,
      status: 'pending_payment',
      createdAt: now,
      updatedAt: now,
    };

    this.orders.set(orderId, order);
    
    // Map HitPay reference to order ID for webhook processing
    if (orderData.paymentDetails?.hitpayReferenceNumber) {
      this.hitpayReferenceMap.set(orderData.paymentDetails.hitpayReferenceNumber, orderId);
    }

    console.log(`[DB] Created pending order: ${orderId}`);
    return order;
  }

  // Update order status and payment details
  async updateOrderStatusInDB(orderId: string, status: Order['status'], paymentDetails?: Partial<Order['paymentDetails']>): Promise<Order | null> {
    const order = this.orders.get(orderId);
    if (!order) {
      console.error(`[DB] Order not found: ${orderId}`);
      return null;
    }

    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
      paymentDetails: {
        ...order.paymentDetails,
        ...paymentDetails,
      },
    };

    this.orders.set(orderId, updatedOrder);
    console.log(`[DB] Updated order ${orderId} status to: ${status}`);
    return updatedOrder;
  }

  // Get order by ID
  async getOrderFromDB(orderId: string): Promise<Order | null> {
    const order = this.orders.get(orderId);
    if (!order) {
      console.error(`[DB] Order not found: ${orderId}`);
      return null;
    }
    return order;
  }

  // Get order by HitPay reference number (for webhook processing)
  async getOrderByHitPayReference(reference: string): Promise<Order | null> {
    const orderId = this.hitpayReferenceMap.get(reference);
    if (!orderId) {
      console.error(`[DB] No order found for HitPay reference: ${reference}`);
      return null;
    }
    return this.getOrderFromDB(orderId);
  }

  // Update order with HitPay payment request ID
  async updateOrderWithHitPayId(orderId: string, hitpayPaymentRequestId: string): Promise<Order | null> {
    const order = this.orders.get(orderId);
    if (!order) {
      console.error(`[DB] Order not found: ${orderId}`);
      return null;
    }

    const updatedOrder: Order = {
      ...order,
      updatedAt: new Date().toISOString(),
      paymentDetails: {
        ...order.paymentDetails,
        hitpayPaymentRequestId,
      },
    };

    this.orders.set(orderId, updatedOrder);
    console.log(`[DB] Updated order ${orderId} with HitPay payment request ID: ${hitpayPaymentRequestId}`);
    return updatedOrder;
  }

  // Get all orders (for potential admin functionality)
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
}

// Singleton instance
const database = new MockDatabase();

// Exported functions for database operations
export const createPendingOrderInDB = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => 
  database.createPendingOrderInDB(orderData);

export const updateOrderStatusInDB = (orderId: string, status: Order['status'], paymentDetails?: Partial<Order['paymentDetails']>) => 
  database.updateOrderStatusInDB(orderId, status, paymentDetails);

export const getOrderFromDB = (orderId: string) => 
  database.getOrderFromDB(orderId);

export const getOrderByHitPayReference = (reference: string) => 
  database.getOrderByHitPayReference(reference);

export const updateOrderWithHitPayId = (orderId: string, hitpayPaymentRequestId: string) => 
  database.updateOrderWithHitPayId(orderId, hitpayPaymentRequestId);

export const getAllOrders = () => 
  database.getAllOrders();