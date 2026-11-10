import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, Phone, MessageCircle, Check, Map } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AppointmentModalProps {
  onClose: () => void;
}

const TIME_SLOTS = [
  "11:30 AM - 01:00 PM (Morning Tea & Viewing)",
  "01:00 PM - 02:30 PM (Midday Viewing Curation)",
  "03:00 PM - 04:30 PM (Royal Afternoon Session)",
  "04:30 PM - 06:00 PM (Golden Hour Viewing)",
  "06:30 PM - 08:00 PM (Exclusive Evening Tour)"
];

const COLLECTIONS = [
  "Royal Gold Bridal Suite",
  "Certified Solitaire & Diamond Rings",
  "Pure 925 Sterling Silver Ornaments",
  "Luxury Polki Kundan Wedding Sets",
  "Custom Heirloom Jewelry Designing",
  "Other Curation"
];

export default function AppointmentModal({ onClose }: AppointmentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [collection, setCollection] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedApt, setBookedApt] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          collectionOfInterest: collection,
          message
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBookedApt(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="appointment-booking-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center items-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-[#FAF9F5] shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row border border-stone-200/50"
      >
        {/* Close Button */}
        <button
          id="appointment-close-btn"
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 text-stone-500 hover:text-stone-900 bg-[#FAF9F5]/85 backdrop-blur-sm rounded-full transition-colors border border-stone-200/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Showroom Experience Details */}
        <div className="w-full md:w-[40%] bg-[#1C1917] p-8 text-[#E5D5B8] flex flex-col justify-between border-r border-stone-800">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C49F5D] font-mono block mb-2 font-bold">The Showroom Experience</span>
            <h3 className="font-serif text-2xl font-light text-white leading-tight mb-6">A Private Realm of Royal Luxury</h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed mb-6">
              Book an exclusive, personalized in-store consultation at our Sonarpur showroom. Indulge in complimentary Darjeeling tea while our senior stylists showcase rare jewelry curation designed to tell your custom story.
            </p>

            <div className="space-y-4 text-xs font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C49F5D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Showroom Location</h4>
                  <p className="text-stone-300 mt-0.5">Rupkotha Showroom, Sonarpur Station Road, Near Flyover, Sonarpur, Kolkata, West Bengal - 700150</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C49F5D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Viewing Hours</h4>
                  <p className="text-stone-300 mt-0.5">Monday - Sunday: 11:00 AM - 8:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800/80 space-y-3 shrink-0">
            <h4 className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Immediate Contact</h4>
            <div className="flex gap-2">
              <a
                href="tel:+919876543210"
                className="flex-1 flex items-center justify-center gap-2 bg-stone-900 border border-stone-700 py-3 text-xs text-[#E5D5B8] hover:bg-stone-850 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C49F5D]" />
                <span>Call Showroom</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-950 border border-emerald-900 py-3 text-xs text-emerald-300 hover:bg-emerald-900 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Confirmation Screen */}
        <div className="w-full md:w-[60%] p-8 sm:p-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!bookedApt ? (
              <motion.div
                key="form-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-serif text-xl text-stone-900 mb-6 font-medium">Request a Private Viewing Slot</h3>
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-500 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priyanjali Sen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-3.5 py-3 outline-none focus:border-[#C49F5D] text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-3.5 py-3 outline-none focus:border-[#C49F5D] text-stone-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. priya.sen@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3.5 py-3 outline-none focus:border-[#C49F5D] text-stone-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-500 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-3.5 py-3 outline-none focus:border-[#C49F5D] text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 mb-1">Select Curation Interest</label>
                      <select
                        value={collection}
                        onChange={(e) => setCollection(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-3.5 py-3 outline-none focus:border-[#C49F5D] text-stone-800"
                      >
                        <option value="">-- Choose Category --</option>
                        {COLLECTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Select Time Window</label>
                    <select
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3.5 py-3 outline-none focus:border-[#C49F5D] text-stone-800"
                    >
                      <option value="">-- Choose Slot --</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Custom Styling Requests / Occasion Details (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Describe what you are looking for, dress color codes, wedding date, or custom gemstone requests..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-3.5 py-3 outline-none focus:border-[#C49F5D] text-stone-800 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 font-sans text-xs uppercase tracking-widest font-bold py-4.5 text-center transition-colors duration-300"
                  >
                    {isSubmitting ? "Reserving Slot..." : "Request Reservation"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 mb-6">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 tracking-wide font-light">Appointment Reserved</h3>
                <p className="mt-3 text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-md mx-auto">
                  Namaste, <span className="font-semibold text-stone-800">{bookedApt.name}</span>. Your private viewing appointment has been locked on <span className="font-semibold text-stone-800">{bookedApt.date}</span> during the <span className="font-semibold text-[#C49F5D]">{bookedApt.time}</span>.
                </p>

                <div className="mt-8 p-5 bg-stone-100/60 border border-stone-200/50 inline-block text-left text-xs space-y-2 rounded-2xl max-w-sm w-full">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Appointment ID</span>
                    <span className="font-mono font-bold text-stone-800">{bookedApt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Visitor Contact</span>
                    <span className="font-medium text-stone-800">{bookedApt.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Curation Focus</span>
                    <span className="font-medium text-stone-800 truncate max-w-[180px]">{bookedApt.collectionOfInterest || "General Curation"}</span>
                  </div>
                </div>

                <p className="mt-6 text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                  A verification SMS/Email is on its way.
                </p>

                <button
                  onClick={onClose}
                  className="mt-8 inline-flex bg-[#1C1917] hover:bg-[#C49F5D] text-white hover:text-stone-950 font-sans text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
