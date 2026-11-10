import React, { useState } from "react";
import { X, ShoppingBag, Heart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Product, CartItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CartWishlistDrawersProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onClearCart: () => void;
}

export default function CartWishlistDrawers({
  isCartOpen,
  setIsCartOpen,
  isWishlistOpen,
  setIsWishlistOpen,
  cart,
  setCart,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onClearCart,
}: CartWishlistDrawersProps) {
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<string | null>(null);

  // Checkout state
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<any | null>(null);

  // Cart math
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const appliedDiscount = Math.round((subtotal * discountPercent) / 100) + flatDiscount;
  const grandTotal = Math.max(0, subtotal - appliedDiscount);

  const handleUpdateQty = (productId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = couponCode.toUpperCase().trim();
    if (normalized === "RUPKOTHA10") {
      setDiscountPercent(10);
      setFlatDiscount(0);
      setCouponStatus("Coupon applied: 10% Royal Discount");
    } else if (normalized === "ROYALGIFT") {
      if (subtotal < 10000) {
        setCouponStatus("Coupon valid only for orders above ₹10,000");
        return;
      }
      setDiscountPercent(0);
      setFlatDiscount(5000);
      setCouponStatus("Coupon applied: ₹5,000 Flat Off");
    } else {
      setCouponStatus("Invalid coupon code.");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custAddress) return;

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        customerName: custName,
        customerEmail: custEmail,
        customerPhone: custPhone,
        shippingAddress: custAddress,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        totalAmount: grandTotal,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderSuccessDetails(data);
        onClearCart();
        setIsCheckoutMode(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const resetCheckout = () => {
    setIsCheckoutMode(false);
    setOrderSuccessDetails(null);
    setCustName("");
    setCustEmail("");
    setCustPhone("");
    setCustAddress("");
    setCouponCode("");
    setDiscountPercent(0);
    setFlatDiscount(0);
    setCouponStatus(null);
  };

  return (
    <>
      {/* 1. CART DRAWER (Slide-over right) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col h-full text-stone-800"
              >
                {/* Header */}
                <div className="p-6 border-b border-stone-200/50 flex justify-between items-center bg-[#1C1917] text-[#E5D5B8]">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#C49F5D]" />
                    <h3 className="font-serif text-lg tracking-wider text-white">Your Jewelry Bag</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-1.5 text-stone-400 hover:text-white rounded-full border border-stone-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar">
                  {orderSuccessDetails ? (
                    /* Order Successful Splash Screen */
                    <div className="text-center py-10 space-y-6">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 mb-2">
                        <Sparkles className="w-6 h-6 text-[#C49F5D] animate-spin" />
                      </div>
                      <h4 className="font-serif text-2xl font-light text-stone-900 tracking-wide">Sacred Order Locked</h4>
                      <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed px-4">
                        Namaste, <span className="font-semibold text-stone-800">{orderSuccessDetails.customerName}</span>. Your royal luxury order has been locked and registered under reference index <strong className="font-mono text-stone-800">{orderSuccessDetails.id}</strong>.
                      </p>

                      <div className="bg-stone-100 p-5 rounded-2xl text-left text-xs space-y-2 max-w-sm mx-auto border">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Dispatch ID</span>
                          <span className="font-mono font-bold text-stone-800">{orderSuccessDetails.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Total Charged</span>
                          <span className="font-bold text-[#C49F5D]">₹{orderSuccessDetails.totalAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Consignee Address</span>
                          <span className="font-medium text-stone-800 truncate max-w-[150px]">{orderSuccessDetails.shippingAddress}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                        Insured Transit is active. Live dispatch logs are open.
                      </p>

                      <button
                        onClick={resetCheckout}
                        className="w-full bg-[#1C1917] hover:bg-[#C49F5D] text-white hover:text-stone-950 font-sans text-xs uppercase tracking-widest font-bold py-4 transition-colors"
                      >
                        Explore More Jewels
                      </button>
                    </div>
                  ) : isCheckoutMode ? (
                    /* Checkout Form Screen */
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <h4 className="font-serif text-base text-stone-800 font-semibold">Insured Checkout</h4>
                        <button onClick={() => setIsCheckoutMode(false)} className="text-xs text-[#C49F5D] font-mono hover:underline">
                          Back to Bag
                        </button>
                      </div>

                      <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-stone-500 mb-1">Your Noble Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Priyanjali Sen"
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-500 mb-1">Mobile Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +91 98765 43210"
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-500 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. priya@example.com"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-500 mb-1">Secure Shipping Address (with PIN)</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Enter detailed delivery address with city, state, and 6-digit PIN code..."
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D] resize-none"
                          />
                        </div>

                        <div className="pt-4 border-t border-stone-100">
                          <div className="flex justify-between text-xs text-stone-500 py-1">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString("en-IN")}</span>
                          </div>
                          {appliedDiscount > 0 && (
                            <div className="flex justify-between text-xs text-stone-500 py-1">
                              <span>Applied Discount</span>
                              <span className="text-emerald-600">- ₹{appliedDiscount.toLocaleString("en-IN")}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm font-semibold text-stone-900 py-2 border-t mt-2">
                            <span>Total (Insured)</span>
                            <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isPlacingOrder}
                          className="w-full bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 font-sans text-xs uppercase tracking-widest font-bold py-4 transition-colors"
                        >
                          {isPlacingOrder ? "Locking Order..." : "Place Insured Order"}
                        </button>
                      </form>
                    </div>
                  ) : cart.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-20 space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-lg font-light">Your Jewelry Bag is Empty</h4>
                      <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
                        Curation takes time. Select our hallmarked pieces to load your custom family heirloom collection.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="inline-flex bg-[#1C1917] hover:bg-[#C49F5D] text-white hover:text-stone-950 font-sans text-[11px] uppercase tracking-widest font-semibold px-6 py-3"
                      >
                        Start Curation
                      </button>
                    </div>
                  ) : (
                    /* Cart list */
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex gap-4 border-b border-stone-200/50 pb-4">
                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg border bg-stone-100" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-xs sm:text-sm text-stone-800 truncate leading-tight">{item.product.name}</h4>
                              <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">{item.product.category}</p>
                              <p className="font-sans text-xs font-semibold text-stone-900 mt-2">₹{item.product.price.toLocaleString("en-IN")}</p>

                              {/* Qty selectors */}
                              <div className="flex items-center gap-3 mt-3">
                                <button onClick={() => handleUpdateQty(item.product.id, -1)} className="p-1 border border-stone-300 rounded hover:bg-stone-100 transition-colors">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono text-xs font-bold text-stone-800">{item.quantity}</span>
                                <button onClick={() => handleUpdateQty(item.product.id, 1)} className="p-1 border border-stone-300 rounded hover:bg-stone-100 transition-colors">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <button onClick={() => handleRemoveItem(item.product.id)} className="p-1 text-stone-400 hover:text-red-500 self-start transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Coupon Application Panel */}
                      <form onSubmit={handleApplyCoupon} className="border-t border-stone-200/60 pt-4 text-xs">
                        <label className="block text-stone-500 mb-1.5 font-medium">Have a Royal Coupon / Referral code?</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. RUPKOTHA10"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 bg-white border border-stone-200 rounded px-3 py-2 outline-none focus:border-[#C49F5D] text-stone-800 font-mono tracking-wider uppercase text-xs"
                          />
                          <button type="submit" className="bg-[#1C1917] text-[#E5D5B8] px-4 hover:bg-[#C49F5D] hover:text-stone-950 transition-colors uppercase font-semibold text-[10px] tracking-wider">
                            Apply
                          </button>
                        </div>
                        {couponStatus && (
                          <div className="text-[10px] mt-1.5 font-semibold text-[#C49F5D] font-mono">
                            {couponStatus}
                          </div>
                        )}
                        <p className="mt-2 text-[10px] text-stone-400 leading-normal">
                          Try <strong className="font-mono text-stone-600">RUPKOTHA10</strong> (10% Off) or <strong className="font-mono text-stone-600">ROYALGIFT</strong> (₹5,000 Flat Off on ₹10k+).
                        </p>
                      </form>
                    </div>
                  )}
                </div>

                {/* Footer totals */}
                {!orderSuccessDetails && !isCheckoutMode && cart.length > 0 && (
                  <div className="p-6 border-t border-stone-200 bg-stone-100/60 text-xs shrink-0">
                    <div className="flex justify-between py-1.5">
                      <span className="text-stone-400">Showroom Subtotal</span>
                      <span className="font-semibold text-stone-800">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between py-1.5">
                        <span className="text-stone-400">Coupon Savings</span>
                        <span className="text-emerald-600 font-semibold">- ₹{appliedDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-t border-stone-200/80 font-semibold text-stone-900 text-sm mt-2">
                      <span>Total (Insured Delivery)</span>
                      <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2.5">
                      <button
                        onClick={() => setIsCheckoutMode(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#C49F5D] text-white hover:text-stone-950 font-sans text-xs uppercase tracking-widest font-bold py-4 transition-all"
                      >
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 tracking-wide font-mono uppercase mt-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Insured SSL Encrypted Dispatch</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. WISHLIST DRAWER (Slide-over right) */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsWishlistOpen(false)} />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col h-full text-stone-800"
              >
                {/* Header */}
                <div className="p-6 border-b border-stone-200/50 flex justify-between items-center bg-[#1C1917] text-[#E5D5B8]">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                    <h3 className="font-serif text-lg tracking-wider text-white">Your Desired Keepsakes</h3>
                  </div>
                  <button onClick={() => setIsWishlistOpen(false)} className="p-1.5 text-stone-400 hover:text-white rounded-full border border-stone-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                        <Heart className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-lg font-light">Your Wishlist is Empty</h4>
                      <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
                        Save your favorite certified diamonds, silver ornaments, and traditional bridal golds here to easily reference them.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlist.map((prod) => (
                        <div key={prod.id} className="flex gap-4 border-b border-stone-200/50 pb-4 items-center">
                          <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-lg border bg-stone-100" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs sm:text-sm text-stone-800 truncate leading-tight">{prod.name}</h4>
                            <p className="text-[10px] font-mono text-[#C49F5D] uppercase mt-0.5">{prod.category}</p>
                            <p className="font-sans text-xs font-semibold text-stone-900 mt-2">₹{prod.price.toLocaleString("en-IN")}</p>

                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => {
                                  onAddToCart(prod);
                                  onToggleWishlist(prod);
                                }}
                                className="bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 font-semibold px-3 py-1.5 rounded text-[10px] tracking-wider uppercase transition-colors"
                              >
                                Move to Bag
                              </button>
                              <button
                                onClick={() => onToggleWishlist(prod)}
                                className="border border-stone-300 text-stone-600 hover:text-red-500 hover:border-red-500 px-3 py-1.5 rounded text-[10px] tracking-wider uppercase transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
