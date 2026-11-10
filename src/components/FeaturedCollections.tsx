import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface FeaturedCollectionsProps {
  onSelectCategory: (category: string) => void;
}

const COLLECTIONS = [
  {
    name: "Gold Jewellery",
    tagline: "Sovereign 22k Craftsmanship",
    description: "Pure, ancestral gold meticulously shaped into heirloom necklaces and traditional meenakari bangles.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  },
  {
    name: "Diamond Jewellery",
    tagline: "Celestial Brilliance & Fire",
    description: "Brilliant-cut solitaire engagement rings, eternity bands, and tennis bracelets certified by GIA & IGI.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  },
  {
    name: "Silver Jewellery",
    tagline: "Sterling 925 Luxury Curation",
    description: "Oxidized luxury jhumkas, modern geometric chains, and customized silver gifts of absolute purity.",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  },
  {
    name: "Bridal Collection",
    tagline: "Sacred Legacy of the Bride",
    description: "Chokers, sita-haars, and complete bridal suites celebrating the divine elegance of West Bengal brides.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  },
  {
    name: "Daily Wear",
    tagline: "Elegant Subtle Grace",
    description: "Ultra-light weight stackable rings, simple studs, and slender bracelets designed for every desk and dinner.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  },
  {
    name: "Wedding Collection",
    tagline: "Ornate Royal Masterpieces",
    description: "For the groom and family. Heavy polki necklaces, emerald-encrusted kalgis, and luxury wrist bands.",
    image: "https://images.unsplash.com/photo-1611085583191-a3b1a3a35d41?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  },
  {
    name: "Kids Jewellery",
    tagline: "Safe Gentle Keepsakes",
    description: "Allergen-free 18k pure gold baby bangles, evil-eye nazariyas, and cute lightweight customized pendants.",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  },
  {
    name: "Gift Collection",
    tagline: "A Token of Eternal Regard",
    description: "Beautifully packed sterling silver coins, divine deities, and diamond accents that say 'I cherish you'.",
    image: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&q=80&w=800",
    cols: "md:col-span-1"
  }
];

export default function FeaturedCollections({ onSelectCategory }: FeaturedCollectionsProps) {
  return (
    <section id="rupkotha-collections" className="bg-[#FAF9F5] py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C49F5D] font-mono font-semibold">
            Sculpted Expressions
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#1C1917] leading-tight">
            Curated Signature Collections
          </h2>
          <div className="mt-4 h-1 w-12 bg-[#C49F5D] mx-auto" />
          <p className="mt-4 text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Every collection at RUPKOTHA represents a meticulous preservation of Bengal's majestic artistry, hallmarked and certified for generations.
          </p>
        </div>

        {/* Compact Grid Layout with Reduced Box Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((collection, idx) => (
            <motion.div
              key={collection.name}
              id={`collection-card-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
              onClick={() => onSelectCategory(collection.name)}
              className="group relative h-[300px] overflow-hidden rounded-2xl bg-stone-900 cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
            >
              {/* Background Zoom Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-70"
                style={{ backgroundImage: `url(${collection.image})` }}
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              {/* Text Information Container */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#E5D5B8] font-medium">
                  {collection.tagline}
                </span>
                <h3 className="mt-1 font-serif text-lg sm:text-xl font-light text-white tracking-wide">
                  {collection.name}
                </h3>
                <p className="mt-2 text-[11px] text-stone-300 font-light leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 line-clamp-2">
                  {collection.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#E5D5B8] uppercase tracking-[0.15em] group-hover:text-white transition-colors">
                  <span>Explore Curation</span>
                  <ArrowRight className="w-3 h-3 transform transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
