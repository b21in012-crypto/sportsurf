"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";

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
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-ag-gold transition-all">
                  <Icon size={15} />
                </a>
               ))}
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
