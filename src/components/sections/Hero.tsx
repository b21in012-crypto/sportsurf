"use client";

export default function Hero({ hero }: { hero?: any }) {
  const data = hero || {
    title: "YOUR COMPLETE GUIDE TO",
    subtitle: "SPORTS INFRASTRUCTURE",
    imageUrl: "https://images.unsplash.com/photo-1541252260737-fb427fbf930b?q=80&w=2500&auto=format&fit=crop"
  };

  return (
    <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden flex flex-col justify-end" style={{ backgroundColor: data.backgroundColor || 'var(--ag-bg)' }}>
      {/* Background Media - Premium Sports Infrastructure */}
      {data.videoUrl ? (
        <video 
          src={data.videoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      ) : (
        <img
          src={data.imageUrl || "/images/hero_indian_arena.png"}
          alt="Premium Indian Sports Infrastructure"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Subtle Overlay to make text readable */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-[30px]">
        {/* Dynamic Badge */}
        {data.heroTag && (
          <span className="bg-ag-primary/20 backdrop-blur-md border border-ag-primary/50 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-pulse">
            {data.heroTag}
          </span>
        )}

        {/* Main Headline */}
        <h1 
          className="font-body font-black leading-[1.1] tracking-tight mb-4"
          style={{ 
            fontSize: "clamp(2rem, 5vw, 4.5rem)", 
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            color: data.textColor || "#ffffff"
          }}
        >
          {data.title.split("<br />").map((text: string, i: number) => (
            <span key={i}>{text}{i === 0 && <br />}</span>
          ))}
        </h1>

        {/* Sub-headline */}
        {data.subtitle && (
          <p 
            className="font-body font-bold text-white tracking-widest uppercase mb-8"
            style={{ 
              fontSize: "clamp(0.9rem, 1.5vw, 1.25rem)",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)" 
            }}
          >
            {data.subtitle}
          </p>
        )}

        {/* Dynamic Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
           {data.ctaText && (
              <a href={data.ctaLink || "#"} className="bg-ag-primary hover:bg-white hover:text-ag-text px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-white transition-all shadow-xl">
                 {data.ctaText}
              </a>
           )}
           {data.cta2Text && (
              <a href={data.cta2Link || "/contact"} className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-white border border-white/20 transition-all">
                 {data.cta2Text}
              </a>
           )}
        </div>
      </div>
    </section>
  );
}
