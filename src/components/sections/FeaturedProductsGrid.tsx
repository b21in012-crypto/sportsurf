import Link from "next/link";
import Image from "next/image";

const featured = [
  {
    id: "1",
    label: "Surface sports",
    desc: "Synthetic turf, running tracks & multi-sport courts",
    image: "/images/sports/surface_sports.png",
    href: "/products?category=surface-sports",
    count: "12 products",
    tall: true,
  },
  {
    id: "2",
    label: "Water sports",
    desc: "Kayaking lanes, pool decking & aquatic gear",
    image: "/images/sports/water_sports.png",
    href: "/products?category=water-sports",
    count: "8 products",
    tall: false,
  },
  {
    id: "3",
    label: "Small sports",
    desc: "Badminton, table tennis & squash setups",
    image: "/images/sports/small_sports.png",
    href: "/products?category=small-sports",
    count: "15 products",
    tall: false,
  },
  {
    id: "4",
    label: "Budget sports",
    desc: "Cost-effective solutions for schools & communities",
    image: "/images/sports/budget_sports.png",
    href: "/products?category=budget-sports",
    count: "20 products",
    tall: false,
  },
  {
    id: "5",
    label: "Adventure sports games",
    desc: "Climbing walls, rope courses & obstacle setups",
    image: "/images/sports/adventure_sports.png",
    href: "/products?category=adventure-sports",
    count: "7 products",
    tall: true,
  },
  {
    id: "6",
    label: "Play zones",
    desc: "Premium children's play areas & soft surfaces",
    image: "/images/sports/play_zones.png",
    href: "/products?category=play-zones",
    count: "10 products",
    tall: false,
  },
];

function PortfolioCard({ item, className }: { item: any; className: string }) {
  return (
    <Link href={item.href} className={`group relative rounded-[2rem] overflow-hidden flex flex-col ${className}`}>
      {/* Background image */}
      <Image src={item.image} alt={item.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent transition-opacity duration-300 group-hover:from-[#0B0F19]/90" />

      {/* Top Badges */}
      <div className="relative z-10 flex justify-between items-start p-5 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {/* Blue Badge */}
        <div className="bg-[#3B82F6] text-white text-[10px] md:text-[11px] font-bold tracking-widest px-3 py-1.5 md:px-4 rounded-full flex items-center gap-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
          {item.count.toUpperCase()}
        </div>
        
        {/* Top Right Arrow */}
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-white/50 group-hover:text-white transition-colors duration-300 bg-white/5 backdrop-blur-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </div>

      <div className="flex-1" />

      {/* Content */}
      <div className="relative z-10 p-5 md:p-6 pt-0">
        <h3 className="text-2xl md:text-[28px] lg:text-[32px] font-body font-black text-white mb-2 leading-tight tracking-tight capitalize">
          {item.label}
        </h3>
        <p className="text-[13px] md:text-[15px] font-body text-white/80 mb-4 md:mb-5 leading-relaxed line-clamp-2">
          {item.desc}
        </p>
        
        <div className="flex items-center gap-2 text-[#3B82F6] font-[900] tracking-widest text-xs md:text-sm uppercase group-hover:text-blue-400 transition-colors">
          EXPLORE
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default async function FeaturedProductsGrid({ categories = [] }: { categories?: any[] }) {
  const items = categories.slice(0, 6); // Take first 6 for absolute grid mapping

  return (
    <section className="section-sm bg-ag-bg border-t border-ag-border">
      <div className="container-retail">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] font-body uppercase tracking-[0.3em] text-ag-text-muted mb-1">Our Portfolio</p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-ag-text">
              Every Sport, <em className="text-ag-gold font-normal italic">Elevated.</em>
            </h2>
          </div>
        </div>

        {/* Masonry Grid Layout (First 6) */}
        <div className="grid grid-cols-12 gap-4 md:gap-5 auto-rows-[200px] md:auto-rows-[250px] mb-4 md:mb-5">
          {items[0] && (
            <PortfolioCard 
              item={{ ...items[0], image: items[0].imageUrl || "/images/sports/surface_sports.png", desc: items[0].description || "Synthetic turf, running tracks & multi-sport courts", href: items[0].href || `/${items[0].label.toLowerCase().replace(/\s+/g, "-")}`, count: "12 products" }} 
              className="col-span-12 md:col-span-6 row-span-2 h-auto" 
            />
          )}

          {items[1] && (
            <PortfolioCard 
              item={{ ...items[1], image: items[1].imageUrl || "/images/sports/water_sports.png", desc: items[1].description || "Kayaking lanes, pool decking & aquatic gear", href: items[1].href || `/${items[1].label.toLowerCase().replace(/\s+/g, "-")}`, count: "8 products" }} 
              className="col-span-12 sm:col-span-6 md:col-span-6 row-span-1 h-[200px] md:h-auto" 
            />
          )}

          {items[2] && (
            <PortfolioCard 
              item={{ ...items[2], image: items[2].imageUrl || "/images/sports/small_sports.png", desc: items[2].description || "Badminton, table tennis & squash setups", href: items[2].href || `/${items[2].label.toLowerCase().replace(/\s+/g, "-")}`, count: "15 products" }} 
              className="col-span-6 md:col-span-3 row-span-1 h-[200px] md:h-auto" 
            />
          )}

          {items[3] && (
            <PortfolioCard 
              item={{ ...items[3], image: items[3].imageUrl || "/images/sports/budget_sports.png", desc: items[3].description || "Cost-effective solutions for schools & communities", href: items[3].href || `/${items[3].label.toLowerCase().replace(/\s+/g, "-")}`, count: "20 products" }} 
              className="col-span-6 md:col-span-3 row-span-1 h-[200px] md:h-auto" 
            />
          )}

          {items[4] && (
            <PortfolioCard 
              item={{ ...items[4], image: items[4].imageUrl || "/images/sports/adventure_sports.png", desc: items[4].description || "Climbing walls, rope courses & obstacle setups", href: items[4].href || `/${items[4].label.toLowerCase().replace(/\s+/g, "-")}`, count: "7 products" }} 
              className="col-span-12 md:col-span-8 row-span-1 h-[200px] md:h-auto" 
            />
          )}

          {items[5] && (
            <PortfolioCard 
              item={{ ...items[5], image: items[5].imageUrl || "/images/sports/play_zones.png", desc: items[5].description || "Premium children's play areas & soft surfaces", href: items[5].href || `/${items[5].label.toLowerCase().replace(/\s+/g, "-")}`, count: "10 products" }} 
              className="col-span-12 md:col-span-4 row-span-1 h-[200px] md:h-auto" 
            />
          )}
        </div>

        {/* Additional items (7+) */}
        {categories.length > 6 && (
          <div className="grid grid-cols-12 gap-4 md:gap-5 auto-rows-[200px] md:auto-rows-[250px]">
            {categories.slice(6).map((cat, idx) => (
              <PortfolioCard 
                key={cat.id}
                item={{ ...cat, image: cat.imageUrl || "/images/sports/surface_sports.png", desc: cat.description || "Expert solutions for professional sports infrastructure.", href: cat.href || `/${cat.label.toLowerCase().replace(/\s+/g, "-")}`, count: "View Products" }} 
                className="col-span-12 sm:col-span-6 md:col-span-4 row-span-1 h-[200px] md:h-auto" 
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
