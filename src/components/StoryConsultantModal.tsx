import React, { useState } from "react";
import { X, Send, Sparkles, HeartHandshake, History, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StoryConsultantModalProps {
  onClose: () => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

const PRESETS = [
  {
    icon: <History className="w-4 h-4 text-[#C49F5D]" />,
    label: "Bengal Jewellery Heritage",
    prompt: "Tell me about the historical craftsmanship and heritage of traditional Bengali gold jewelry, like Nakashi and filigree art."
  },
  {
    icon: <Sparkles className="w-4 h-4 text-[#C49F5D]" />,
    label: "Bridal Styling Guidelines",
    prompt: "I am a Bengali bride wearing a deep crimson Benarasi saree. What jewelry set should I pair with it for my wedding?"
  },
  {
    icon: <HeartHandshake className="w-4 h-4 text-[#C49F5D]" />,
    label: "Heirloom Diamond Gift Advice",
    prompt: "I want to buy an heirloom diamond jewelry piece for my daughter's graduation. What would represent timeless devotion?"
  },
  {
    icon: <HelpCircle className="w-4 h-4 text-[#C49F5D]" />,
    label: "Understanding Hallmark Rules",
    prompt: "Explain why BIS 916 Hallmarking on yellow gold and GIA/IGI certificates on diamonds are critical for jewelry investments."
  }
];

export default function StoryConsultantModal({ onClose }: StoryConsultantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Greetings, esteemed guest. 

Welcome to the digital atelier of RUPKOTHA. I am your Royal Styling Consultant & Heirloom Storyteller. 

Every jewel in our showroom has a soul, carrying the sacred art of Sonarpur, West Bengal. I am here to help you select, style, or discover the majestic history behind our certified gold and brilliant diamonds. 

How may I elevate your jewelry journey today?`
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { sender: "user", text } as Message];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, type: "consult" }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "My sincerest apologies. My connection to the creative spirits is momentarily interrupted. Please try again shortly."
          }
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "My sincerest apologies. An error occurred. Please verify your internet connection and try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-story-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center items-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-3xl h-[85vh] min-h-[500px] max-h-[700px] bg-[#FAF9F5] shadow-2xl rounded-3xl overflow-hidden flex flex-col border border-stone-200/50"
      >
        {/* Header */}
        <div className="bg-[#1C1917] text-[#E5D5B8] p-6 flex justify-between items-center border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#C49F5D] text-stone-950 p-2 rounded-full shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg tracking-wider text-white">Rupkotha Royal Consultant</h2>
              <p className="text-[10px] uppercase tracking-widest text-[#C49F5D] font-mono mt-0.5">Every Jewel Tells a Story</p>
            </div>
          </div>
          <button
            id="ai-consultant-close"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full transition-colors border border-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messaging Board / Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar">
          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4.5 text-xs sm:text-sm shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1C1917] text-[#E5D5B8] rounded-tr-none"
                      : "bg-white text-stone-800 border border-stone-200/40 rounded-tl-none whitespace-pre-wrap font-light"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200/40 rounded-2xl rounded-tl-none p-4.5 text-stone-400 flex items-center gap-2.5 shadow-sm text-xs">
                  <span className="animate-bounce inline-block w-2 h-2 bg-[#C49F5D] rounded-full" />
                  <span className="animate-bounce inline-block w-2 h-2 bg-[#C49F5D] rounded-full [animation-delay:0.2s]" />
                  <span className="animate-bounce inline-block w-2 h-2 bg-[#C49F5D] rounded-full [animation-delay:0.4s]" />
                  <span className="font-mono text-[10px] tracking-wider text-stone-400 uppercase">Consulting royal annals...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Styling presets helper (only shown if simple start) */}
          {messages.length === 1 && (
            <div className="pt-4 border-t border-stone-200/50">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold mb-3.5 font-mono">Suggested Inquiries</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    id={`preset-btn-${idx}`}
                    onClick={() => sendMessage(preset.prompt)}
                    className="flex items-center gap-3 bg-white hover:bg-[#FAF9F5] border border-stone-200/60 p-3 text-left rounded-xl hover:border-[#C49F5D] transition-all duration-300"
                  >
                    <div className="bg-stone-50 p-2 rounded-lg shrink-0">
                      {preset.icon}
                    </div>
                    <span className="text-xs font-semibold text-stone-700 tracking-wide leading-tight">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Footer */}
        <div className="p-4 border-t border-stone-200/60 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask our royal consultant (e.g. recommend a wedding choker)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#FAF9F5] border border-stone-200 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-[#C49F5D] text-stone-800"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-[#1C1917] hover:bg-[#C49F5D] text-[#E5D5B8] hover:text-stone-950 p-4 rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
