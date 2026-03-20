"use client";

export default function Hero({ hero }: { hero?: any }) {
  const data = hero || {
    title: "YOUR COMPLETE GUIDE TO",
    subtitle: "SPORTS INFRASTRUCTURE",
    imageUrl: "/images/sports/premium_sports_hero.png"
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-ag-bg flex flex-col justify-end pt-[152px]">
      {/* Background Image - Premium Sports Infrastructure */}
      <img
        src={data.imageUrl || "/images/hero_indian_arena.png"}
        alt="Premium Indian Sports Infrastructure"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Subtle Overlay to make text readable */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-[100px]">
        {/* Main Headline */}
        <h1 
          className="font-body font-black text-white leading-[1.1] tracking-tight mb-4"
          style={{ 
            fontSize: "clamp(2rem, 5vw, 4.5rem)", 
            textShadow: "0 2px 10px rgba(0,0,0,0.5)" 
          }}
        >
          {data.title.split("<br />").map((text: string, i: number) => (
            <span key={i}>{text}{i === 0 && <br />}</span>
          ))}
        </h1>

        {/* Sub-headline */}
        {data.subtitle && (
          <p 
            className="font-body font-bold text-white tracking-widest uppercase"
            style={{ 
              fontSize: "clamp(0.9rem, 1.5vw, 1.25rem)",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)" 
            }}
          >
            {data.subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
