const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find some categories
  const categories = await prisma.category.findMany();
  
  if (categories.length === 0) {
    console.log("No categories found to link.");
    return;
  }

  const partners = [
    { name: "Global Turf Solutions", imageUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27?auto=format&fit=contain&w=200", isGlobal: true, order: 1 },
    { name: "AquaTech Infrastructure", imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=contain&w=200", isGlobal: true, order: 2 },
    { name: "Elite Courts Inc", imageUrl: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=contain&w=200", isGlobal: true, order: 3 },
    { name: "SportSafe Labs", imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=contain&w=200", isGlobal: true, order: 4 },
  ];

  for (const p of partners) {
    await prisma.collaboration.create({
      data: p
    });
  }

  console.log("Seeded 4 global partners.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
