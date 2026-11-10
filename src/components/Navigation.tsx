import React, { useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X, Phone, MapPin, Sparkles } from "lucide-react";
import { Product, CartItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cart: CartItem[];
  wishlist: Product[];
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsAppointmentOpen: (open: boolean) => void;
  setIsStoryOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  cart,
  wishlist,
  setIsCartOpen,
  setIsWishlistOpen,
  setIsAppointmentOpen,
  setIsStoryOpen,
  searchQuery,
  setSearchQuery,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop Curation" },
    { id: "appointments", label: "Showroom Booking" },
    { id: "admin", label: "Admin Panel" },
  ];

  return (
    <header id="rupkotha-navigation" className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-[#FAF9F5]/80 backdrop-blur-md">
      {/* Top Bar Banner with Showroom Details */}
      <div className="bg-[#1C1917] text-[#E5D5B8] text-[11px] tracking-[0.15em] py-2 px-4 flex justify-between items-center font-mono sm:px-8">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#C49F5D]" /> Sonarpur, West Bengal
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-[#C49F5D]" /> +91 98765 43210
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="animate-pulse flex items-center gap-1 text-[#C49F5D] font-sans font-medium uppercase text-[10px]">
            <Sparkles className="w-2.5 h-2.5" /> Certified Hallmarked Jewellery Only
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-toggle"
            className="p-2 text-stone-700 hover:text-[#C49F5D] md:hidden transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Store Logo (Desktop: Left-aligned, Mobile: Centered/Left) */}
          <div 
            className="flex flex-col items-center md:items-start justify-center text-center md:text-left cursor-pointer select-none flex-1 md:flex-initial" 
            onClick={() => setActiveTab("home")}
          >
            <span className="font-serif text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold tracking-[0.2em] md:tracking-[0.25em] text-[#1C1917]">
              RUPKOTHA
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] md:tracking-[0.35em] text-[#C49F5D] font-mono mt-0.5">
              EVERY JEWEL TELLS A STORY
            </span>
          </div>

          {/* Unified Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-[11px] lg:text-[13px] uppercase tracking-[0.1em] lg:tracking-[0.15em] font-medium text-stone-600">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "appointments") {
                    setIsAppointmentOpen(true);
                  }
                }}
                className={`relative py-2 transition-all duration-300 hover:text-stone-900 cursor-pointer ${
                  activeTab === item.id ? "text-stone-900 font-semibold" : ""
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C49F5D]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Search Button */}
            <div className="relative">
              <AnimatePresence>
                {isSearchActive && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden bg-white border border-stone-200 rounded-full px-3 py-1"
                  >
                    <input
                      type="text"
                      placeholder="Search jewels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-stone-800"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                id="search-icon-btn"
                className="p-2 text-stone-700 hover:text-[#C49F5D] transition-colors rounded-full hover:bg-stone-100"
                onClick={() => {
                  setIsSearchActive(!isSearchActive);
                  if (activeTab !== "shop") setActiveTab("shop");
                }}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist */}
            <button
              id="wishlist-drawer-btn"
              className="relative p-2 text-stone-700 hover:text-[#C49F5D] transition-colors rounded-full hover:bg-stone-100"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C49F5D] rounded-full" />
              )}
            </button>

            {/* Cart */}
            <button
              id="cart-drawer-btn"
              className="relative p-2 text-stone-700 hover:text-[#C49F5D] transition-colors rounded-full hover:bg-stone-100"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C49F5D] text-[10px] font-bold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 border-b border-stone-200 bg-[#FAF9F5] shadow-lg md:hidden z-40"
          >
            <div className="space-y-1 px-4 pt-2 pb-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab(item.id);
                    if (item.id === "appointments") {
                      setIsAppointmentOpen(true);
                    }
                  }}
                  className={`block w-full py-3 text-left font-serif text-lg tracking-wider border-b border-stone-100 ${
                    activeTab === item.id ? "text-[#C49F5D] font-semibold" : "text-stone-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 flex flex-col gap-3 font-mono text-[11px] text-stone-500">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C49F5D]" /> Sonarpur, West Bengal
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C49F5D]" /> +91 98765 43210
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
