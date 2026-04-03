"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";

interface ProductCardProps {
  name: string;
  category: string;
  shortSpec: string;
  slug: string;
  image?: string;
  delay?: number;
  heightClass?: string;
}

export default function ProductCard({ name, category, shortSpec, slug, image, heightClass }: ProductCardProps) {
  return (
    <Link 
      href={`/products/${slug}`}
      className="retail-card flex flex-col group h-full bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden border border-ag-border/60"
    >
      {/* Product Image Area */}
      <div className={`${heightClass || 'aspect-[4/5]'} bg-ag-bg-alt relative flex items-center justify-center overflow-hidden`}>
        <div className="absolute top-2 left-2 z-10">
           <span className="badge-category">{category}</span>
        </div>
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full bg-ag-border/30 rounded flex items-center justify-center text-ag-text-muted/20 font-heading font-black text-6xl italic group-hover:scale-105 transition-transform duration-500">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="flex items-center gap-1 text-[#FFA41C]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
          <span className="text-[10px] text-ag-text-muted font-bold ml-1">1,200+ Reviews</span>
        </div>

        <h3 className="font-body font-bold text-base text-ag-text line-clamp-2 leading-snug group-hover:text-ag-primary transition-colors">
          {name}
        </h3>
        
        <p className="font-body text-ag-text-muted text-xs line-clamp-2 leading-relaxed">
          {shortSpec}
        </p>

        <div className="pt-2 mt-auto flex items-center justify-between">
          <span className="text-[10px] text-ag-primary font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-2">
            View Specs <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
