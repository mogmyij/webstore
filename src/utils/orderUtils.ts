// utils/orderUtils.ts

import { CartItem } from '@/context/CartContext';
import { Order, OrderItem, OrderCustomerDetails, OrderShippingAddress } from '@/types/order';

// Interface for checkout form data (matches CheckoutFormData from checkout page)
interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
}

/**
 * Converts CartItem[] to OrderItem[]
 * Maps cart items to order items, preserving pricing at time of order
 */
export function cartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
  return cartItems.map(item => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  }));
}

/**
 * Converts checkout form data to OrderCustomerDetails
 */
export function formDataToCustomerDetails(formData: CheckoutFormData): OrderCustomerDetails {
  return {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone
  };
}

/**
 * Converts checkout form data to OrderShippingAddress
 */
export function formDataToShippingAddress(formData: CheckoutFormData): OrderShippingAddress {
  return {
    address1: formData.address1,
    address2: formData.address2 || undefined,
    city: formData.city,
    postalCode: formData.postalCode,
    country: 'Singapore' // Default as per requirements
  };
}

/**
 * Calculates financial totals from cart items
 */
export function calculateOrderTotals(cartItems: CartItem[], discountAmount: number = 0, shippingCost: number = 0) {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalAmount = subtotal - discountAmount + shippingCost;
  
  return {
    subtotal,
    discountAmount: discountAmount > 0 ? discountAmount : undefined,
    shippingCost: shippingCost > 0 ? shippingCost : undefined,
    totalAmount
  };
}

/**
 * Generates a unique order ID (UUID v4)
 */
export function generateOrderId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generates a user-facing order ID
 * Format: KV-YYYYMMDD-NNNNNN (e.g., KV-20250527-001234)
 */
export function generateUserFacingOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `KV-${year}${month}${day}-${random}`;
}

/**
 * Creates a new Order object from cart and checkout data
 * This is the main function that will be used during order creation
 */
export function createOrderFromCheckoutData(
  cartItems: CartItem[],
  formData: CheckoutFormData,
  discountAmount: number = 0,
  shippingCost: number = 0
): Omit<Order, 'paymentDetails'> {
  const now = new Date().toISOString();
  const totals = calculateOrderTotals(cartItems, discountAmount, shippingCost);
  
  return {
    id: generateOrderId(),
    userFacingOrderId: generateUserFacingOrderId(),
    createdAt: now,
    updatedAt: now,
    customerDetails: formDataToCustomerDetails(formData),
    shippingAddress: formDataToShippingAddress(formData),
    items: cartItemsToOrderItems(cartItems),
    ...totals,
    status: 'pending_payment'
  };
}

/**
 * Validates that an order has all required fields
 */
export function validateOrderData(order: Partial<Order>): string[] {
  const errors: string[] = [];
  
  if (!order.id) errors.push('Order ID is required');
  if (!order.customerDetails?.fullName) errors.push('Customer full name is required');
  if (!order.customerDetails?.email) errors.push('Customer email is required');
  if (!order.customerDetails?.phone) errors.push('Customer phone is required');
  if (!order.shippingAddress?.address1) errors.push('Shipping address is required');
  if (!order.shippingAddress?.city) errors.push('Shipping city is required');
  if (!order.shippingAddress?.postalCode) errors.push('Postal code is required');
  if (!order.items || order.items.length === 0) errors.push('Order must contain at least one item');
  if (typeof order.totalAmount !== 'number' || order.totalAmount <= 0) errors.push('Order total must be greater than 0');
  
  return errors;
}