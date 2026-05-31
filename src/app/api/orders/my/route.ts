import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([]);
    }

    // Convert string IDs to numbers if needed, depending on how they are stored.
    // Our schema has order.id as Int, and myOrderIds are number[]
    const numericIds = ids.map(id => Number(id)).filter(id => !isNaN(id));

    if (numericIds.length === 0) {
      return NextResponse.json([]);
    }

    const orders = await prisma.order.findMany({
      where: {
        id: {
          in: numericIds
        }
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('POST /api/orders/my error:', error);
    return NextResponse.json({ error: 'Failed to fetch your orders' }, { status: 500 });
  }
}
