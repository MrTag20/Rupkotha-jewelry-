import React, { useState, useEffect } from "react";
import { X, Star, Truck, ShieldCheck, Award, ChevronDown, Check, Sparkles, MessageSquare } from "lucide-react";
import { Product, Review } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  wishlist,
  onToggleWishlist,
  relatedProducts,
  onSelectProduct,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [aiStory, setAiStory] = useState("");
  const [isLoadingStory, setIsLoadingStory] = useState(false);

  // Initialize selected image when product changes
  useEffect(() => {
    setSelectedImage(product.image);
    fetchReviews();
    fetchJewelryStory();
  }, [product]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchJewelryStory = async () => {
    setIsLoadingStory(true);
    setAiStory("");
    try {
      const res = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a short, poetic heirlooom story (about 100-150 words) for our beautiful jewel "${product.name}". It is crafted of ${product.material} and is of category ${product.category}. Highlight the deep heritage, spiritual beauty, or craftsmanship. Use elegant tone.`,
          type: "story",
          currentProduct: product
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiStory(data.reply);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingStory(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({ success: false, text: "Please enter a valid 6-digit PIN code." });
      return;
    }
    // Sonarpur pincodes generally start with 700150, 700149, 743330, etc. (West Bengal codes start with 7)
    if (pincode.startsWith("7")) {
      setPincodeStatus({ success: true, text: "Premium Courier Available. Delivery within 1-2 working days." });
    } else {
      setPincodeStatus({ success: true, text: "Insured Pan-India Express Shipping available. Delivered in 4-6 days." });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        })
      });
      if (res.ok) {
        setReviewName("");
        setReviewComment("");
        setReviewRating(5);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <div id="product-detail-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center items-start py-8 px-4 sm:py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-6xl bg-[#FAF9F5] shadow-2xl rounded-3xl overflow-hidden text-stone-800"
      >
        {/* Close button */}
        <button
          id="detail-modal-close"
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 text-stone-500 hover:text-stone-900 bg-[#FAF9F5]/80 backdrop-blur-md rounded-full transition-colors border border-stone-200/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12">
          {/* Left Column: Media Gallery */}
          <div className="space-y-4">
            {/* Main Stage with Zoom on Hover */}
            <div
              id="detail-image-stage"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/40 cursor-zoom-in"
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-200"
                style={{
                  transform: isZoomed ? "scale(1.8)" : "scale(1)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded bg-[#1C1917]/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono text-[#E5D5B8]">
                Hover to magnify craft details
              </span>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.image, product.hoverImage].map((img, i) => (
                <button
                  key={i}
                  id={`gallery-thumb-${i}`}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedImage === img ? "border-[#C49F5D]" : "border-stone-200"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-200/60 text-center text-xs text-stone-600 font-medium">
              <div className="flex flex-col items-center p-3.5 bg-stone-100/60 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-[#C49F5D] mb-1.5" />
                <span className="font-semibold text-stone-800">100% Certified</span>
                <span className="text-[10px] text-stone-500 font-light mt-0.5">{product.hallmark}</span>
              </div>
              <div className="flex flex-col items-center p-3.5 bg-stone-100/60 rounded-xl">
                <Award className="w-6 h-6 text-[#C49F5D] mb-1.5" />
                <span className="font-semibold text-stone-800">Hallmarked Gold</span>
                <span className="text-[10px] text-stone-500 font-light mt-0.5">BIS 916 Pure</span>
              </div>
              <div className="flex flex-col items-center p-3.5 bg-stone-100/60 rounded-xl">
                <Truck className="w-6 h-6 text-[#C49F5D] mb-1.5" />
                <span className="font-semibold text-stone-800">Fully Insured</span>
                <span className="text-[10px] text-stone-500 font-light mt-0.5">Free Safe Transit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Jewel Details & Checkout Flow */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C49F5D] font-semibold">
                {product.category}
              </span>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-wide leading-tight">
                {product.name}
              </h1>

              {/* Star Rating summary */}
              <div className="mt-2.5 flex items-center gap-4 text-sm text-stone-600">
                <div className="flex items-center gap-1.5 text-[#C49F5D] font-semibold">
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span>|</span>
                <span>{reviews.length || product.reviewsCount} verified reviews</span>
                {product.stock <= 3 && (
                  <span className="text-red-500 text-xs font-mono font-medium animate-pulse ml-auto bg-red-50 px-2 py-0.5 border border-red-100">
                    Only {product.stock} left in showroom
                  </span>
                )}
              </div>

              {/* Pricing section */}
              <div className="mt-5 bg-stone-100/50 p-4 border border-stone-200/30">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-semibold text-stone-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-stone-400 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-[#C49F5D] font-bold font-mono">
                        ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-1.5 text-[11px] font-mono text-stone-500">
                  MRP Incl. of all taxes (Metal Rate: 22k Yellow Gold)
                </div>
              </div>

              {/* AI Jewelry Story section */}
              <div className="mt-6 border-l-2 border-[#C49F5D] bg-stone-50 p-4 text-xs italic leading-relaxed text-stone-600 font-light">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#C49F5D] block not-italic font-bold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C49F5D]" /> The Heirloom Story of Rupkotha
                </span>
                {isLoadingStory ? (
                  <div className="flex items-center gap-2 text-stone-400 font-mono text-[10px] py-1.5">
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-stone-300 border-t-[#C49F5D] rounded-full" />
                    <span>Spinning royal tales...</span>
                  </div>
                ) : (
                  <p>{aiStory || "This breathtaking, masterfully structured heirloom piece preserves Bengal's majestic artistry, hallmarked and certified to represent timeless devotion and ancestral pride."}</p>
                )}
              </div>

              {/* Metal Specs details */}
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-b border-stone-200/50 pb-6">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-400">Purity</span>
                  <span className="font-medium text-stone-800">{product.material}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-400">Certified By</span>
                  <span className="font-medium text-[#C49F5D] font-mono">{product.hallmark}</span>
                </div>
                {product.carat && (
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-400">Metal Weight / Carat</span>
                    <span className="font-medium text-stone-800">{product.carat}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-400">Available Stock</span>
                  <span className="font-medium text-stone-800">{product.stock} Units</span>
                </div>
              </div>

              {/* Accordion Description & FAQs */}
              <div className="mt-6 space-y-2 text-xs">
                {/* Description Accordion */}
                <div className="border-b border-stone-200/60">
                  <button
                    onClick={() => toggleAccordion("description")}
                    className="w-full flex justify-between items-center py-3 text-left font-semibold text-stone-800 font-sans tracking-wide uppercase"
                  >
                    <span>Product Story & Craft details</span>
                    <ChevronDown className={`w-4.5 h-4.5 text-stone-400 transition-transform ${activeAccordion === "description" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeAccordion === "description" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pb-4 leading-relaxed text-stone-500 font-light"
                      >
                        {product.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Shipping & Delivery Checker Accordion */}
                <div className="border-b border-stone-200/60">
                  <button
                    onClick={() => toggleAccordion("shipping")}
                    className="w-full flex justify-between items-center py-3 text-left font-semibold text-stone-800 font-sans tracking-wide uppercase"
                  >
                    <span>Check Shipping & Showroom Availability</span>
                    <ChevronDown className={`w-4.5 h-4.5 text-stone-400 transition-transform ${activeAccordion === "shipping" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeAccordion === "shipping" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pb-4 space-y-3"
                      >
                        <p className="text-stone-500 font-light leading-relaxed">
                          Enter your PIN code to check express delivery availability, secure courier insurance options, or next-day showroom pickups at Sonarpur.
                        </p>
                        <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit Pincode (e.g. 700150)"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                            className="flex-1 bg-white border border-stone-200 rounded px-3 py-2 text-xs outline-none focus:border-[#C49F5D]"
                          />
                          <button
                            type="submit"
                            className="bg-[#1C1917] text-[#E5D5B8] text-[10px] uppercase tracking-wider font-semibold px-4 py-2 hover:bg-[#C49F5D] hover:text-stone-950 transition-colors"
                          >
                            Check
                          </button>
                        </form>
                        {pincodeStatus && (
                          <div className={`text-[11px] font-medium flex items-center gap-1.5 ${pincodeStatus.success ? "text-emerald-600" : "text-red-500"}`}>
                            <Check className="w-3.5 h-3.5" />
                            <span>{pincodeStatus.text}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Shopping Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200/50">
              <button
                id="modal-add-to-cart"
                onClick={() => {
                  onAddToCart(product);
                }}
                className="flex-1 border border-[#C49F5D] text-[#C49F5D] hover:bg-[#C49F5D] hover:text-stone-950 font-sans text-xs uppercase tracking-widest font-bold py-4 text-center transition-colors duration-300"
              >
                Add to Bag
              </button>
              <button
                id="modal-buy-now"
                onClick={() => {
                  onBuyNow(product);
                }}
                className="flex-1 bg-[#1C1917] hover:bg-[#C49F5D] text-white hover:text-stone-950 font-sans text-xs uppercase tracking-widest font-bold py-4 text-center transition-colors duration-300"
              >
                Buy It Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section & Submission Panel */}
        <div className="border-t border-stone-200 bg-stone-50/50 p-6 sm:p-10 lg:p-12">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Reviews list */}
            <div>
              <h3 className="font-serif text-lg text-stone-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C49F5D]" /> Customer Appreciations
              </h3>
              {reviews.length === 0 ? (
                <div className="text-stone-400 font-light text-xs py-8 text-center border border-dashed border-stone-200 bg-white">
                  Be the first to write a beautiful review for this masterfully crafted jewel.
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-4 rounded-xl border border-stone-200/40 shadow-sm text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-stone-800">{rev.customerName}</span>
                        <span className="text-[10px] text-stone-400">{rev.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#C49F5D] my-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-current" : "text-stone-200"}`} />
                        ))}
                      </div>
                      <p className="text-stone-600 font-light leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit review */}
            <div className="bg-white p-6 border border-stone-200/50 rounded-2xl shadow-sm">
              <h4 className="font-serif text-base text-stone-800 mb-4 font-semibold">Write an Appreciation</h4>
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1">Your Noble Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Appreciation Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-[#C49F5D] hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? "fill-current" : "text-stone-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Your Experience & Compliments</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the gemstone, fit, shine, and service of this RUPKOTHA creation..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 text-[10px] uppercase tracking-widest font-bold py-3 transition-colors duration-300"
                >
                  {isSubmittingReview ? "Submitting Appreciation..." : "Submit Appreciation"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-stone-200 p-6 sm:p-10 lg:p-12">
            <h3 className="font-serif text-lg text-stone-900 tracking-wide mb-6">You May Also Cherish</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rp) => (
                <div
                  key={rp.id}
                  id={`related-product-${rp.id}`}
                  onClick={() => onSelectProduct(rp)}
                  className="group cursor-pointer text-xs"
                >
                  <div className="aspect-square overflow-hidden bg-stone-100 rounded-xl mb-3 border border-stone-200/20">
                    <img src={rp.image} alt={rp.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="font-serif text-stone-800 truncate">{rp.name}</h4>
                  <p className="mt-1 font-sans font-semibold text-stone-900">₹{rp.price.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
