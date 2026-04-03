'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { ChevronRight, ArrowRight, Handshake, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Helper to slugify category names
const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

// --- PROFESSIONAL MASTER HERO ARCHITECTURES ---

const MasterSplitHero = ({ title, description, baseImage, sports, heroTag, ctaText, ctaLink, cta2Text, cta2Link, videoUrl, backgroundColor }: any) => {
  return (
    <div className="mb-12 flex flex-col md:flex-row h-[350px] md:h-[380px] rounded-3xl overflow-hidden border border-ag-border shadow-sm bg-white">
       <div className="w-full md:w-[40%] p-8 flex flex-col justify-center" style={backgroundColor ? { backgroundColor } : { backgroundColor: '#fdfcf9' }}>
          <span className="text-ag-primary font-bold text-[8px] uppercase tracking-[0.4em] mb-3 block">{heroTag || 'Infrastructure'}</span>
          <h1 className="text-3xl md:text-5xl font-heading font-black text-ag-text uppercase tracking-tighter leading-none mb-4">{title}</h1>
          <p className="text-ag-text-muted text-[10px] font-body leading-relaxed max-w-xs">{description.substring(0, 100)}...</p>
          <div className="mt-6 flex gap-2">
             <Link href={ctaLink || "#"} className="bg-ag-text text-white px-5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-ag-primary transition-all flex items-center justify-center">
                {ctaText || 'View Specs'}
             </Link>
             <Link href={cta2Link || "/contact"} className="border border-ag-border text-ag-text px-5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-ag-bg-alt transition-all flex items-center justify-center">
                {cta2Text || 'Talk to Expert'}
             </Link>
          </div>
       </div>
       <div className="w-full md:w-[60%] relative h-full">
          {videoUrl ? (
             <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : (
             <Image src={baseImage} alt={title} fill className="object-cover" priority />
          )}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
             {sports.slice(0, 2).map((s: string) => (
                <span key={s} className="bg-black/40 backdrop-blur-md text-white text-[7px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-white/20">{s}</span>
             ))}
          </div>
       </div>
    </div>
  );
};

const MasterGalleryHero = ({ title, description, baseImage, heroTag, ctaText, ctaLink, cta2Text, cta2Link, videoUrl, backgroundColor }: any) => {
  return (
    <div className="mb-12 relative h-[350px] md:h-[380px] rounded-3xl overflow-hidden shadow-md" style={backgroundColor ? { backgroundColor } : {}}>
       {videoUrl ? (
          <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
       ) : (
          <Image src={baseImage} fill className="object-cover" alt={title} priority />
       )}
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
       <div className="absolute top-10 left-10 z-10">
          <span className="text-ag-primary bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[8px] font-black uppercase tracking-widest">{heroTag || 'Premium Collection'}</span>
       </div>
       <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-xl text-left">
             <h1 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter leading-none mb-3">{title}</h1>
             <p className="text-white/70 text-[11px] font-body max-w-lg leading-relaxed">{description.substring(0, 120)}...</p>
          </div>
          <div className="flex gap-4">
             <Link href={ctaLink || "/contact"} className="bg-white text-ag-text px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-ag-primary hover:text-white transition-all shadow-xl">
                {ctaText || 'Get Quote'}
             </Link>
             {cta2Text && (
               <Link href={cta2Link || "#"} className="bg-black/40 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-black transition-all">
                  {cta2Text}
               </Link>
             )}
          </div>
       </div>
    </div>
  );
};

const MasterMinimalHero = ({ title, description, baseImage, sports, heroTag, ctaText, ctaLink, videoUrl, backgroundColor }: any) => {
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-3 h-[350px] md:h-[380px]">
       <div className="relative rounded-3xl overflow-hidden border border-ag-border flex flex-col justify-center items-center text-center p-8" style={backgroundColor ? { backgroundColor } : { backgroundColor: '#ffffff' }}>
            <span className="text-ag-primary font-bold text-[8px] uppercase tracking-widest mb-4">{heroTag || 'Bespoke Solutions'}</span>
            <div className="w-12 h-px bg-ag-primary mb-6" />
            <h1 className="text-4xl md:text-5xl font-heading font-black text-ag-text uppercase tracking-tighter leading-none mb-4">{title}</h1>
            <p className="text-ag-text-muted text-[10px] font-body max-w-sm mb-6 leading-relaxed">{description.substring(0, 120)}...</p>
            <Link href={ctaLink || "#"} className="border-b border-ag-primary text-ag-primary font-black uppercase text-[9px] tracking-widest py-1">
               {ctaText || 'Explore Range'}
            </Link>
       </div>
       <div className="relative rounded-3xl overflow-hidden border border-ag-border">
          {videoUrl ? (
             <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : (
             <Image src={baseImage} fill className="object-cover" alt="Main" priority />
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] z-10">{sports[0] || 'Official'}</div>
       </div>
    </div>
  );
};

const MasterAdventureHero = ({ title, description, baseImage, sports, heroTag, ctaText, ctaLink, videoUrl, backgroundColor }: any) => {
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-12 gap-3 h-[350px] md:h-[380px]">
       <div className="md:col-span-8 relative rounded-3xl overflow-hidden border border-ag-border group" style={backgroundColor ? { backgroundColor } : {}}>
          {videoUrl ? (
             <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : (
             <Image src={baseImage} fill className="object-cover" alt={title} priority />
          )}
          <div className="absolute top-0 left-0 right-0 p-8 flex flex-col justify-start z-10">
             <div className="bg-white/95 text-ag-text px-6 py-2 w-fit rounded-full flex items-center gap-4 border border-white/20 shadow-xl">
                 <span className="text-[10px] font-black uppercase tracking-tighter">{title}</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-ag-primary animate-pulse" />
                 <span className="text-[9px] font-bold text-ag-text-muted uppercase tracking-widest">Active Solutions</span>
             </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="bg-black/60 backdrop-blur-md text-white text-[10px] p-4 rounded-xl border border-white/10 max-w-sm">{description.substring(0, 100)}...</p>
          </div>
       </div>
       <div className="md:col-span-4 grid grid-rows-2 gap-3 h-full">
          {[
            { img: "https://images.unsplash.com/photo-1541252260730-0412e3e2108e?auto=format&fit=crop&q=80&w=400", label: sports[0] || 'Experience' },
            { img: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=400", label: sports[1] || 'Technical' }
          ].map((s, i) => (
             <div key={i} className="relative rounded-3xl overflow-hidden border border-ag-border bg-[#f8f9fa]">
                <Image src={s.img} fill className="object-cover opacity-60" alt={s.label} />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-ag-text font-black text-xl uppercase tracking-tighter italic">{s.label}</span>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const MasterRosterHero = ({ title, description, baseImage, sports, heroTag, videoUrl, backgroundColor }: any) => {
  return (
    <div className="mb-12 flex flex-col md:flex-row gap-3 h-[350px] md:h-[380px]">
       <div className="flex-1 relative rounded-3xl overflow-hidden border border-ag-border text-white p-10 flex flex-col justify-end" style={backgroundColor ? { backgroundColor } : { backgroundColor: '#0f172a' }}>
          {videoUrl && <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />}
          <div className="absolute top-0 right-0 p-10 z-10">
             <div className="w-16 h-16 border-2 border-ag-primary rounded-full flex items-center justify-center text-ag-primary text-2xl font-black">2024</div>
          </div>
          <div className="relative z-10">
             <span className="text-ag-primary font-bold text-[9px] uppercase tracking-[0.3em] mb-4 block">Elite Training Division</span>
             <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter leading-none mb-6 underline decoration-ag-primary decoration-4 underline-offset-8">{title}</h1>
             <p className="text-white/60 text-xs font-body max-w-sm">{description.substring(0, 100)}...</p>
          </div>
       </div>
       <div className="w-full md:w-[40%] relative rounded-3xl overflow-hidden border border-ag-border shadow-xl">
          <Image src={baseImage} fill className="object-cover" alt="Elite" priority />
          <div className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-ag-border flex items-center justify-between z-10">
              <div className="flex flex-col">
                  <span className="text-ag-text font-black text-sm uppercase">Official Roster</span>
                  <span className="text-ag-text-muted text-[8px] uppercase">{sports.slice(0, 3).join(' • ')}</span>
              </div>
              <button className="bg-ag-text text-white p-2 rounded-lg hover:bg-ag-primary transition-all">
                  <ChevronRight size={16} />
              </button>
          </div>
       </div>
    </div>
  );
};

// --- COLLABORATION BLOCKS ---

const CollabBlocks = ({ category, collaborations = [] }: { category: any; collaborations: any[] }) => {
  const partners = useMemo(() => {
    // Show partners linked to this category OR global partners
    return collaborations
      .filter(c => c.isGlobal || c.categoryId === category?.id)
      .sort((a, b) => a.order - b.order)
      .slice(0, 6); // Limit to 6 for the sidebar
  }, [collaborations, category]);

  return (
    <div className="space-y-8 pt-8 border-t border-ag-border/50">
      <div className="space-y-6">
        <h3 className="font-heading font-bold text-xs uppercase tracking-[0.3em] text-ag-primary flex items-center gap-3">
           <div className="w-2 h-0.5 bg-ag-gold" /> {category?.collabTitle || 'Collaborations'}
        </h3>
        
        {/* Partnership Card */}
        <div className="relative group overflow-hidden rounded-2xl bg-ag-text p-7 text-left">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Handshake size={56} className="text-white" />
            </div>
            <div className="relative z-10">
                <span className="text-ag-gold text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">{category?.collabTitle || 'Partner With Us'}</span>
                <h4 className="text-white text-xl font-heading font-black uppercase tracking-tighter leading-none mb-4 whitespace-pre-line">
                    {category?.collabSubtitle || 'Join the SportSurf \n Elite Network'}
                </h4>
                <p className="text-white/50 text-[11px] font-body mb-5 leading-relaxed max-w-[200px]">
                    {category?.collabDescription || 'We are looking for strategic partners in infrastructure and technology.'}
                </p>
                <Link href={category?.collabCtaLink || '/contact'} className="inline-flex items-center gap-2 bg-ag-gold text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-ag-text transition-all">
                    {category?.collabCtaText || 'Apply Now'} <ArrowRight size={12} />
                </Link>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-ag-gold/5 rounded-full -mb-16 -mr-16 blur-3xl transition-all group-hover:bg-ag-gold/10" />
        </div>

        {/* Logo Grid */}
        {partners.length > 0 && (
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-ag-text-muted uppercase tracking-widest text-left">Global Partners</span>
                    <span className="w-12 h-px bg-ag-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {partners.map((partner) => (
                        <div key={partner.id} className="h-20 bg-white border border-ag-border rounded-xl flex items-center justify-center p-2 transition-all cursor-pointer group hover:border-ag-gold/50 overflow-hidden relative" title={partner.name}>
                             <Image 
                                src={partner.imageUrl} 
                                alt={partner.name} 
                                fill
                                className="object-contain p-2"
                             />
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Small CTA - Managed via Settings if needed, but currently static here */}
        <button className="w-full flex items-center justify-between p-5 bg-white border border-ag-border rounded-xl hover:bg-ag-bg-alt transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-ag-bg flex items-center justify-center text-ag-primary group-hover:bg-ag-primary group-hover:text-white transition-all">
                    <Globe size={18} />
                </div>
                <div className="text-left leading-snug">
                    <p className="text-[11px] font-black text-ag-text uppercase tracking-tight">Dealer Program</p>
                    <p className="text-[9px] text-ag-text-muted uppercase">24 Countries Ready</p>
                </div>
            </div>
            <ChevronRight size={16} className="text-ag-border group-hover:text-ag-primary transition-all" />
        </button>
      </div>
    </div>
  );
};

// --- MAIN CONTENT ---

function CategoryContent() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  
  const [products, setProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState("all");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/categories").then(res => res.json()),
      fetch("/api/admin/collaborations").then(res => res.json())
    ]).then(([productsData, categoriesData, collabsData]) => {
      setProducts(productsData || []);
      setAllCategories(categoriesData || []);
      setCollaborations(collabsData || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const currentCategory = useMemo(() => {
    return allCategories.find(c => slugify(c.label) === categorySlug || c.id === categorySlug);
  }, [allCategories, categorySlug]);

  const currentCategoryLabel = currentCategory ? currentCategory.label : categorySlug.replace(/-/g, ' ');

  const defaultSubCategories: Record<string, string[]> = {
    'surface-sports': ['Synthetic Turf', 'Running Tracks', 'Tennis Courts', 'Basketball Courts', 'Badminton Courts', 'Multipurpose Courts'],
    'water-sports': ['Swimming Pools', 'Kayaking Lanes', 'Rowing Channels', 'Poolside Decking', 'Aquatic Centers'],
    'small-sports': ['Table Tennis', 'Chess & Carroms', 'Billiards & Snooker', 'Indoor Games Arena'],
    'budget-sports': ['Community Turf', 'School Playgrounds', 'Low-cost Court Solutions', 'Basic Gym Setups'],
    'sports-academies': ['Cricket Academy', 'Football Academy', 'Tennis Academy', 'Swimming Coaching', 'Boxing Rings'],
    'play-zones': ['Multi-activity Play Areas', 'Soft Play Zones', 'Trampoline Parks', 'Outdoor Swings & Slides'],
    'adventure-sports-games': ['Rock Climbing Walls', 'Zipline Setups', 'Paintball Arenas', 'Obstacle Courses'],
    'challenge-courses': ['Agility Training Courses', 'Military Grade Setups', 'Strength Testing Areas'],
    'talent-scout-clubs': ['Performance Testing Labs', 'Speed Tracks', 'Scouting Arenas', 'Analytics Hubs']
  };  const sportsInCategory = useMemo(() => {
    if (!currentCategoryLabel) return [];
    if (currentCategory?.subCategories?.length > 0) {
        return currentCategory.subCategories;
    }
    return [];
  }, [currentCategoryLabel, currentCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const pSlug = slugify(product.category || "");
      const matchesCategory = product.category === currentCategoryLabel || pSlug === categorySlug || product.category === currentCategory?.id;
      
      if (!matchesCategory) return false;

      if (activeSport === 'all') return true;
      
      // Filter by subCategoryId
      return product.subCategoryId === activeSport;
    });
  }, [products, currentCategoryLabel, currentCategory, categorySlug, activeSport]);

  const productsToDisplay = useMemo(() => {
    // We display filtered products directly now
    return filteredProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.imageUrl || currentCategory?.imageUrl || `/images/sports/${categorySlug.replace(/-/g, '_')}.png`,
        badge: p.isFeatured ? "Featured" : (p.isNew ? "New" : "Premium"),
        shortSpec: p.shortSpec || "Professional sports infrastructure engineered for maximum durability."
    }));
  }, [filteredProducts, currentCategory, categorySlug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-ag-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-ag-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (allCategories.length > 0 && !currentCategory && !['surface-sports', 'water-sports', 'small-sports', 'budget-sports', 'sports-academies', 'play-zones', 'adventure-sports-games', 'challenge-courses', 'talent-scout-clubs'].includes(categorySlug)) {
      return (
        <div className="pt-32 pb-32 text-center bg-ag-bg min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-4xl font-heading font-black text-ag-text mb-4 uppercase">Page Not Found</h2>
            <p className="text-ag-text-muted mb-8">This inner page does not exist yet.</p>
            <Link href="/" className="btn btn-primary px-8 py-3">Return Home</Link>
        </div>
      );
  }

  // Determine which hero layout to use based on the vertical
  const heroStyle = ['surface-sports', 'water-sports'].includes(categorySlug) ? 'split' : 
                    ['small-sports', 'budget-sports'].includes(categorySlug) ? 'gallery' :
                    ['sports-academies'].includes(categorySlug) ? 'minimal' :
                    ['play-zones', 'adventure-sports-games'].includes(categorySlug) ? 'adventure' : 'roster';
  
  const baseImage = currentCategory?.imageUrl || `/images/sports/${categorySlug.replace(/-/g, '_')}.png`;
  const description = currentCategory?.description || `Premium infrastructure and expert services for ${currentCategoryLabel.toLowerCase()}. Engineered for high-performance athletic environments and professional safety standards.`;

  return (
    <div className="pt-8 min-h-screen bg-ag-bg pb-24">
      <div className="container-retail">
        {/* Breadcrumb - Global across all heroes */}
        <div className="flex items-center gap-2 text-[10px] font-body text-ag-text-muted mb-6 tracking-[0.2em] uppercase">
          <Link href="/" className="hover:text-ag-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-ag-primary font-bold">{currentCategoryLabel}</span>
          {activeSport !== 'all' && (
              <>
              <ChevronRight size={10} />
              <span className="text-ag-primary font-bold">{sportsInCategory.find(s => s.id === activeSport)?.name || activeSport}</span>
              </>
          )}
        </div>

        {/* --- PROFESSIONAL DIVERSIFIED MASTER HERO SECTION --- */}
        {heroStyle === 'split' && (
          <MasterSplitHero 
            title={currentCategoryLabel} 
            description={description} 
            baseImage={baseImage} 
            sports={sportsInCategory.map((s: any) => s.name)}
            heroTag={currentCategory?.heroTag}
            ctaText={currentCategory?.ctaText}
            ctaLink={currentCategory?.ctaLink}
            cta2Text={currentCategory?.cta2Text}
            cta2Link={currentCategory?.cta2Link}
            videoUrl={currentCategory?.videoUrl}
            backgroundColor={currentCategory?.backgroundColor}
          />
        )}
        {heroStyle === 'gallery' && (
          <MasterGalleryHero 
            title={currentCategoryLabel} 
            description={description} 
            baseImage={baseImage} 
            heroTag={currentCategory?.heroTag}
            ctaText={currentCategory?.ctaText}
            ctaLink={currentCategory?.ctaLink}
            cta2Text={currentCategory?.cta2Text}
            cta2Link={currentCategory?.cta2Link}
            videoUrl={currentCategory?.videoUrl}
            backgroundColor={currentCategory?.backgroundColor}
          />
        )}
        {heroStyle === 'minimal' && (
          <MasterMinimalHero 
            title={currentCategoryLabel} 
            description={description} 
            baseImage={baseImage} 
            sports={sportsInCategory.map((s: any) => s.name)}
            heroTag={currentCategory?.heroTag}
            ctaText={currentCategory?.ctaText}
            ctaLink={currentCategory?.ctaLink}
            videoUrl={currentCategory?.videoUrl}
            backgroundColor={currentCategory?.backgroundColor}
          />
        )}
        {heroStyle === 'adventure' && (
          <MasterAdventureHero 
            title={currentCategoryLabel} 
            description={description} 
            baseImage={baseImage} 
            sports={sportsInCategory.map((s: any) => s.name)}
            heroTag={currentCategory?.heroTag}
            videoUrl={currentCategory?.videoUrl}
            backgroundColor={currentCategory?.backgroundColor}
          />
        )}
        {heroStyle === 'roster' && (
          <MasterRosterHero 
            title={currentCategoryLabel} 
            description={description} 
            baseImage={baseImage} 
            sports={sportsInCategory.map((s: any) => s.name)}
            heroTag={currentCategory?.heroTag}
            videoUrl={currentCategory?.videoUrl}
            backgroundColor={currentCategory?.backgroundColor}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-40 space-y-8">
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-ag-primary flex items-center gap-2">
                   <div className="w-1 h-3 bg-ag-primary" /> Subcategories
                </h3>
                
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setActiveSport('all')}
                    className={`text-left text-sm py-2.5 px-4 rounded transition-all duration-300 ${activeSport === 'all' ? 'bg-ag-primary text-white font-bold shadow-lg shadow-ag-primary/20' : 'text-ag-text-muted hover:bg-ag-bg-alt hover:text-ag-text'}`}
                  >
                    View All {currentCategoryLabel}
                  </button>
                  {sportsInCategory.map((sport: any) => (
                    <button
                      key={sport.id}
                      onClick={() => setActiveSport(sport.id)}
                      className={`text-left text-sm py-2.5 px-4 rounded transition-all duration-300 ${activeSport === sport.id ? 'bg-ag-primary text-white font-bold shadow-lg shadow-ag-primary/20' : 'text-ag-text-muted hover:bg-ag-bg-alt hover:text-ag-text'}`}
                    >
                      {sport.name}
                    </button>
                  ))}
                </div>
                
                <CollabBlocks category={currentCategory} collaborations={collaborations} />
              </div>
            </div>
          </aside>

          {/* Main Showcase Area */}
          <div className="lg:col-span-3">
            <div>
              {productsToDisplay.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                  {productsToDisplay.map((sol: any) => (
                    <ProductCard 
                      key={sol.id}
                      name={sol.name}
                      category={sol.badge || "Premium"}
                      shortSpec="Professional sports infrastructure engineered for maximum durability and athlete safety."
                      slug={sol.slug}
                      image={sol.image}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-ag-border p-20 text-center rounded-2xl">
                  <h3 className="text-2xl font-heading font-black text-ag-text mb-4 uppercase">No solutions available</h3>
                  <p className="text-ag-text-muted mb-10 max-w-sm mx-auto font-body">We are currently updating our portfolio for this specific vertical. Check back soon for premium infrastructure options.</p>
                  <button 
                    onClick={() => setActiveSport('all')}
                    className="btn btn-primary px-10 py-3"
                  >
                    View All Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InnerCategoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-ag-bg flex items-center justify-center "><div className="w-12 h-12 rounded-full border-4 border-ag-primary border-t-transparent animate-spin"></div></div>}>
            <CategoryContent />
        </Suspense>
    )
}
