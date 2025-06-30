// app/api/orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { OrderResponse } from '@/types/hitpay';
import { getOrderFromDB, getAllOrders } from '@/utils/database';

export async function GET(request: NextRequest): Promise<NextResponse<OrderResponse | { orders: any[] }>> {
  try {
		// Security check: Only allow in development environment
		if (process.env.NODE_ENV !== "development") {
			return new NextResponse(null, { status: 404 });
		}

		const { searchParams } = new URL(request.url);
		const orderId = searchParams.get("id");

		// If orderId is provided, fetch specific order
		if (orderId) {
			const order = await getOrderFromDB(orderId);

			if (!order) {
				return NextResponse.json(
					{ success: false, error: "Order not found" },
					{ status: 404 }
				);
			}

			console.log(`[API] Retrieved order: ${orderId}`);
			return NextResponse.json({
				success: true,
				order,
			});
		}

		// If no orderId provided, return all orders (for admin use only)
		const orders = await getAllOrders();

		console.log(`[API] Retrieved ${orders.length} orders`);
		return NextResponse.json({
			success: true,
			orders,
		});
	} catch (error) {
    console.error('[API] Get orders error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}