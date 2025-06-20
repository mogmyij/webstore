// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { seedProducts } from '../src/utils/database';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  try {
    await seedProducts();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });