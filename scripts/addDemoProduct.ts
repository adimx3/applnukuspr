import { prisma } from '../src/lib/prisma.ts';

async function main() {
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
  console.log('✅ Demo product added with id:', product.id);
}

main()
  .catch((e) => {
    console.error('❌ Error adding demo product:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
