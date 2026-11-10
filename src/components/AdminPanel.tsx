import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  Users,
  Plus,
  Trash2,
  Edit3,
  Tag,
  FileText,
  Image,
  Star,
  Check,
  X,
  Package,
  RefreshCw,
  Percent
} from "lucide-react";
import { Product, Order, Appointment, Review, BlogPost, DashboardStats } from "../types";
import { motion } from "motion/react";

interface AdminPanelProps {
  products: Product[];
  onRefreshProducts: () => void;
}

interface Coupon {
  code: string;
  discount: number;
  type: "percent" | "flat";
  active: boolean;
}

export default function AdminPanel({ products, onRefreshProducts }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders" | "appointments" | "reviews" | "coupons" | "blogs">("analytics");
  const [stats, setStats] = useState<DashboardStats>({
    sales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalAppointments: 0,
    scheduledAppointments: 0,
    totalCustomers: 0,
    productsCount: 0
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: "RUPKOTHA10", discount: 10, type: "percent", active: true },
    { code: "ROYALGIFT", discount: 5000, type: "flat", active: true },
    { code: "GOLDENCARD", discount: 15, type: "percent", active: false }
  ]);

  // Form states for Product
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("Gold Jewellery");
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOrigPrice, setProdOrigPrice] = useState(0);
  const [prodImage, setProdImage] = useState("");
  const [prodHoverImage, setProdHoverImage] = useState("");
  const [prodMaterial, setProdMaterial] = useState("");
  const [prodHallmark, setProdHallmark] = useState("BIS 916 Gold");
  const [prodDescription, setProdDescription] = useState("");
  const [prodCarat, setProdCarat] = useState("");
  const [prodStock, setProdStock] = useState(10);
  const [prodBadge, setProdBadge] = useState("");

  // Coupon form
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(0);
  const [newCouponType, setNewCouponType] = useState<"percent" | "flat">("percent");

  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchAppointments();
    fetchReviews();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productPayload = {
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      originalPrice: Number(prodOrigPrice) || Number(prodPrice),
      image: prodImage || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
      hoverImage: prodHoverImage || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600",
      material: prodMaterial,
      hallmark: prodHallmark,
      description: prodDescription,
      carat: prodCarat,
      stock: Number(prodStock),
      badge: prodBadge || undefined
    };

    try {
      let res;
      if (editingProductId) {
        res = await fetch(`/api/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload)
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload)
        });
      }

      if (res.ok) {
        onRefreshProducts();
        fetchStats();
        resetProductForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice);
    setProdImage(p.image);
    setProdHoverImage(p.hoverImage);
    setProdMaterial(p.material);
    setProdHallmark(p.hallmark);
    setProdDescription(p.description);
    setProdCarat(p.carat || "");
    setProdStock(p.stock);
    setProdBadge(p.badge || "");
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshProducts();
        fetchStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName("");
    setProdCategory("Gold Jewellery");
    setProdPrice(0);
    setProdOrigPrice(0);
    setProdImage("");
    setProdHoverImage("");
    setProdMaterial("");
    setProdHallmark("BIS 916 Gold");
    setProdDescription("");
    setProdCarat("");
    setProdStock(10);
    setProdBadge("");
    setIsProductFormOpen(false);
  };

  const handleOrderStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAppointmentStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAppointments();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newCop: Coupon = {
      code: newCouponCode.toUpperCase().replace(/\s+/g, ""),
      discount: Number(newCouponDiscount),
      type: newCouponType,
      active: true
    };
    setCoupons([...coupons, newCop]);
    setNewCouponCode("");
    setNewCouponDiscount(0);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  return (
    <div id="rupkotha-admin-dashboard" className="bg-[#FAF9F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-200 pb-8 mb-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C49F5D] font-bold">Rupkotha HQ Control</span>
            <h1 className="mt-1 font-serif text-3xl font-light text-stone-900 tracking-wide">Showroom Admin Dashboard</h1>
          </div>
          <button
            onClick={() => {
              fetchStats();
              fetchOrders();
              fetchAppointments();
              fetchReviews();
              onRefreshProducts();
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 border border-stone-300 bg-white hover:bg-stone-50 px-4 py-2.5 text-xs text-stone-700 tracking-wider uppercase font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Realtime Live Data</span>
          </button>
        </div>

        {/* Tab Switching Menu */}
        <div className="flex flex-wrap border-b border-stone-200 gap-1 mb-8 text-xs font-semibold tracking-wider uppercase">
          {[
            { id: "analytics", label: "Showroom Analytics", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "products", label: "Manage Products", icon: <Package className="w-4 h-4" /> },
            { id: "orders", label: "Orders Dispatch", icon: <ShoppingBag className="w-4 h-4" /> },
            { id: "appointments", label: "Appointments", icon: <Calendar className="w-4 h-4" /> },
            { id: "reviews", label: "Compliments", icon: <Star className="w-4 h-4" /> },
            { id: "coupons", label: "Coupons", icon: <Percent className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-4 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#C49F5D] text-stone-900 font-bold"
                  : "border-transparent text-stone-500 hover:text-stone-850"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: SHOWROOM ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 border border-stone-200/40 shadow-sm rounded-2xl">
                <div className="flex justify-between items-center text-stone-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Gross Showroom Revenue</span>
                  <TrendingUp className="w-5 h-5 text-[#C49F5D]" />
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-semibold text-stone-900">
                  ₹{stats.sales.toLocaleString("en-IN")}
                </div>
                <p className="mt-1.5 text-[10px] text-emerald-600 font-medium font-mono">
                  +18.4% since last Bengali New Year
                </p>
              </div>

              <div className="bg-white p-6 border border-stone-200/40 shadow-sm rounded-2xl">
                <div className="flex justify-between items-center text-stone-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Total Dispatched Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#C49F5D]" />
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-semibold text-stone-900">
                  {stats.totalOrders}
                </div>
                <p className="mt-1.5 text-[10px] text-amber-600 font-medium font-mono">
                  {stats.pendingOrders} orders pending fulfillment
                </p>
              </div>

              <div className="bg-white p-6 border border-stone-200/40 shadow-sm rounded-2xl">
                <div className="flex justify-between items-center text-stone-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Private Showroom Tours</span>
                  <Calendar className="w-5 h-5 text-[#C49F5D]" />
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-semibold text-stone-900">
                  {stats.totalAppointments}
                </div>
                <p className="mt-1.5 text-[10px] text-emerald-600 font-medium font-mono">
                  {stats.scheduledAppointments} scheduled VIP visits
                </p>
              </div>

              <div className="bg-white p-6 border border-stone-200/40 shadow-sm rounded-2xl">
                <div className="flex justify-between items-center text-stone-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Elite Registered Clientele</span>
                  <Users className="w-5 h-5 text-[#C49F5D]" />
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-semibold text-stone-900">
                  {stats.totalCustomers}
                </div>
                <p className="mt-1.5 text-[10px] text-stone-500 font-medium font-mono">
                  {stats.productsCount} active premium SKU codes
                </p>
              </div>
            </div>

            {/* Visual Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-stone-200/50 rounded-2xl shadow-sm lg:col-span-2">
                <h3 className="font-serif text-lg text-stone-900 mb-6">Fulfillment & Showroom Operations</h3>
                {/* SVG Mock chart */}
                <div className="h-[250px] w-full bg-stone-50/50 rounded-xl border border-stone-200/20 flex flex-col justify-between p-4 font-mono text-[10px] text-stone-400">
                  <div className="flex-1 flex items-end gap-6 sm:gap-10 px-4">
                    {[
                      { m: "Jan", v: 45 },
                      { m: "Feb", v: 60 },
                      { m: "Mar", v: 55 },
                      { m: "Apr", v: 90 },
                      { m: "May", v: 80 },
                      { m: "Jun", v: 120 }
                    ].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-[#E5D5B8] group-hover:bg-[#C49F5D] transition-colors relative"
                          style={{ height: `${val.v * 1.5}px` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-stone-700 bg-white border border-stone-200 px-1 rounded shadow-sm">
                            {val.v}L
                          </div>
                        </div>
                        <span>{val.m}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-stone-200 pt-3 text-center text-stone-500 font-sans">
                    Monthly Revenue Projection (INR in Lakhs)
                  </div>
                </div>
              </div>

              {/* Showroom info panel */}
              <div className="bg-white p-6 border border-stone-200/50 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-stone-900 mb-4">Staff Operations Briefing</h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    Showroom visitor levels at Sonarpur are running high. Gold bullion and VVS solitaire stocks are currently sufficient. Please ensure all booked clients are served Darjeeling black tea.
                  </p>
                </div>
                <div className="mt-6 space-y-3.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-400">Showroom Status</span>
                    <span className="font-mono text-emerald-600 font-bold uppercase tracking-wider">● ONLINE & ACTIVE</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-400">Terminal Address</span>
                    <span className="text-stone-800">CWR Container ingress port 3000</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-stone-400">Database Driver</span>
                    <span className="text-stone-800 font-mono">Local-JSON Persistent (data/db.json)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl text-stone-900 tracking-wide">Jewellery SKU Inventory</h3>
              {!isProductFormOpen && (
                <button
                  onClick={() => setIsProductFormOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Jewel SKU</span>
                </button>
              )}
            </div>

            {/* Product form */}
            {isProductFormOpen && (
              <div className="bg-white border border-stone-200/60 p-6 rounded-2xl shadow-sm max-w-3xl">
                <h4 className="font-serif text-base text-stone-800 mb-5 pb-3 border-b border-stone-100">
                  {editingProductId ? `Edit SKU ${editingProductId}` : "Register New Luxury SKU"}
                </h4>
                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-500 mb-1">Jewel SKU Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Bengali Bridal Necklace"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Curation Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    >
                      <option value="Gold Jewellery">Gold Jewellery</option>
                      <option value="Diamond Jewellery">Diamond Jewellery</option>
                      <option value="Silver Jewellery">Silver Jewellery</option>
                      <option value="Bridal Collection">Bridal Collection</option>
                      <option value="Daily Wear">Daily Wear</option>
                      <option value="Wedding Collection">Wedding Collection</option>
                      <option value="Kids Jewellery">Kids Jewellery</option>
                      <option value="Gift Collection">Gift Collection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Selling Price (INR)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 185000"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Original Price (INR for Discount comparison)</label>
                    <input
                      type="number"
                      placeholder="e.g. 210000"
                      value={prodOrigPrice}
                      onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Primary Unsplash/CDN Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Hover Image URL (For swap effects)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={prodHoverImage}
                      onChange={(e) => setProdHoverImage(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Material Composition Purity</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 22k Yellow Gold / 18k White Gold"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Hallmark Certification Badge</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BIS 916 Hallmarked / IGI Certified"
                      value={prodHallmark}
                      onChange={(e) => setProdHallmark(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Weight / Carat specifications</label>
                    <input
                      type="text"
                      placeholder="e.g. 24.5 Grams / 0.50 Ct"
                      value={prodCarat}
                      onChange={(e) => setProdCarat(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Showroom Stock Units</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Exclusive Offer Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. New Launch / Bridal Special"
                      value={prodBadge}
                      onChange={(e) => setProdBadge(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-500 mb-1">Luxury Item Story & Detailed Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write an elegant detailed description outlining filigree cuts, design inspirations, and bridal themes..."
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D] resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex gap-2 pt-4 border-t border-stone-100">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 font-bold py-3.5 text-center uppercase tracking-wider"
                    >
                      {editingProductId ? "Apply Edits" : "Save Product SKU"}
                    </button>
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="flex-1 border border-stone-300 text-stone-600 font-bold py-3.5 text-center uppercase tracking-wider hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 border border-stone-200/50 rounded-2xl flex gap-4 text-xs relative">
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg border" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#C49F5D] font-bold">{p.category}</span>
                    <h4 className="font-serif text-sm text-stone-800 truncate leading-tight mt-0.5">{p.name}</h4>
                    <p className="mt-1 font-semibold text-stone-950">₹{p.price.toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-stone-400 font-light truncate">{p.material}</p>
                    <p className="mt-1 text-[#C49F5D] font-mono">Stock: {p.stock} Units</p>
                  </div>

                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    <button
                      onClick={() => handleEditProductClick(p)}
                      className="p-1.5 bg-stone-100 hover:bg-[#FAF9F5] text-stone-600 hover:text-[#C49F5D] border border-stone-200 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100 rounded-lg transition-colors"
                      title="Delete SKU"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS DISPATCH MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            <h3 className="font-serif text-xl text-stone-900 tracking-wide">Dispatched Orders & Fulfillment</h3>

            {orders.length === 0 ? (
              <div className="bg-white border p-12 text-center text-stone-400 rounded-2xl">
                No orders registered on showroom database yet. Run checkout on the frontend!
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="bg-white border border-stone-200/50 p-6 rounded-2xl shadow-sm text-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Order Ref ID</span>
                        <h4 className="font-bold text-stone-900 text-sm mt-0.5">{o.id}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] text-stone-400 font-mono">{new Date(o.createdAt).toLocaleString()}</span>
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                          className={`rounded px-2.5 py-1 text-[11px] font-semibold border ${
                            o.status === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            o.status === "Cancelled" ? "bg-red-50 text-red-500 border-red-100" :
                            "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Details */}
                      <div>
                        <h5 className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] mb-2 font-mono">Consignee</h5>
                        <p className="text-stone-900 font-medium">{o.customerName}</p>
                        <p className="text-stone-500 mt-0.5">{o.customerPhone} | {o.customerEmail}</p>
                        <p className="text-stone-500 mt-0.5 leading-relaxed">{o.shippingAddress}</p>
                      </div>

                      {/* Items */}
                      <div>
                        <h5 className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] mb-2 font-mono">Purchased Jewels</h5>
                        <div className="space-y-2">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 bg-stone-50/50 p-2 border border-stone-200/20 rounded-xl items-center">
                              <img src={item.image} alt="" className="w-8 h-8 object-cover rounded border" referrerPolicy="no-referrer" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-stone-800 truncate">{item.name}</p>
                                <p className="text-stone-400 font-mono text-[10px]">₹{item.price.toLocaleString("en-IN")} x {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-stone-100 pt-3">
                      <span className="text-stone-400">Insured Checkout Invoice Value</span>
                      <span className="text-sm font-semibold text-stone-950">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STORE APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-8">
            <h3 className="font-serif text-xl text-stone-900 tracking-wide">Showroom Private Viewing Requests</h3>

            {appointments.length === 0 ? (
              <div className="bg-white border p-12 text-center text-stone-400 rounded-2xl">
                No appointments booked at our Sonarpur showroom yet. Book on the frontend!
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(a => (
                  <div key={a.id} className="bg-white border border-stone-200/50 p-6 rounded-2xl shadow-sm text-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Appointment ID</span>
                        <h4 className="font-bold text-stone-900 text-sm mt-0.5">{a.id}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={a.status}
                          onChange={(e) => handleAppointmentStatusChange(a.id, e.target.value)}
                          className={`rounded px-2.5 py-1 text-[11px] font-semibold border ${
                            a.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            a.status === "Cancelled" ? "bg-red-50 text-red-500 border-red-100" :
                            "bg-[#FAF9F5] text-stone-700 border-stone-300"
                          }`}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-semibold text-stone-400 uppercase tracking-wider text-[10px] mb-1 font-mono">Client Details</h5>
                        <p className="text-stone-900 font-bold">{a.name}</p>
                        <p className="text-stone-500 mt-0.5">{a.phone}</p>
                        <p className="text-stone-500 mt-0.5">{a.email}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-stone-400 uppercase tracking-wider text-[10px] mb-1 font-mono">Viewing Slot</h5>
                        <p className="text-stone-900 font-bold">{a.date}</p>
                        <p className="text-[#C49F5D] mt-0.5 font-medium">{a.time}</p>
                        <p className="text-stone-500 mt-0.5">Interested: {a.collectionOfInterest}</p>
                      </div>

                      {a.message && (
                        <div>
                          <h5 className="font-semibold text-stone-400 uppercase tracking-wider text-[10px] mb-1 font-mono">Styling Memo</h5>
                          <p className="text-stone-600 italic font-light">"{a.message}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REVIEWS COMPLIMENTS */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            <h3 className="font-serif text-xl text-stone-900 tracking-wide">Customer Reviews & Testimonial Feed</h3>

            {reviews.length === 0 ? (
              <div className="bg-white border p-12 text-center text-stone-400 rounded-2xl">
                No compliments registered on database yet. Submit a review from any product page!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white border border-stone-200/50 p-5 rounded-2xl shadow-sm text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-stone-800">{r.customerName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{r.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#C49F5D] mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : "text-stone-200"}`} />
                      ))}
                    </div>
                    <p className="text-stone-600 font-light leading-relaxed">"{r.comment}"</p>
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                      <span>Product SKU Ref: <strong className="font-mono text-stone-600">{r.productId}</strong></span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified Appreciator
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: COUPON MANAGER */}
        {activeTab === "coupons" && (
          <div className="space-y-8">
            <h3 className="font-serif text-xl text-stone-900 tracking-wide">Showroom Discount Coupons</h3>

            {/* Add coupon form */}
            <div className="bg-white border border-stone-200/50 p-6 rounded-2xl shadow-sm max-w-xl">
              <h4 className="font-serif text-base text-stone-800 mb-4 font-semibold">Mint New Discount Code</h4>
              <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-end">
                <div>
                  <label className="block text-stone-500 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SONARPUR10"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10 or 500"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D]"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2.5 outline-none focus:border-[#C49F5D] h-10"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Value (₹)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="sm:col-span-3 bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 font-bold py-3.5 uppercase tracking-wider"
                >
                  Create Active Coupon
                </button>
              </form>
            </div>

            {/* Coupons list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map(c => (
                <div key={c.code} className="bg-white border border-stone-200/50 p-5 rounded-2xl shadow-sm flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-sm text-stone-850 tracking-wider bg-stone-100 border px-3 py-1.5 rounded">{c.code}</span>
                    <p className="mt-3 text-stone-500">
                      Benefits: <strong className="text-stone-800">{c.type === "percent" ? `${c.discount}% Discount` : `₹${c.discount.toLocaleString("en-IN")} Flat Off`}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCouponStatus(c.code)}
                    className={`rounded px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wider ${
                      c.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100" : "bg-stone-100 text-stone-400 border border-stone-200 hover:bg-stone-200"
                    }`}
                  >
                    {c.active ? "Active" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
