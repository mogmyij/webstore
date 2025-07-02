import { NextRequest, NextResponse } from 'next/server';
import { OrderResponse } from '@/types/hitpay';
import { updateOrderStatusInDB } from '@/utils/database';
import { OrderStatus } from '@/types/order';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
): Promise<NextResponse<OrderResponse>> {
  try {
    // Security check: Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse(null, { status: 404 });
    }

    const { orderId } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: OrderStatus[] = [
      'pending_payment',
      'payment_failed',
      'awaiting_shipment',
      'shipped',
      'delivered',
      'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status provided' },
        { status: 400 }
      );
    }

    console.log(`[API] Updating order ${orderId} status to ${status}`);

    // Update order status in database
    const updatedOrder = await updateOrderStatusInDB(orderId, status, {});

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found or update failed' },
        { status: 404 }
      );
    }

    console.log(`[API] Successfully updated order ${orderId} status`);
    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });

  } catch (error) {
    console.error('[API] Update order status error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}