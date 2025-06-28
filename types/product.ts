import type { Product as PrismaProduct } from '@prisma/client';

/**
 * Represents a Product as it is delivered from the API to the frontend.
 * This type is derived from the Prisma Product model but adapted for JSON serialization:
 * - Prisma's Decimal price field becomes a number for frontend calculations
 * - Date objects remain as Date objects (converted from ISO strings by client)
 * - JSON specifications field is typed as the expected structure
 * 
 * This serves as the single source of truth for Product data in the frontend,
 * ensuring consistency across all components and eliminating hardcoded interfaces.
 */
export type Product = Omit<PrismaProduct, 'price' | 'specifications'> & {
  price: number; // Converted from Prisma Decimal to number for frontend use
  specifications: {
    weightCapacity: number;
    dimensions?: string;
    batteryLife?: string;
  };
};

/**
 * Cart item extends the canonical Product type with quantity information.
 * This maintains type consistency between products and cart items.
 */
export interface CartItem extends Product {
  quantity: number;
}