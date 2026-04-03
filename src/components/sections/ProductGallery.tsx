"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["/images/sports/premium_sports_hero.png"];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Featured Image */}
      <div className="w-full aspect-[4/3] bg-ag-bg-alt rounded-2xl overflow-hidden shadow-lg border border-ag-border relative">
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-ag-primary text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
          Premium Grade
        </div>
        <img
          src={displayImages[activeImageIndex]}
          className="w-full h-full object-cover transition-opacity duration-500"
          alt={productName}
        />
      </div>

      {/* Thumbnails Underneath */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
              activeImageIndex === idx
                ? "border-ag-primary shadow-md ring-4 ring-ag-primary/20 scale-95"
                : "border-transparent hover:border-ag-border opacity-70 hover:opacity-100 hover:scale-105"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt={`${productName} thumbnail ${idx + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
