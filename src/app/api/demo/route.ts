import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const product = await prisma.product.create({
      data: {
        name: 'Demo iPhone',
        category: 'Smartphones',
        price: '999 $',
        image: 'https://example.com/iphone.png',
        colors: JSON.stringify(['#000000', '#FFFFFF']),
        badge: 'Yangi',
      },
    });
    return NextResponse.json({ success: true, id: product.id });
  } catch (e) {
    return NextResponse.json({ error: (e as any).message }, { status: 500 });
  }
}
