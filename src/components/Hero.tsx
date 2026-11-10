import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
  onBookAppointment: () => void;
}

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1920",
    title: "Every Jewel Tells a Story",
    subtitle: "Rupkotha's Signature Bridal & Diamond Curation",
    description: "Crafting rare family heirlooms in Sonarpur since generations, fusing centuries-old Bengali filigree craft with modern elegance.",
    primaryCTA: "Explore Catalog",
    secondaryCTA: "Book Private Viewing"
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1920",
    title: "Crafting Sacred Bonds",
    subtitle: "The Royal Bridal Wedding Collection",
    description: "Immerse yourself in BIS 916 hallmarked pure yellow gold collar necklaces, handcrafted by our master swarnakars.",
    primaryCTA: "Discover Bridal",
    secondaryCTA: "Showroom Appointment"
  }
];

export default function Hero({ onExplore, onBookAppointment }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="rupkotha-hero" className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-stone-950">
      {/* Slide Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.65 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide].image})` }}
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-stone-950/20" />

      {/* Hero Content Container */}
      <div className="absolute inset-0 flex items-center px-4 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.25, delayChildren: 0.1 }
                },
                exit: { opacity: 0, transition: { duration: 0.5 } }
              }}
              className="max-w-2xl text-left"
            >
              {/* Badge */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                className="inline-flex items-center gap-2 border border-[#E5D5B8]/30 bg-stone-900/60 px-4 py-1.5 rounded-full backdrop-blur-sm mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C49F5D]" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#E5D5B8] font-medium">
                  {HERO_SLIDES[currentSlide].subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-white leading-[1.15]"
              >
                {HERO_SLIDES[currentSlide].title.split(" ").map((word, i) => (
                  <span key={i} className="inline-block mr-3">
                    {word === "Jewel" || word === "Bonds" ? (
                      <span className="text-[#C49F5D] font-normal">{word}</span>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="mt-6 font-sans text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-xl"
              >
                {HERO_SLIDES[currentSlide].description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <button
                  id="hero-explore-btn"
                  onClick={onExplore}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-[#C49F5D] hover:bg-[#B38E4C] text-stone-950 font-sans text-xs sm:text-sm font-semibold tracking-widest uppercase px-6 py-4.5 rounded-none shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>{HERO_SLIDES[currentSlide].primaryCTA}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button
                  id="hero-booking-btn"
                  onClick={onBookAppointment}
                  className="group inline-flex items-center justify-center gap-2 border border-white/50 hover:border-[#C49F5D] bg-stone-950/20 backdrop-blur-md text-white hover:text-[#C49F5D] font-sans text-xs sm:text-sm font-semibold tracking-widest uppercase px-6 py-4.5 rounded-none transition-all duration-300 hover:bg-stone-900/40 hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{HERO_SLIDES[currentSlide].secondaryCTA}</span>
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 right-4 sm:right-8 lg:right-16 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            id={`hero-slide-indicator-${i}`}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              currentSlide === i ? "w-8 bg-[#C49F5D]" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
