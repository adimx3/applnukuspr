import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse colors from JSON string
    const parsedProducts = products.map(p => ({
      ...p,
      colors: JSON.parse(p.colors)
    }));
    
    return NextResponse.json(parsedProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, price, image, colors, badge, description } = body;
    
    const product = await prisma.product.create({
      data: {
        name,
        category,
        price,
        image,
        colors: JSON.stringify(colors || []),
        badge: badge || null,
        description: description || null,
      }
    });
    
    return NextResponse.json({ ...product, colors: JSON.parse(product.colors) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
