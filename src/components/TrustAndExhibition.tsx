import React, { useState } from "react";
import { Shield, Sparkles, RefreshCw, Compass, ArrowRight, Instagram } from "lucide-react";
import { motion } from "motion/react";

interface TrustAndExhibitionProps {
  onBookAppointment: () => void;
  onExploreWedding: () => void;
  onSelectBudget?: (budget: number) => void;
}

const INSTAGRAM_SHOTS = [
  {
    url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600",
    likes: "2.4K",
    tag: "@rupkotha.bridal"
  },
  {
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    likes: "1.8K",
    tag: "@rupkotha.precious"
  },
  {
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
    likes: "3.1K",
    tag: "@rupkotha.solitaire"
  },
  {
    url: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600",
    likes: "1.5K",
    tag: "@rupkotha.sterling"
  }
];

export default function TrustAndExhibition({ onBookAppointment, onExploreWedding, onSelectBudget }: TrustAndExhibitionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div id="trust-and-campaign-panels" className="bg-[#FAF9F5]">
      {/* 1. WEDDING & DIAMOND CAMPAIGN SECTION (Parallax look) */}
      <section className="relative h-[480px] w-full overflow-hidden bg-[#1C1917]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1611085583191-a3b1a3a35d41?auto=format&fit=crop&q=80&w=1600')"
          }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/50 to-transparent" />

        <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-xl text-left text-[#E5D5B8]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C49F5D] font-mono font-bold block mb-3">
              Imperial Wedding Campaign
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight tracking-wide">
              The Sovereign <br />
              <span className="text-[#C49F5D] italic">Bride of Bengal</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Step into our showroom to discover heavier filigree collars, layered chokers, and solid gold armlets. Handcrafted in 22k pure hallmarked gold with centuries of devotion.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                id="campaign-explore-wedding"
                onClick={onExploreWedding}
                className="group inline-flex items-center gap-2 bg-[#C49F5D] hover:bg-[#B38E4C] text-stone-950 font-sans text-[11px] font-bold uppercase tracking-widest px-6 py-4 rounded-none shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span>Discover Wedding Line</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="campaign-book"
                onClick={onBookAppointment}
                className="group inline-flex items-center gap-2 border border-white/40 bg-transparent text-white hover:text-[#C49F5D] hover:border-[#C49F5D] font-sans text-[11px] font-bold uppercase tracking-widest px-6 py-4 rounded-none transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span>Book VIP Slot</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY BUDGET BOUTIQUE (As per attached design specification) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-stone-200/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C49F5D] font-mono font-semibold">
              Personalized Price Stores
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#1C1917] leading-tight">
              Shop by Budget Boutique
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
              Explore our masterfully sorted collections. Find your desired milestone premium gold and certified diamonds within your preferred price range.
            </p>
            <div className="mt-4 h-1 w-12 bg-[#C49F5D] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mt-12 pb-8">
            {[
              {
                title: "Silver & Gifting",
                desc: "Lightweight premium silver, precious rings, and delicate everyday pieces.",
                maxPrice: 5000,
                labelText: "Under ₹4,999",
                bgColor: "bg-[#EAD0C3]", // Soft rosewood/beige
                textColor: "text-[#901A2E]" // Deep crimson burgundy
              },
              {
                title: "Casual Gold Glow",
                desc: "Authentic lightweight gold bands, minimalist chains, and kids' special items.",
                maxPrice: 20000,
                labelText: "Under ₹19,999",
                bgColor: "bg-[#F3C3A8]", // Sunset apricot
                textColor: "text-[#901A2E]"
              },
              {
                title: "Precious Diamonds",
                desc: "GIA & IGI certified everyday diamond pendants, bands, and subtle studs.",
                maxPrice: 50000,
                labelText: "Under ₹49,999",
                bgColor: "bg-[#E2A782]", // Peach terracotta
                textColor: "text-[#901A2E]"
              },
              {
                title: "Luxury Solitaires",
                desc: "Elite handcrafted bridal necklaces, certified wedding rings, and solitaires.",
                maxPrice: 100000,
                labelText: "Under ₹99,999",
                bgColor: "bg-[#D1BCA2]", // Warm golden sand
                textColor: "text-[#901A2E]"
              }
            ].map((b, idx) => (
              <motion.div
                key={b.labelText}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => onSelectBudget && onSelectBudget(b.maxPrice)}
                className={`group relative ${b.bgColor} rounded-[2.5rem] p-8 pb-12 h-[220px] flex flex-col justify-start text-stone-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-visible`}
              >
                {/* Minimal index decoration in background */}
                <div className="absolute right-6 top-5 text-stone-950/5 font-mono text-7xl select-none font-bold">
                  0{idx + 1}
                </div>

                <div className="space-y-2 max-w-[85%] z-10">
                  <h3 className="font-serif text-lg tracking-wide font-semibold text-stone-950">
                    {b.title}
                  </h3>
                  <p className="text-[12px] text-stone-800/80 font-light leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                {/* Overlapping Pill Shape matching attached image */}
                <div
                  className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-[85%] bg-white border-[3px] border-white py-3.5 px-6 rounded-full shadow-lg text-center hover:bg-[#FFF5F6] transition-all duration-300 z-20 group-hover:scale-105"
                >
                  <span className={`font-sans font-semibold tracking-wide text-xs sm:text-sm ${b.textColor}`}>
                    {b.labelText}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE RUPKOTHA (Bento Pillars) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C49F5D] font-mono font-semibold">
              Trusted Curation
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#1C1917] leading-tight">
              The Four Pillars of Rupkotha
            </h2>
            <div className="mt-4 h-1 w-12 bg-[#C49F5D] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8 text-[#C49F5D]" />,
                title: "100% Certified Purity",
                desc: "Every yellow gold article is stamped with a laser BIS 916 Hallmark. Every diamond is certified by GIA or IGI with serial engraving."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-[#C49F5D]" />,
                title: "Royal Swarnakars",
                desc: "We support over 150 local master artisans (Swarnakars) across Bengal, preserving pure handmade filigree and meenakari techniques."
              },
              {
                icon: <RefreshCw className="w-8 h-8 text-[#C49F5D]" />,
                title: "Lifetime Buyback",
                desc: "We offer transparent weight-by-weight pure metal buybacks and exchange values on current day rates, without deductions."
              },
              {
                icon: <Compass className="w-8 h-8 text-[#C49F5D]" />,
                title: "Atelier Customization",
                desc: "Sit with our design consultants or leverage Rupkotha AI to create tailored necklaces, fitting your specific style guidelines."
              }
            ].map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-8 border border-stone-200/40 shadow-sm rounded-3xl hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{pillar.icon}</div>
                <h3 className="font-serif text-lg text-stone-800 tracking-wide font-semibold">{pillar.title}</h3>
                <p className="mt-3 text-xs sm:text-sm text-stone-500 font-light leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INSTAGRAM & EXPOSITION GALLERY */}
      <section className="bg-stone-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-stone-200/40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C49F5D] font-mono font-bold">
                Exquisite Sightings
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-wide">
                As Seen on the Rupkotha Guild
              </h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs text-stone-600 hover:text-[#C49F5D] transition-colors font-semibold uppercase tracking-wider"
            >
              <Instagram className="w-4 h-4 text-[#C49F5D]" />
              <span>Follow @rupkotha.luxury</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INSTAGRAM_SHOTS.map((shot, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-stone-100 cursor-pointer shadow-sm"
              >
                <img
                  src={shot.url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                  <span className="text-right text-[10px] font-mono font-semibold tracking-wider text-[#E5D5B8]">
                    {shot.likes}
                  </span>
                  <span className="text-xs font-semibold tracking-wide">{shot.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LUXURY NEWSLETTER SIGNUP ("The Guild of Rupkotha") */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1C1917] text-[#E5D5B8] text-center relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C49F5D]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-2xl relative z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C49F5D] font-mono font-bold block mb-3">
            Guild Invitations
          </span>
          <h2 className="font-serif text-3xl font-light text-white tracking-wide">
            Join the Circle of Rupkotha
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-lg mx-auto">
            Subscribe to receive private showroom invitations, alerts for early gold rate locked sales, and rare gemstone curation catalogs direct to your letterbox.
          </p>

          <div className="mt-8">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block bg-stone-900/60 border border-stone-800 p-6 rounded-2xl max-w-md w-full"
              >
                <h4 className="font-serif text-[#C49F5D] font-bold text-sm">Welcome to the Inner Circle</h4>
                <p className="text-[11px] text-stone-300 mt-1">
                  You are now registered. Early-access event invites will be sent to you.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your personal email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-stone-900/60 border border-stone-800 text-stone-200 text-xs px-4 py-3.5 outline-none focus:border-[#C49F5D] text-left"
                />
                <button
                  type="submit"
                  className="bg-[#C49F5D] hover:bg-[#B38E4C] text-stone-950 font-sans text-[11px] uppercase tracking-widest font-bold px-6 py-3.5 transition-colors"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
