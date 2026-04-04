"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, ChevronRight, Mail, Phone, Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react";

// Flat SVG icons for each category...
const CategoryIcon = ({ name, iconSvg }: { name: string; iconSvg?: string }) => {
  const iconClass = "w-8 h-8 object-contain";

  if (iconSvg) {
    return <div className={iconClass} dangerouslySetInnerHTML={{ __html: iconSvg }} />;
  }

  const icons: Record<string, JSX.Element> = {
    "Surface sports": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="14" width="20" height="6" rx="1" />
        <path d="M2 14c2-4 6-6 10-6s8 2 10 6" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
    "Water sports": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <path d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
        <path d="M12 4v8M9 9l3-5 3 5" />
        <path d="M2 13c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      </svg>
    ),
    "Small sports": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 6.36 15.36M5.64 5.64A9 9 0 0 1 12 3" />
        <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
      </svg>
    ),
    "Budget sports": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    "Sports academies": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    "Play zones": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="8" r="3" />
        <path d="M12 11v10M8 14l4-3 4 3" />
        <path d="M5 21h14" />
      </svg>
    ),
    "Adventure sports games": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 17l4-8 5 5 4-9 5 12" />
        <circle cx="19" cy="5" r="2" />
      </svg>
    ),
    "Challenge courses": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="6" height="18" />
        <rect x="9" y="8" width="6" height="13" />
        <rect x="16" y="13" width="6" height="8" />
      </svg>
    ),
    "Talent scout clubs": (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth={1.5}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  };
  return icons[name] || <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /></svg>;
};



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [navLinks, setNavLinks] = useState<{ label: string; href: string }[]>([]);
  const [categories, setCategories] = useState<{ id?: string; label: string; imageUrl?: string; icon?: string; iconSvg?: string; navbarIconUrl?: string; showOnNavbar?: boolean; href?: string }[]>([]);
  const [tickerItems, setTickerItems] = useState<{ text: string }[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then(res => res.ok ? res.json() : null),
      fetch("/api/admin/navigation").then(res => res.ok ? res.json() : []),
      fetch("/api/admin/categories").then(res => res.ok ? res.json() : []),
      fetch("/api/admin/ticker").then(res => res.ok ? res.json() : [])
    ]).then(([settingsData, navigationData, categoriesData, tickerData]) => {
      setSettings(settingsData);
      setNavLinks(navigationData.length ? navigationData : [
        { label: "Projects", href: "/projects" },
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" }
      ]);
      setCategories(categoriesData.length ? categoriesData : [
        { label: "Surface sports" }, { label: "Water sports" }, { label: "Small sports" }, { label: "Budget sports" },
        { label: "Sports academies" }, { label: "Play zones" }, { label: "Adventure sports games" },
        { label: "Challenge courses" }, { label: "Talent scout clubs" }
      ]);
      setTickerItems(tickerData.length ? tickerData : [
        { text: "Free site visit & consultation across India" },
        { text: "ISO 9001:2015 Certified" },
        { text: "FLAT 10% OFF on first project" },
        { text: "Premium Sports Surfaces & Equipment" }
      ]);
    }).catch(console.error);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ag-bg border-b border-ag-border">
      {/* Top Contact Bar */}
      <div className="hidden md:block bg-ag-primary text-white py-1">
        <div className="container-retail flex justify-between items-center text-[10px] sm:text-[11px] font-body tracking-wider">
          <div className="flex items-center gap-4 lg:gap-6">
            <a href="mailto:info@sportsurf.in" className="flex items-center gap-2 hover:text-ag-gold transition-colors">
              <Mail size={14} />
              <span>info@sportsurf.in</span>
            </a>
            <span className="text-white/40">|</span>
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-ag-gold transition-colors">
              <Phone size={14} />
              <span>+91 9966109191</span>
            </a>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              {[Facebook, Twitter, Youtube, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-ag-gold transition-colors">
                  <Icon size={12} />
                </a>
              ))}
              {/* Pinterest SVG */}
              <a href="#" className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-ag-gold transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[12px] h-[12px]">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.618 0 12.017 0z" />
                </svg>
              </a>
            </div>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-3">
              <Link href="/register" className="hover:text-ag-gold font-semibold transition-colors">REGISTRATION</Link>
              <span className="text-white/40">|</span>
              <Link href="/login" className="hover:text-ag-gold font-semibold transition-colors">LOGIN</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Logo + Search + Actions row */}
      <div className="border-b border-ag-border bg-white h-16 flex items-center shadow-sm">
        <div className="container-retail flex items-center gap-6 h-full">
          {/* Logo */}
          <Link href="/" className="shrink-0 h-full group flex items-center w-auto max-w-[280px]">
             <img src="/logo.png" alt="SportSurf" className="h-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105" style={{ clipPath: 'inset(0 0 0 2px)' }} />
          </Link>
          
          {/* Search */}
          <div className={`flex-1 relative max-w-lg ml-6 transition-all duration-200 ${searchFocused ? "shadow-lg" : ""}`}>
            <input
              type="text"
              placeholder="Search for surface sports..."
              className="search-input pl-10 pr-4 py-2 rounded-none border-ag-border text-sm"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ag-text-muted" size={16} />
          </div>

          <div className="hidden md:flex items-center gap-6 ml-auto">
            {navLinks.filter(l => l.label.toLowerCase() !== "products").map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-body transition-colors ${pathname === link.href
                    ? "text-ag-primary font-semibold"
                    : "text-ag-text-muted hover:text-ag-text"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-4 w-px bg-ag-border" />
            <Link href="/profile" className="flex flex-col items-center gap-0.5 text-ag-text-muted hover:text-ag-primary transition-colors group">
              <User size={20} />
              <span className="text-[9px] font-body tracking-widest uppercase">Account</span>
            </Link>
            <button className="flex flex-col items-center gap-0.5 text-ag-text-muted hover:text-ag-primary transition-colors relative">
              <ShoppingBag size={20} />
              <span className="text-[9px] font-body tracking-widest uppercase">Quote</span>
              <span className="absolute -top-1 -right-2 bg-ag-secondary text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">0</span>
            </button>
            <Link href="/quote" className="btn btn-gold px-5 py-2 text-[11px] rounded-none ml-2">
              GET A QUOTE →
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-ag-text ml-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category Icon Strip - Updated for mobile & desktop */}
      {(!settings || settings.showCategoryBar) && (
        <div className="bg-white border-b border-ag-border shadow-sm">
          <div className="container-retail">
            {/* Desktop View: Horizontal Scroll */}
            <div className="hidden md:flex items-center justify-between py-3 overflow-x-auto scrollbar-hide gap-2">
               {categories.map((cat, i) => {
                 const catHref = cat.href || `/${cat.label.toLowerCase().replace(/\s+/g, "-")}`;
                 const isActive = pathname === catHref;
                 
                 return (
                  <Link
                    key={cat.label}
                    href={catHref}
                    className={`group flex flex-col items-center gap-1.5 px-5 py-2.5 min-w-fit transition-all duration-300 relative ${
                      isActive ? "bg-black/5" : "hover:bg-black/5"
                    }`}
                  >
                    <div className={`${isActive ? "text-ag-primary" : "text-black/60"} group-hover:text-ag-primary transition-colors`}>
                      <CategoryIcon name={cat.label} iconSvg={cat.iconSvg} />
                    </div>
                    <span className={`text-[11px] font-body transition-colors whitespace-nowrap tracking-wide ${
                      isActive ? "text-ag-primary font-extrabold" : "text-black/80 font-bold"
                    } group-hover:text-ag-primary uppercase`}>
                      {cat.label}
                    </span>
                    <span className={`absolute bottom-0 left-0 right-0 h-[3px] bg-ag-primary transition-transform duration-300 origin-center ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </Link>
                 );
               })}
            </div>

            {/* Mobile View: 3 per row Grid - High Contrast Dark Text */}
            <div className="md:hidden grid grid-cols-3 gap-y-6 py-5 px-2">
              {categories.map((cat, i) => {
                 const catHref = cat.href || `/${cat.label.toLowerCase().replace(/\s+/g, "-")}`;
                 const isActive = pathname === catHref;
                 
                 return (
                  <Link
                    key={cat.label}
                    href={catHref}
                    className={`flex flex-col items-center gap-2.5 transition-all duration-300 ${
                      isActive ? "text-ag-primary" : "text-black"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-black/5 border border-black/5 group-active:scale-95 transition-transform text-black">
                      <CategoryIcon name={cat.label} iconSvg={cat.iconSvg} />
                    </div>
                    <span className="text-[10px] font-body text-center leading-tight uppercase tracking-wider font-extrabold text-black">
                      {cat.label}
                    </span>
                  </Link>
                 );
               })}
            </div>
          </div>
        </div>
      )}

      {/* Ticker / Announcement - Enabled on Mobile */}
      {(!settings || settings.showTicker) && (
        <div className="flex bg-ag-primary text-white items-center h-10 overflow-hidden border-t-[3px] border-ag-gold w-full shadow-lg">
          {/* "LATEST UPDATES" Label with Chevron cutout */}
          <div className="relative bg-white text-ag-primary font-body font-black text-[9px] sm:text-[10px] tracking-widest uppercase px-4 sm:px-6 h-full flex items-center shrink-0 z-10 pr-8 sm:pr-10" style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)" }}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-ag-primary rounded-full animate-pulse" />
              LATEST
            </div>
          </div>

          {/* Marquee Content */}
          <div className="flex-1 overflow-hidden relative group">
            <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] text-[10px] sm:text-[11px] font-body tracking-[0.05em] uppercase text-white/95">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  {tickerItems.map((tk, idx) => (
                    <span key={idx} className="px-6 sm:px-8 flex items-center gap-1.5 sm:gap-2">
                      {idx > 0 && <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-ag-gold shrink-0"></span>}
                      {tk.text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-ag-border fixed inset-x-0 bottom-0 top-[112px] z-[100] overflow-y-auto">
          <div className="p-4 space-y-3">
            {navLinks.filter(l => l.label.toLowerCase() !== "products").map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center justify-between py-3 px-4 bg-ag-bg-alt rounded-lg text-[13px] font-body font-bold text-ag-primary uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                <ChevronRight size={16} className="text-ag-text-muted" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
