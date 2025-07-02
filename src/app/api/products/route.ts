import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { prismaToProducts } from '@/types/product';

// GET /api/products - Fetch active products for public shop
export async function GET() {
  try {
    // Fetch only active products, sorted by dateAdded in descending order
    const prismaProducts = await prisma.product.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        dateAdded: 'desc'
      }
    });

    // Transform Prisma products to our canonical Product type using utility function
    const products = prismaToProducts(prismaProducts);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch active products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
