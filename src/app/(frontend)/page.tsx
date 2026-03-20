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
    settings = await prisma.siteSettings.findFirst();
    categories = await prisma.homepageGridItem.findMany({ orderBy: { order: "asc" } });
    hero = await prisma.heroSection.findFirst({ where: { page: "home" } });
    projects = await prisma.project.findMany({ where: { isFeatured: true } });
    testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    tickers = await prisma.tickerUpdate.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("DB not available during build, using defaults:", e);
  }

  return (
    <div className="bg-ag-bg min-h-screen">
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
