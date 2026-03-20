const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Manually including data to avoid import issues in pure Node environment
const productsData = [
  {
    "slug": "football-turf",
    "name": "Football Turf",
    "category": "Surface sports",
    "shortSpec": "Surface sports Infrastructure",
    "description": "Complete and premium setup for Football Turf customized for maximum performance and durability.",
    "isNew": true,
    "isFeatured": true,
    "imageUrl": "/images/sports/surface_sports.png"
  },
  {
    "slug": "hockey-surface",
    "name": "Hockey Surface",
    "category": "Surface sports",
    "shortSpec": "Surface sports Infrastructure",
    "description": "Complete and premium setup for Hockey Surface customized for maximum performance and durability.",
    "isNew": false,
    "isFeatured": false,
    "imageUrl": "/images/turf_texture.png"
  },
  {
    "slug": "tennis-court",
    "name": "Tennis Court",
    "category": "Surface sports",
    "shortSpec": "Surface sports Infrastructure",
    "description": "Complete and premium setup for Tennis Court customized for maximum performance and durability.",
    "isNew": false,
    "isFeatured": false,
    "imageUrl": "/images/indian_complex_detail.png"
  },
  {
    "slug": "athletics-track",
    "name": "Athletics Track",
    "category": "Surface sports",
    "shortSpec": "Surface sports Infrastructure",
    "description": "Complete and premium setup for Athletics Track customized for maximum performance and durability.",
    "isNew": true,
    "isFeatured": false,
    "imageUrl": "/images/sports/surface_sports.png"
  },
  {
    "slug": "multi-sport-court",
    "name": "Multi-Sport Court",
    "category": "Surface sports",
    "shortSpec": "Surface sports Infrastructure",
    "description": "Complete and premium setup for Multi-Sport Court customized for maximum performance and durability.",
    "isNew": false,
    "isFeatured": true,
    "imageUrl": "/images/turf_texture.png"
  }
];

const projectsData = [
  {
    name: "Delhi Public School Sports Complex",
    city: "New Delhi",
    state: "Delhi",
    surface: "Synthetic Turf",
    area: "8,400 sqm",
    year: "2023",
    imageUrl: "/images/project_1.png",
  },
  {
    name: "St. Xavier's International Arena",
    city: "Mumbai",
    state: "Maharashtra",
    surface: "Running Track",
    area: "4,200 sqm",
    year: "2022",
    imageUrl: "/images/project_2.png",
  },
  {
    name: "Lalit Modi Stadium Refurbishment",
    city: "Bangalore",
    state: "Karnataka",
    surface: "Multi-Sport Flooring",
    area: "12,000 sqm",
    year: "2024",
    imageUrl: "/images/indian_urban_turf.png",
  },
];

const testimonialsData = [
  {
    name: "Dr. Arvind Kumar",
    institution: "Director, DPS Global",
    quote: "SportSurf Antigravity transformed our campus. Their engineering precision is unlike anything we've seen in India.",
    avatar: "AK"
  },
  {
    name: "Sarah Mehra",
    institution: "Sports Coordinator, Heritage School",
    quote: "The quality of the synthetic turf is world-class. Our students are performing at higher levels with less injury risk.",
    avatar: "SM"
  },
];

async function main() {
  console.log("Starting full database seed...");

  // 1. Navbar Categories
  console.log("Seeding Categories (Navbar)...");
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: [
      { label: "Surface sports", order: 10, imageUrl: "/images/sports/surface_sports.png", description: "Professional grade playing surfaces" },
      { label: "Water sports", order: 20, imageUrl: "/images/sports/water_sports.png", description: "Aquatic infrastructure and pool systems" },
      { label: "Small sports", order: 30, imageUrl: "/images/sports/small_sports.png", description: "Indoor and specialized small-area sports" },
      { label: "Budget sports", order: 40, imageUrl: "/images/basketball_court.png", description: "Cost-effective sports solutions" },
      { label: "Sports academies", order: 50, imageUrl: "/images/hero_indian_arena.png" },
      { label: "Play zones", order: 60, imageUrl: "/images/hero_sports_bg.png" },
    ]
  });

  // 2. Homepage Grid Items
  console.log("Seeding Homepage Grid Items...");
  await prisma.homepageGridItem.deleteMany();
  await prisma.homepageGridItem.createMany({
    data: [
      { label: "Surface sports", order: 10, imageUrl: "/images/sports/surface_sports.png", description: "Synthetic turf, running tracks & multi-sport courts", href: "/products?category=surface-sports" },
      { label: "Water sports", order: 20, imageUrl: "/images/sports/water_sports.png", description: "Kayaking lanes, pool decking & aquatic gear", href: "/products?category=water-sports" },
      { label: "Small sports", order: 30, imageUrl: "/images/sports/small_sports.png", description: "Badminton, table tennis & squash setups", href: "/products?category=small-sports" },
      { label: "Budget sports", order: 40, imageUrl: "/images/basketball_court.png", description: "Cost-effective solutions for schools & communities", href: "/products?category=budget-sports" },
      { label: "Adventure sports games", order: 50, imageUrl: "/images/hero_indian_arena.png", description: "Climbing walls, rope courses & obstacle setups", href: "/products?category=adventure-sports" },
      { label: "Play zones", order: 60, imageUrl: "/images/hero_sports_bg.png", description: "Premium children's play areas & soft surfaces", href: "/products?category=play-zones" },
    ]
  });

  // 3. Navigation Menu
  console.log("Seeding Navigation Menu...");
  await prisma.navigationItem.deleteMany();
  await prisma.navigationItem.createMany({
    data: [
      { label: "Products", href: "/products", order: 10 },
      { label: "Projects", href: "/projects", order: 20 },
      { label: "About Us", href: "/about", order: 30 },
      { label: "Contact", href: "/contact", order: 40 },
    ]
  });

  // 4. Announcement Ticker
  console.log("Seeding Ticker Items...");
  await prisma.tickerUpdate.deleteMany();
  await prisma.tickerUpdate.createMany({
    data: [
      { text: "ISO 9001:2015 Certified Sports Infrastructure Provider", order: 10 },
      { text: "Free Site Visit & Expert Consultation Across India", order: 20 },
      { text: "Up to 10% Discount on First Commercial Turf Project", order: 30 },
    ]
  });

  // 5. Products
  console.log("Seeding Products...");
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: productsData
  });

  // 3. Projects
  console.log("Seeding Projects...");
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: projectsData
  });

  // 4. Testimonials
  console.log("Seeding Testimonials...");
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: testimonialsData
  });

  // 5. Hero Sections
  console.log("Seeding Hero Sections...");
  await prisma.heroSection.deleteMany();
  await prisma.heroSection.createMany({
    data: [
      {
        page: "home",
        title: "India's Premiere Sports Infrastructure Powerhouse",
        subtitle: "Engineering excellence for the next generation of athletes.",
        imageUrl: "https://images.unsplash.com/photo-1540742642149-c1432f78be62?q=80&w=2070",
        ctaText: "Explore Solutions",
        ctaLink: "/products",
        textColor: "#ffffff",
      },
      {
        page: "products",
        title: "Global Surfaces, Local Mastery",
        subtitle: "Explore our range of FIFA, ITF and BWF certified sports surfaces.",
        imageUrl: "/images/indian_complex_detail.png",
        ctaText: "Request Technical Specs",
        ctaLink: "/contact",
        textColor: "#ffffff",
      }
    ]
  });

  // 6. Site Settings (About & Contact)
  console.log("Seeding Site Settings...");
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {
      siteName: "SPORTSURF ANTIGRAVITY",
      aboutText: "We are at the forefront of sports infrastructure in India, bringing together advanced materials science and civil engineering to create spaces where champions are born.",
      aboutOriginTitle: "A Legacy of Performance",
      aboutOriginText: "Founded on the principle of 'Antigravity' – the idea that sports surfaces should empower movement without the burden of impact or wear.",
      officeHours: "Mon - Sat: 9:00 AM - 7:00 PM",
      whatsappNumber: "+91 98765 43210",
      serviceArea: "Pan India, Middle East, SE Asia",
      statsJson: JSON.stringify([
        { value: 500, suffix: "+", label: "Projects Completed" },
        { value: 18, suffix: "+", label: "States Served" },
        { value: 200, suffix: "+", label: "Institutional Clients" },
        { value: 10, suffix: "+", label: "Years of Trust" }
      ]),
      certsJson: JSON.stringify([
        { title: "ISO 9001:2015" }, { title: "FIFA Quality" }, { title: "IAAF Certified" }, { title: "BIS Approved" }, { title: "NSIC" }
      ])
    },
    create: {
      id: "global",
      siteName: "SPORTSURF ANTIGRAVITY",
      primaryColor: "#f59e0b",
      secondaryColor: "#1e293b",
      fontHeading: "Inter",
      fontBody: "Inter",
      aboutText: "We are at the forefront of sports infrastructure in India, bringing together advanced materials science and civil engineering to create spaces where champions are born.",
      aboutOriginTitle: "A Legacy of Performance",
      aboutOriginText: "Founded on the principle of 'Antigravity' – the idea that sports surfaces should empower movement without the burden of impact or wear.",
      officeHours: "Mon - Sat: 9:00 AM - 7:00 PM",
      whatsappNumber: "+91 98765 43210",
      serviceArea: "Pan India, Middle East, SE Asia",
      statsJson: JSON.stringify([
        { value: 500, suffix: "+", label: "Projects Completed" },
        { value: 18, suffix: "+", label: "States Served" },
        { value: 200, suffix: "+", label: "Institutional Clients" },
        { value: 10, suffix: "+", label: "Years of Trust" }
      ]),
      certsJson: JSON.stringify([
        { title: "ISO 9001:2015" }, { title: "FIFA Quality" }, { title: "IAAF Certified" }, { title: "BIS Approved" }, { title: "NSIC" }
      ])
    }
  });

  console.log("Done seeding!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
