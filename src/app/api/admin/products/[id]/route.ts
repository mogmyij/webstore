import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { prismaToProduct } from '@/types/product';

// PUT /api/admin/products/[id] - Update a product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Security check - only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  // Parse and validate the product ID
  const { id } = await params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    // Parse the update data from request body
    const body = await request.json();
    const {id, ...productUpdateData} = body;

    console.log(`Updating product ID: ${parsedId} with data: ${JSON.stringify(productUpdateData)}`)
    // Update the product
    const updatedPrismaProduct = await prisma.product.update({
      where: { id: parsedId },
      data: productUpdateData
    });

    // Transform the updated product to our canonical type using utility function
    const product = prismaToProduct(updatedPrismaProduct);

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Failed to update product:', error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        // Record to update not found
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Soft delete a product by ID (mark as inactive)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Security check - only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  // Parse and validate the product ID
  const { id } = await params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    // Soft delete: mark the product as inactive instead of deleting
    await prisma.product.update({
      where: { id: parsedId },
      data: { isActive: false }
    });

    // Return 204 No Content on successful deactivation
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to deactivate product:', error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        // Record to update does not exist
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to deactivate product' },
      { status: 500 }
    );
  }
}
