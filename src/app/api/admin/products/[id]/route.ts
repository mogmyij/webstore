import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

// PUT /api/admin/products/[id] - Update a product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Security check - only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  // Parse and validate the product ID
  const parsedId = parseInt(params.id);
  if (isNaN(parsedId)) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    // Parse the update data from request body
    const body = await request.json();

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: parsedId },
      data: body
    });

    return NextResponse.json(updatedProduct, { status: 200 });
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

// DELETE /api/admin/products/[id] - Delete a product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Security check - only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  // Parse and validate the product ID
  const parsedId = parseInt(params.id);
  if (isNaN(parsedId)) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    // Delete the product
    await prisma.product.delete({
      where: { id: parsedId }
    });

    // Return 204 No Content on successful deletion
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete product:', error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        // Foreign key constraint failed - product is referenced in orders
        return NextResponse.json(
          { error: 'Cannot delete product. It is referenced in one or more orders.' },
          { status: 409 }
        );
      }
      
      if (error.code === 'P2025') {
        // Record to delete does not exist
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}