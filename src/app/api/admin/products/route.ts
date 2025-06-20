import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

// GET /api/admin/products - Fetch all products
export async function GET() {
  // Security check - only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  try {
    // Fetch all products, sorted by dateAdded in descending order
    const products = await prisma.product.findMany({
      orderBy: {
        dateAdded: 'desc'
      }
    });

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

    // Basic validation - check required fields
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Product name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!body.price || typeof body.price !== 'number') {
      return NextResponse.json(
        { error: 'Product price is required and must be a number' },
        { status: 400 }
      );
    }

    if (!body.brand || typeof body.brand !== 'string') {
      return NextResponse.json(
        { error: 'Product brand is required and must be a string' },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== 'string') {
      return NextResponse.json(
        { error: 'Product category is required and must be a string' },
        { status: 400 }
      );
    }

    // Create the new product
    const newProduct = await prisma.product.create({
      data: body
    });

    return NextResponse.json(newProduct, { status: 201 });
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