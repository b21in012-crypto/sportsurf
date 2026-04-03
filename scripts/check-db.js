const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const heroes = await prisma.heroSection.findMany();
    console.log('HeroSections:', JSON.stringify(heroes, null, 2));

    const categories = await prisma.category.findMany();
    console.log('Categories:', JSON.stringify(categories.map(c => ({ id: c.id, label: c.label })), null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
