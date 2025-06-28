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

/**
 * Converts a Prisma Product to our canonical Product type.
 * This utility function ensures consistent transformation across all API endpoints
 * and follows the DRY principle.
 * 
 * @param prismaProduct - The product from Prisma with Decimal price and JSON specifications
 * @returns Product with number price and typed specifications
 */
export function prismaToProduct(prismaProduct: PrismaProduct): Product {
  return {
    ...prismaProduct,
    price: parseFloat(prismaProduct.price.toString()), // Convert Decimal to number
    specifications: prismaProduct.specifications as {
      weightCapacity: number;
      dimensions?: string;
      batteryLife?: string;
    }
  };
}

/**
 * Converts an array of Prisma Products to our canonical Product type array.
 * Convenience function for bulk transformations.
 * 
 * @param prismaProducts - Array of products from Prisma
 * @returns Array of Products with proper typing
 */
export function prismaToProducts(prismaProducts: PrismaProduct[]): Product[] {
  return prismaProducts.map(prismaToProduct);
}

/**
 * Converts date strings back to Date objects.
 * This is commonly needed when receiving JSON data from APIs where dates are serialized as strings.
 * 
 * @param product - Product with potentially stringified dateAdded
 * @returns Product with dateAdded as Date object
 */
export function ensureProductDates(product: any): Product {
  return {
    ...product,
    dateAdded: typeof product.dateAdded === 'string' ? new Date(product.dateAdded) : product.dateAdded
  };
}

/**
 * Converts an array of products ensuring all dates are Date objects.
 * Convenience function for bulk date conversions.
 * 
 * @param products - Array of products with potentially stringified dates
 * @returns Array of products with proper Date objects
 */
export function ensureProductsDates(products: any[]): Product[] {
  return products.map(ensureProductDates);
}