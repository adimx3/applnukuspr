import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, category, price, image, colors, badge, description } = await req.json();
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        category,
        price,
        image,
        colors: JSON.stringify(colors || []),
        badge: badge || null,
        description: description || null,
      },
    });
    return NextResponse.json({ ...updated, colors: JSON.parse(updated.colors) });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
