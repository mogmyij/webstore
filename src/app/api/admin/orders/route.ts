import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/utils/database';
import { OrderResponse } from '@/types/hitpay';

export async function GET(request: NextRequest): Promise<NextResponse<OrderResponse | { orders: any[] }>> {
  try {
    // Security check: Only allow in development environment
    if (process.env.NODE_ENV !== "development") {
      return new NextResponse(null, { status: 404 });
    }

    // Get all orders for admin use
    const orders = await getAllOrders();

    console.log(`[ADMIN API] Retrieved ${orders.length} orders`);
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('[ADMIN API] Get orders error:', error);
    
    return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Internal server error' 
        },
        { status: 500 }
      );
  }
}