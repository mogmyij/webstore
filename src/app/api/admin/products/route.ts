import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { prismaToProducts, prismaToProduct } from '@/types/product';

// GET /api/admin/products - Fetch all products
export async function GET() {
  // Security check - only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  try {
    // Fetch all products, sorted by dateAdded in descending order
    const prismaProducts = await prisma.product.findMany({
      orderBy: {
        dateAdded: 'desc'
      }
    });

    // Transform Prisma products to our canonical Product type using utility function
    const products = prismaToProducts(prismaProducts);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  // Security check - only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  try {
    // Parse the request body
    const body = await request.json();

    // Destructure to explicitly exclude 'id' from the creation data
    const { id, ...createData } = body;

    console.log("new product data: ", createData)

    // Basic validation - check required fields on the cleaned data
    if (!createData.name || typeof createData.name !== 'string') {
      return NextResponse.json(
        { error: 'Product name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!createData.price || typeof createData.price !== 'number') {
      return NextResponse.json(
        { error: 'Product price is required and must be a number' },
        { status: 400 }
      );
    }

    if (!createData.brand || typeof createData.brand !== 'string') {
      return NextResponse.json(
        { error: 'Product brand is required and must be a string' },
        { status: 400 }
      );
    }

    if (!createData.category || typeof createData.category !== 'string') {
      return NextResponse.json(
        { error: 'Product category is required and must be a string' },
        { status: 400 }
      );
    }

    // Create the new product using the data object that does not have an 'id'
    const newPrismaProduct = await prisma.product.create({
      data: createData
    });

    // Transform the created product to our canonical type using utility function
    const product = prismaToProduct(newPrismaProduct);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
