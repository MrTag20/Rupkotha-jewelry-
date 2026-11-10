import React, { useState } from "react";
import { Heart, Star, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { Product } from "../types";
import { motion } from "motion/react";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <motion.div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden border border-stone-200/40 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Badge Overlay */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {/* Main Image & Hover Swap */}
        <img
          src={isHovered ? product.hoverImage : product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Icon */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 shadow-sm text-stone-700 backdrop-blur-sm transition-colors hover:bg-[#FAF9F5] hover:text-[#C49F5D]"
        >
          <Heart
            className={`w-5 h-5 transition-transform duration-300 active:scale-125 ${
              isWishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#1C1917] px-2 py-0.5 text-[9px] font-medium font-mono uppercase tracking-wider text-[#E5D5B8]">
              <Sparkles className="w-2.5 h-2.5 text-[#C49F5D]" />
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="inline-block rounded-sm bg-[#C49F5D] px-2 py-0.5 text-[9px] font-bold font-mono text-stone-950 uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick Actions Hover Slider Overlay */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <div className="flex gap-2 w-[85%]">
            <button
              id={`quick-view-btn-${product.id}`}
              onClick={() => onQuickView(product)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-[#FAF9F5] text-stone-900 font-sans text-[11px] font-semibold tracking-wider uppercase py-3 shadow-md transition-colors duration-200"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Quick View</span>
            </button>
            <button
              id={`add-to-cart-quick-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#C49F5D] hover:bg-[#B38E4C] text-stone-950 font-sans text-[11px] font-semibold tracking-wider uppercase py-3 shadow-md transition-colors duration-200"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C49F5D] font-medium">
          {product.category}
        </span>
        <h3 className="mt-1 font-serif text-sm sm:text-base text-stone-800 tracking-wide font-normal line-clamp-1 group-hover:text-stone-950">
          {product.name}
        </h3>

        {/* Rating and Material */}
        <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
          <span className="font-sans font-light truncate max-w-[130px]" title={product.material}>
            {product.material}
          </span>
          <div className="flex items-center gap-1 text-[#C49F5D] font-mono shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Price Tagging */}
        <div className="mt-4 flex items-baseline gap-2.5 pt-3 border-t border-stone-100">
          <span className="font-sans text-base font-semibold text-stone-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="font-sans text-xs text-stone-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
