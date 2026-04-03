const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HEROES = [
  {
    page: "about",
    title: "The SportSurf Legacy: Physics Over Friction",
    subtitle: "WE DON'T JUST BUILD SURFACES; WE ENGINEER AN ATHLETIC ADVANTAGE.",
    imageUrl: "/images/hero_legacy.jpg",
    ctaText: "Our Story",
    ctaLink: "#origin",
    textColor: "#ffffff",
    overlayOpacity: 0.5
  },
  {
    page: "contact",
    title: "Architect Your Future Arena",
    subtitle: "FROM FEASIBILITY STUDIES TO FINISHED FLOORS, WE ARE YOUR PARTNERS.",
    imageUrl: "/images/hero_contact_arena.jpg",
    ctaText: "Get Free Quote",
    ctaLink: "#form",
    textColor: "#ffffff",
    overlayOpacity: 0.4
  },
  {
    page: "surface-sports",
    title: "Unmatched Terrestrial Performance",
    subtitle: "PRECISION-ENGINEERED SURFACES FOR THE WORLD'S TOUGHEST GAMES.",
    imageUrl: "/images/hero_surface.jpg",
    ctaText: "View Products",
    ctaLink: "/products?category=Surface%20sports",
    textColor: "#ffffff",
    overlayOpacity: 0.4
  },
  {
    page: "water-sports",
    title: "Aquatic Excellence Reimagined",
    subtitle: "PREMIUM FILTRATION AND ENCLOSURE SOLUTIONS FOR ELITE SWIMMERS.",
    imageUrl: "/images/hero_water.jpg",
    ctaText: "View Products",
    ctaLink: "/products?category=Water%20sports",
    textColor: "#ffffff",
    overlayOpacity: 0.4
  },
  {
    page: "small-sports",
    title: "Micro-Sports, Macro-Impact",
    subtitle: "DENSE PERFORMANCE SPACES FOR PINPOINT ATHLETIC AGILITY.",
    imageUrl: "/images/hero_small.jpg",
    ctaText: "View Products",
    ctaLink: "/products?category=Small%20sports",
    textColor: "#ffffff",
    overlayOpacity: 0.4
  },
  {
    page: "budget-sports",
    title: "Democratic Athletic Excellence",
    subtitle: "HITTING THE SWEET SPOT BETWEEN COST-EFFICIENCY AND PEAK PROTECTION.",
    imageUrl: "/images/hero_budget.jpg",
    ctaText: "View Products",
    ctaLink: "/products?category=Budget%20sports",
    textColor: "#ffffff",
    overlayOpacity: 0.4
  }
];

async function main() {
  console.log("Seeding Inner Page Heroes...");
  for (const h of HEROES) {
    try {
      await prisma.heroSection.upsert({
        where: { page: h.page },
        update: h,
        create: h,
      });
      console.log(`- Upserted hero for: ${h.page}`);
    } catch (err) {
      console.error(`- Failed: ${h.page}`, err.message);
    }
  }
  console.log("Seeding Completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
