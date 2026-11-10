import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Filter, ChevronRight, SlidersHorizontal, Check, RefreshCw, Star } from "lucide-react";
import { Product, CartItem } from "./types";

// Import Custom Modular Components
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import FeaturedCollections from "./components/FeaturedCollections";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import StoryConsultantModal from "./components/StoryConsultantModal";
import AppointmentModal from "./components/AppointmentModal";
import CartWishlistDrawers from "./components/CartWishlistDrawers";
import TrustAndExhibition from "./components/TrustAndExhibition";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

const POETIC_QUOTES = [
  "Every jewel tells a story, echoing the royal heritage of Bengal.",
  "Handcrafted with centuries of devotion, certified for generations.",
  "Brilliance meets purity. Step into the realm of RUPKOTHA."
];

export default function App() {
  // App States
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"home" | "shop" | "admin">("home");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);

  // Cart & Wishlist States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Overlays / Modals States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);

  // Loading Screen & Styling State
  const [isLoading, setIsLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Sync Products from Backend on Mount
  useEffect(() => {
    fetchProducts();
    // Quote switcher interval
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % POETIC_QUOTES.length);
    }, 2500);

    // Initial gorgeous load delay
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      clearInterval(quoteTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Error fetching showroom products:", e);
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual Feedback (Drawer slide over)
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setSelectedProduct(null); // Close modal on purchase redirection
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSearchAndFilter = (category: string) => {
    setSelectedCategory(category);
    setMaxPriceFilter(null); // Clear budget filter when switching category
    setCurrentView("shop");
  };

  // Product Selection/Filtering parameters
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = maxPriceFilter === null || p.price <= maxPriceFilter;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans antialiased text-stone-800 scroll-smooth selection:bg-[#E5D5B8] selection:text-stone-900">
      <AnimatePresence mode="wait">
        {/* LUXURY INTRODUCING LOADER SCREEN */}
        {isLoading && (
          <motion.div
            key="luxury-loader"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[999] bg-[#1C1917] flex flex-col items-center justify-center text-[#E5D5B8] p-4"
          >
            <div className="text-center max-w-lg space-y-8">
              {/* Animated Emblem Logo */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="font-serif text-5xl sm:text-6xl font-light tracking-[0.3em] text-white">
                  RUPKOTHA
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-[1px] w-12 bg-[#C49F5D]" />
                  <Sparkles className="w-5 h-5 text-[#C49F5D] animate-pulse" />
                  <div className="h-[1px] w-12 bg-[#C49F5D]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#C49F5D] font-bold mt-2">
                  Every Jewel Tells a Story
                </span>
              </motion.div>

              {/* Poetic Quotes Switcher */}
              <div className="h-14 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="font-serif italic text-sm sm:text-base text-stone-300 font-light max-w-md leading-relaxed"
                  >
                    "{POETIC_QUOTES[quoteIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Slow Elegant Custom Progress Bar */}
              <div className="w-48 h-[1.5px] bg-stone-800 mx-auto rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 3.2, ease: "easeInOut" }}
                  className="h-full bg-[#C49F5D]"
                />
              </div>

              <span className="text-[9px] uppercase tracking-widest font-mono text-stone-500 font-medium block pt-3">
                Entering Digital Atelier • Sonarpur
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY GLASS HEADER NAVIGATION */}
      <Navigation
        activeTab={currentView}
        setActiveTab={(tab) => {
          if (tab === "home" || tab === "shop" || tab === "admin") {
            setCurrentView(tab);
          }
        }}
        cart={cart}
        wishlist={wishlist}
        setIsCartOpen={setIsCartOpen}
        setIsWishlistOpen={setIsWishlistOpen}
        setIsAppointmentOpen={setIsAppointmentOpen}
        setIsStoryOpen={setIsConsultantOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* MAIN LAYOUT CHANNELS */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Slider Hero */}
              <Hero
                onExplore={() => handleSearchAndFilter("All")}
                onBookAppointment={() => setIsAppointmentOpen(true)}
              />

              {/* Signature Featured Collections Grid */}
              <FeaturedCollections onSelectCategory={handleSearchAndFilter} />

              {/* Royal Heritage Festive Sale Announcement Poster */}
              <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
                <div className="mx-auto max-w-7xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-3xl bg-[#1C1917] text-[#FAF9F5] shadow-xl"
                  >
                    {/* Artistic Background Overlay */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-overlay scale-105"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200')`
                      }}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Royal Border Styling */}
                    <div className="absolute inset-3 border border-[#C49F5D]/30 rounded-[1.25rem] pointer-events-none" />

                    <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
                      {/* Left Side: Announcement Details */}
                      <div className="max-w-xl space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C49F5D]/10 border border-[#C49F5D]/30 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#C49F5D] font-mono">
                          <Sparkles className="w-3 h-3 animate-pulse" /> Limited Showroom Curation Offer
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FAF9F5] leading-tight tracking-wide">
                          The Royal <span className="text-[#C49F5D] italic font-serif">Solitaire & Gold</span> Festive Celebration
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                          Celebrate the heritage of Bengal's premium gold and certified solitaire diamonds with our seasonal exclusive benefits. Enjoy <span className="text-[#C49F5D] font-medium">Flat 25% OFF making charges</span> on all Gold sets, and <span className="text-[#C49F5D] font-medium">Flat 10% OFF</span> on loose luxury GIA diamonds.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[10px] sm:text-[11px] font-mono text-[#E5D5B8] uppercase tracking-wider pt-2">
                          <span>✨ BIS 916 HALLMARKED</span>
                          <span>✦ GIA & IGI CERTIFIED</span>
                          <span>💎 INSURED SHIPPING</span>
                        </div>
                      </div>

                      {/* Right Side: Visual Accent & Action Box */}
                      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-stone-900/60 border border-stone-800 rounded-2xl text-center backdrop-blur-sm min-w-[280px] sm:min-w-[320px]">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400">Exclusive Event</span>
                        <div className="mt-2 text-3xl sm:text-4xl font-serif font-light text-[#C49F5D]">
                          25% OFF
                        </div>
                        <span className="mt-1 text-[11px] uppercase tracking-wider text-stone-300 font-light">ON MAKING CHARGES</span>
                        
                        <div className="mt-6 w-full h-[1px] bg-stone-800" />
                        
                        <div className="mt-4 text-[10px] text-stone-400 font-mono">
                          Valid in showroom & online till June 30, 2026
                        </div>
                        
                        <button
                          onClick={() => handleSearchAndFilter("All")}
                          className="mt-6 w-full py-3 bg-[#C49F5D] hover:bg-[#FAF9F5] hover:text-stone-950 text-stone-950 font-sans text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                        >
                          Shop Festive Curation
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* High End Best Sellers Product showcase */}
              <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-stone-200/40 bg-white">
                <div className="mx-auto max-w-7xl">
                  {/* Section Title */}
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-[#C49F5D] font-mono font-semibold">
                      Atelier Favorites
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light tracking-wide text-stone-900 leading-tight">
                      Showroom Best Sellers
                    </h2>
                    <div className="mt-4 h-1 w-12 bg-[#C49F5D] mx-auto" />
                    <p className="mt-4 text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                      Handpicked masterpieces celebrating maximum elegance. Fully certified by BIS, GIA, & IGI.
                    </p>
                  </div>

                  {/* Best Sellers Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.slice(0, 4).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={setSelectedProduct}
                        wishlist={wishlist}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>

                  {/* View All Button */}
                  <div className="mt-14 text-center">
                    <button
                      onClick={() => handleSearchAndFilter("All")}
                      className="group inline-flex items-center gap-2 border border-[#C49F5D] hover:bg-[#C49F5D] text-[#C49F5D] hover:text-stone-950 font-sans text-xs font-bold uppercase tracking-widest px-8 py-4.5 rounded-none transition-all duration-300"
                    >
                      <span>Explore Our Full Catalog</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Campaign, Pillars, Gallery & Newsletter */}
              <TrustAndExhibition
                onBookAppointment={() => setIsAppointmentOpen(true)}
                onExploreWedding={() => handleSearchAndFilter("Bridal")}
                onSelectBudget={(budget) => {
                  setMaxPriceFilter(budget);
                  setSelectedCategory("All");
                  setCurrentView("shop");
                }}
              />
            </motion.div>
          )}

          {currentView === "shop" && (
            <motion.div
              key="shop-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[80vh]"
            >
              {/* Shop Breadcrumb Header */}
              <div className="border-b border-stone-200 pb-8 mb-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C49F5D] font-bold">RUPKOTHA Collections</span>
                <h1 className="mt-1 font-serif text-3xl font-light text-stone-900 tracking-wide">
                  Explore Heirloom Curation
                </h1>

                {/* Categories Bar */}
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {["All", "Gold", "Diamond", "Silver", "Bridal", "Daily", "Kids", "Gift"].map((cat) => (
                    <button
                      key={cat}
                      id={`category-filter-${cat}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setMaxPriceFilter(null);
                      }}
                      className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-full ${
                        selectedCategory === cat
                          ? "bg-[#1C1917] text-[#E5D5B8] font-bold"
                          : "bg-white text-stone-600 border border-stone-200/60 hover:bg-stone-50"
                      }`}
                    >
                      {cat} {cat === "All" ? "" : "Curation"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid with filters and products */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Search / Filter Side-rail */}
                <div className="bg-white border border-stone-200/40 p-6 rounded-2xl h-fit space-y-6">
                  <div className="flex items-center gap-2 border-b pb-3 text-stone-900">
                    <SlidersHorizontal className="w-4 h-4 text-[#C49F5D]" />
                    <h3 className="font-serif text-sm font-semibold uppercase tracking-wider">Refine Curation</h3>
                  </div>

                  {/* Search query box */}
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-mono">Keyword Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search carat, metal purity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#C49F5D] text-stone-800"
                      />
                      <Search className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
                    </div>
                  </div>

                  {/* Filter by Budget Sidebar Section */}
                  <div className="space-y-3 pt-4 border-t border-stone-100">
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-mono">Filter by Budget</label>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { label: "Under ₹5,000", value: 5000 },
                        { label: "Under ₹20,000", value: 20000 },
                        { label: "Under ₹50,000", value: 50000 },
                        { label: "Under ₹1,00,000", value: 100000 },
                      ].map((b) => (
                        <button
                          key={b.value}
                          onClick={() => setMaxPriceFilter(maxPriceFilter === b.value ? null : b.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all border flex items-center justify-between ${
                            maxPriceFilter === b.value
                              ? "bg-[#C49F5D]/10 border-[#C49F5D] text-stone-950 font-medium"
                              : "bg-stone-50/50 border-stone-150 text-stone-600 hover:bg-stone-100/50"
                          }`}
                        >
                          <span>{b.label}</span>
                          {maxPriceFilter === b.value && (
                            <span className="text-[10px] text-[#C49F5D] font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                    {maxPriceFilter && (
                      <button
                        onClick={() => setMaxPriceFilter(null)}
                        className="text-[11px] text-stone-500 hover:text-red-600 transition-colors flex items-center gap-1 font-mono mt-2"
                      >
                        ✕ Clear Budget Filter
                      </button>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block mb-2">Showroom parameters</span>
                    <div className="text-xs space-y-2 text-stone-600">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Check className="w-4 h-4" />
                        <span>All BIS 916 Hallmarked</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Check className="w-4 h-4" />
                        <span>Insured Pan-India shipping</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Product Catalog listing */}
                <div className="lg:col-span-3 space-y-8">
                  {filteredProducts.length === 0 ? (
                    <div className="bg-white border border-stone-200/50 p-16 text-center text-stone-400 rounded-2xl">
                      No matching luxury pieces found. Clear search parameters or try another Category.
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-stone-400 font-mono">
                        Showing {filteredProducts.length} certified masterpieces
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {filteredProducts.map((p) => (
                          <ProductCard
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddToCart}
                            onQuickView={setSelectedProduct}
                            wishlist={wishlist}
                            onToggleWishlist={handleToggleWishlist}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "admin" && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AdminPanel
                products={products}
                onRefreshProducts={fetchProducts}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SHARED GENERAL OVERLAYS, MODALS, DRAWERS */}
      <AnimatePresence>
        {/* 1. PRODUCT DETAIL MAGNIFY MODAL */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            relatedProducts={products.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {/* 2. PRIVATE APPOINTMENT BOOKING MODAL */}
        {isAppointmentOpen && (
          <AppointmentModal onClose={() => setIsAppointmentOpen(false)} />
        )}

        {/* 3. AI STORYTELLER & STYLING CONSULTANT CHAT OVERLAY */}
        {isConsultantOpen && (
          <StoryConsultantModal onClose={() => setIsConsultantOpen(false)} />
        )}

        {/* 4. CART & WISHLIST RIGHT SLIDE-OUT DRAWERS */}
        <CartWishlistDrawers
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          isWishlistOpen={isWishlistOpen}
          setIsWishlistOpen={setIsWishlistOpen}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onClearCart={handleClearCart}
        />
      </AnimatePresence>

      {/* GLOBAL FOOTER */}
      <Footer
        onNavigate={setCurrentView}
        onBookAppointment={() => setIsAppointmentOpen(true)}
        onOpenConsultant={() => setIsConsultantOpen(true)}
      />

      {/* Floating Call-to-Actions for premium mobile reach */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Floating AI Consultant Assistant bubble */}
        <button
          id="floating-ai-button"
          onClick={() => setIsConsultantOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 shadow-2xl transition-all duration-300 hover:scale-105"
          title="Rupkotha AI Storyteller"
        >
          <Sparkles className="w-6 h-6 animate-pulse text-[#C49F5D] group-hover:text-stone-950" />
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-[#1C1917] text-[#E5D5B8] text-[10px] font-mono uppercase tracking-widest font-bold py-1.5 px-3 whitespace-nowrap shadow-md transition-transform origin-right">
            AI Storyteller
          </span>
        </button>

        {/* Floating WhatsApp chat reservation */}
        <a
          id="floating-whatsapp-button"
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl transition-all duration-300 hover:scale-105"
          title="WhatsApp Concierge"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.905-6.99C16.659 1.875 14.183.841 11.54.841c-5.438 0-9.861 4.42-9.864 9.866-.001 1.702.484 3.364 1.404 4.811L1.93 21.148l5.854-1.534z" />
          </svg>
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-emerald-600 text-white text-[10px] font-mono uppercase tracking-widest font-bold py-1.5 px-3 whitespace-nowrap shadow-md transition-transform origin-right">
            Concierge Chat
          </span>
        </a>
      </div>
    </div>
  );
}
