export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import FeaturedProductsGrid from "@/components/sections/FeaturedProductsGrid";
import StatsCounter from "@/components/sections/StatsCounter";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Testimonials from "@/components/sections/Testimonials";
import Certifications from "@/components/sections/Certifications";
import FinalCTA from "@/components/sections/FinalCTA";

export default async function Home() {
  let settings = null;
  let categories: any[] = [];
  let hero = null;
  let projects: any[] = [];
  let testimonials: any[] = [];
  let tickers: any[] = [];

  try {
    const [settingsData, categoriesData, heroData, projectsData, testimonialsData, tickersData] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.homepageGridItem.findMany({ orderBy: { order: "asc" } }),
      prisma.heroSection.findFirst({ where: { page: "home" } }),
      prisma.project.findMany({ where: { isFeatured: true } }),
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
      prisma.tickerUpdate.findMany({ orderBy: { order: "asc" } })
    ]);

    // Enhance categories with dynamic product counts
    categories = await Promise.all((categoriesData || []).map(async (cat) => {
      const count = await prisma.product.count({
        where: { category: { equals: cat.label, mode: 'insensitive' } }
      });
      return { ...cat, productCount: count };
    }));

    settings = settingsData;
    hero = heroData;
    projects = projectsData;
    testimonials = testimonialsData;
    tickers = tickersData;
  } catch (e) {
    console.error("DB not available:", e);
  }

  return (
    <div className="pt-0     bg-ag-bg min-h-screen">
      <Hero hero={hero} />
      <FeaturedProductsGrid categories={categories} />
      <StatsCounter settings={settings} />
      <FeaturedProjects projects={projects} />
      <Testimonials testimonials={testimonials} />
      <Certifications settings={settings} />
      <FinalCTA settings={settings} />
    </div>
  );
}
