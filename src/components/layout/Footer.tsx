"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin, Twitter, MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.ok ? res.json() : null)
      .then(data => setSettings(data))
      .catch(console.error);

    fetch("/api/admin/categories")
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data.length ? data.map((c: any) => c.label) : [
        "Surface sports", "Water sports", "Small sports", "Budget sports",
        "Sports academies", "Play zones", "Adventure sports games",
        "Challenge courses", "Talent scout clubs"
      ]))
      .catch(console.error);
  }, []);
  return (
    <footer className="bg-ag-primary text-white pt-12 pb-6 border-t border-white/10">
      <div className="container-retail">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl shadow-white/5 transition-transform group-hover:scale-105 duration-500">
                <img src="/logo.png" alt="SportSurf" className="w-full h-full object-contain" />
              </div>
            </Link>
            <p className="font-body text-white/60 text-sm leading-relaxed max-w-xs">
              India's leading sports infrastructure company — building arenas for sport, play, and excellence.
            </p>
            <div className="flex items-center gap-3">
              <a href={settings?.facebookLink || "#"} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-ag-gold transition-all">
                <Facebook size={15} />
              </a>
              <a href={settings?.twitterLink || "#"} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-ag-gold transition-all">
                <Twitter size={15} />
              </a>
              <a href={settings?.instagramLink || "#"} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-ag-gold transition-all">
                <Instagram size={15} />
              </a>
              <a href={settings?.linkedinLink || "#"} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-ag-gold transition-all">
                <Linkedin size={15} />
              </a>
              <a href={settings?.youtubeLink || "#"} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-ag-gold transition-all">
                <Youtube size={15} />
              </a>
              <a href={settings?.pinterestLink || "#"} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-ag-gold transition-all">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.618 0 12.017 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "Products", "Projects", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="font-body text-sm text-white/60 hover:text-ag-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link href={`/products?category=${cat.toLowerCase().replace(/\s+/g, "-")}`} className="font-body text-xs text-white/60 hover:text-ag-gold transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="text-ag-gold shrink-0 mt-0.5" size={15} />
                <span className="font-body text-white/60 text-xs leading-relaxed whitespace-pre-line">
                  {settings?.address || "Sports Arena Complex,\nCyber City, Gurgaon,\nHaryana – 122002"}
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="text-ag-gold shrink-0" size={15} />
                <span className="font-body text-white/60 text-xs">{settings?.contactPhone || "+91 (800) SPORTSURF"}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="text-ag-gold shrink-0" size={15} />
                <span className="font-body text-white/60 text-xs">{settings?.contactEmail || "mission@sportsurf.in"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs text-white/40">
            &copy; {new Date().getFullYear()} {settings?.siteName || "SportSurf India"}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-body text-xs text-white/40 hover:text-ag-gold uppercase tracking-wider">Privacy Policy</Link>
            <Link href="/terms" className="font-body text-xs text-white/40 hover:text-ag-gold uppercase tracking-wider">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
