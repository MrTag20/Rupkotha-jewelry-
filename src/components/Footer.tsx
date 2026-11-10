import React from "react";
import { Sparkles, MapPin, Phone, Mail, Clock } from "lucide-react";

interface FooterProps {
  onNavigate: (view: "home" | "admin" | "shop") => void;
  onBookAppointment: () => void;
  onOpenConsultant: () => void;
}

export default function Footer({ onNavigate, onBookAppointment, onOpenConsultant }: FooterProps) {
  return (
    <footer id="rupkotha-footer" className="bg-[#1C1917] text-[#E5D5B8] pt-20 pb-8 border-t border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-stone-800/80">
          {/* Column 1: Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-light tracking-widest text-white">RUPKOTHA</span>
              <Sparkles className="w-4 h-4 text-[#C49F5D]" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#C49F5D] font-mono font-bold">
              Every Jewel Tells a Story
            </p>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Located in Sonarpur, West Bengal, RUPKOTHA is an exclusive sanctuary of certified gold ornaments and GIA-certified diamonds. We preserve the majestic filigree heritage of Bengali swarnakars.
            </p>
          </div>

          {/* Column 2: Showroom Coordinates */}
          <div className="space-y-4 text-xs font-light">
            <h4 className="font-serif text-sm tracking-wider text-white font-medium uppercase">Showroom Coordinates</h4>
            <ul className="space-y-3 text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C49F5D] shrink-0 mt-0.5" />
                <span>Sonarpur Station Road, Near Flyover, Sonarpur, Kolkata, WB - 700150</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C49F5D] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C49F5D] shrink-0" />
                <a href="mailto:care@rupkotha.in" className="hover:text-white transition-colors">care@rupkotha.in</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C49F5D] shrink-0" />
                <span>Mon - Sun: 11:00 AM - 8:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation Guild */}
          <div className="space-y-4 text-xs font-light">
            <h4 className="font-serif text-sm tracking-wider text-white font-medium uppercase">Heritage Navigation</h4>
            <ul className="space-y-2 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-[#C49F5D] transition-colors">
                  Return Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("shop")} className="hover:text-[#C49F5D] transition-colors">
                  Shop Curation
                </button>
              </li>
              <li>
                <button onClick={onBookAppointment} className="hover:text-[#C49F5D] transition-colors">
                  Private Showroom Visits
                </button>
              </li>
              <li>
                <button onClick={onOpenConsultant} className="hover:text-[#C49F5D] transition-colors">
                  AI Styling Consultation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("admin")} className="hover:text-[#C49F5D] transition-colors">
                  Showroom HQ (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Certified Guarantee */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-wider text-white font-medium uppercase">Certified Guarantees</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              We stamp every item of gold with BIS 916 hallmarks. Diamonds come accompanied by certification reports issued by GIA & IGI. Transits are 100% insured.
            </p>
            <div className="flex gap-3 pt-2">
              <span className="inline-block bg-stone-900 border border-stone-800 px-2.5 py-1 text-[9px] font-mono uppercase text-[#E5D5B8]">
                BIS 916 PURE
              </span>
              <span className="inline-block bg-stone-900 border border-stone-800 px-2.5 py-1 text-[9px] font-mono uppercase text-[#E5D5B8]">
                GIA & IGI ENGRAVED
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} RUPKOTHA Luxury Ltd. Preserved under Bengal Swarnakar Guild.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-[#C49F5D] transition-colors">Privacy Charter</a>
            <a href="#terms" className="hover:text-[#C49F5D] transition-colors">Heirloom Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
