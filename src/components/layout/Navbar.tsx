"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, ChevronRight, Mail, Phone, Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react";

// Flat SVG icons for each category...
const CategoryIcon = ({ name, iconSvg, imageUrl }: { name: string; iconSvg?: string; imageUrl?: string }) => {
  const iconClass = "w-8 h-8 object-contain";

  if (iconSvg) {
    return <div className={iconClass} dangerouslySetInnerHTML={{ __html: iconSvg }} />;
  }

  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={iconClass} onError={e => e.currentTarget.style.display="none"} />;
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
    "Adventure sports": (
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
    fetch("/api/admin/settings")
      .then(res => res.ok ? res.json() : null)
      .then(data => setSettings(data))
      .catch(console.error);

    fetch("/api/admin/navigation")
      .then(res => res.ok ? res.json() : [])
      .then(data => setNavLinks(data.length ? data : [
        { label: "Products", href: "/products" },
        { label: "Projects", href: "/projects" },
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" }
      ]))
      .catch(console.error);

    fetch("/api/admin/categories")
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data.length ? data : [
        { label: "Surface sports" }, { label: "Water sports" }, { label: "Small sports" }, { label: "Budget sports" },
        { label: "Sports academies" }, { label: "Play zones" }, { label: "Adventure sports games" },
        { label: "Challenge courses" }, { label: "Talent scout clubs" }
      ]))
      .catch(console.error);

    fetch("/api/admin/ticker")
      .then(res => res.ok ? res.json() : [])
      .then(data => setTickerItems(data.length ? data : [
        { text: "Free site visit & consultation across India" },
        { text: "ISO 9001:2015 Certified" },
        { text: "FLAT 10% OFF on first project" },
        { text: "Premium Sports Surfaces & Equipment" }
      ]))
      .catch(console.error);
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
      <div className="border-b border-ag-border bg-white">
        <div className="container-retail py-3 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-ag-primary flex items-center justify-center">
              <span className="font-heading font-bold text-white text-sm italic">S</span>
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tighter text-ag-text block leading-none">SPORTSURF</span>
              <span className="text-[9px] font-body text-ag-text-muted tracking-[0.2em] uppercase">India</span>
            </div>
          </Link>

          {/* Search */}
          <div className={`flex-1 relative max-w-2xl transition-all duration-200 ${searchFocused ? "shadow-lg" : ""}`}>
            <input
              type="text"
              placeholder="Search for surface sports, academies, play zones..."
              className="search-input pl-10 pr-4 py-2.5 rounded-none border-ag-border"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ag-text-muted" size={16} />
          </div>

          {/* Nav links + actions */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            {navLinks.map((link) => (
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

      {/* Category Icon Strip */}
      {(!settings || settings.showCategoryBar) && (
        <div className="hidden md:block bg-white border-b border-ag-border">
          <div className="container-retail">
            <div className="flex items-center justify-between py-3 overflow-x-auto scrollbar-hide gap-2">
               {categories.map((cat, i) => (
                <Link
                  key={cat.label}
                  href={cat.href || `/products?category=${(cat as any).id || cat.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group flex flex-col items-center gap-1.5 px-4 py-2 min-w-fit hover:bg-ag-bg-alt transition-all duration-200 relative"
                >
                  <div className="text-ag-text-muted group-hover:text-ag-primary transition-colors">
                    <CategoryIcon name={cat.label} iconSvg={cat.iconSvg} imageUrl={cat.navbarIconUrl || cat.imageUrl} />
                  </div>
                  <span className="text-[11px] font-body text-ag-text-muted group-hover:text-ag-primary transition-colors whitespace-nowrap tracking-wide">{cat.label}</span>
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ag-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ticker / Announcement */}
      {(!settings || settings.showTicker) && (
        <div className="hidden md:flex bg-ag-primary text-white items-center h-10 overflow-hidden border-t-[3px] border-ag-gold w-full">
          {/* "LATEST UPDATES" Label with Chevron cutout */}
          <div className="relative bg-[#F4F5F7] text-ag-primary font-body font-black text-[10px] tracking-widest uppercase px-6 h-full flex items-center shrink-0 z-10 pr-10" style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ag-primary rounded-full animate-pulse" />
              LATEST UPDATES
            </div>
          </div>

          {/* Marquee Content */}
          <div className="flex-1 overflow-hidden relative group">
            <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] text-[11px] font-body tracking-[0.05em] uppercase text-white/90">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  {tickerItems.map((tk, idx) => (
                    <span key={idx} className="px-8 flex items-center gap-2">
                      {idx > 0 && <span className="w-1.5 h-1.5 rounded-full bg-ag-gold"></span>}
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
        <div className="md:hidden bg-white border-t border-ag-border">
          <div className="p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center justify-between py-2 border-b border-ag-border text-sm font-body font-medium text-ag-text hover:text-ag-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                <ChevronRight size={16} className="text-ag-text-muted" />
              </Link>
            ))}
            {(!settings || settings.showCategoryBar) && (
              <div className="pt-3 grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <Link key={cat.label} href={cat.href || `/products?category=${(cat as any).id || cat.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex flex-col items-center gap-1 p-2 bg-ag-bg-alt rounded text-ag-text-muted hover:text-ag-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full border border-ag-border flex items-center justify-center">
                      <CategoryIcon name={cat.label} iconSvg={cat.iconSvg} />
                    </div>
                    <span className="text-[9px] leading-tight">{cat.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
