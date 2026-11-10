import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Sparkles, 
  Film, 
  Heart, 
  Share2, 
  ExternalLink,
  X,
  ShoppingBag
} from "lucide-react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface ReelItem {
  id: string;
  videoId: string;
  title: string;
  collection: string;
  description: string;
  caratOrPurity: string;
  tag: string;
  likes: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: "reel-1",
    videoId: "3vd0AHgf5OA",
    title: "Handcrafted Kundan Bridal Grandeur",
    collection: "Royal Rajputana Heritage",
    description: "Intricate floral motif choker hand-set with uncut polki and emerald beads in 22K yellow gold.",
    caratOrPurity: "22K BIS 916 Gold",
    tag: "Bridal Couture",
    likes: "24.8K"
  },
  {
    id: "reel-2",
    videoId: "9JsTj1Ymi_I",
    title: "Temple Antique Artisanal Choker",
    collection: "Swarnakar Masterpiece",
    description: "Authentic Bengal nakshi work sculpted by generational master artisans with sacred temple motifs.",
    caratOrPurity: "Pure 22K Gold Filigree",
    tag: "Heritage Craft",
    likes: "18.3K"
  },
  {
    id: "reel-3",
    videoId: "z6CESZd3IXw",
    title: "Luminous Solitaire Diamond Brilliance",
    collection: "Elite Solitaire Suite",
    description: "Natural certified diamond solitaire capturing radiant scintillation from every angle.",
    caratOrPurity: "GIA Certified VVS1 / E",
    tag: "Fine Solitaire",
    likes: "31.2K"
  },
  {
    id: "reel-4",
    videoId: "YetvhUMrwr4",
    title: "Royal Meenakari Bridal Bangles",
    collection: "Noor-e-Kolkata",
    description: "Deep ruby enamelling fused with fine gold openwork and pave setting for grand celebrations.",
    caratOrPurity: "22K Stamped Gold",
    tag: "Festive Collection",
    likes: "15.9K"
  }
];

export default function ReelsSection() {
  const [activeMutedMap, setActiveMutedMap] = useState<Record<string, boolean>>({
    "reel-1": true,
    "reel-2": true,
    "reel-3": true,
    "reel-4": true,
  });
  const [playingMap, setPlayingMap] = useState<Record<string, boolean>>({
    "reel-1": true,
    "reel-2": true,
    "reel-3": true,
    "reel-4": true,
  });
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [selectedReelModal, setSelectedReelModal] = useState<ReelItem | null>(null);
  const [modalMuted, setModalMuted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});
  const playersRef = useRef<Record<string, any>>({});
  const modalIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Initialize YouTube Iframe API for seamless continuous loop and audio controls
  useEffect(() => {
    const loadYT = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    loadYT();

    const handleReady = () => {
      REELS_DATA.forEach((reel) => {
        const frameId = `yt-iframe-${reel.id}`;
        if (window.YT && window.YT.Player && document.getElementById(frameId)) {
          try {
            playersRef.current[reel.id] = new window.YT.Player(frameId, {
              events: {
                onReady: (event: any) => {
                  event.target.mute();
                  event.target.playVideo();
                },
                onStateChange: (event: any) => {
                  // Continuous loop when ended
                  if (event.data === window.YT.PlayerState.ENDED) {
                    event.target.playVideo();
                  }
                }
              }
            });
          } catch {
            // Fallback to postMessage
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      handleReady();
    } else {
      window.onYouTubeIframeAPIReady = handleReady;
    }

    return () => {
      Object.values(playersRef.current).forEach((player: any) => {
        try {
          if (player && typeof player.destroy === "function") {
            player.destroy();
          }
        } catch {
          // ignore
        }
      });
    };
  }, []);

  // PostMessage fallback command sender
  const sendIframeCommand = (reelId: string, command: string, args: any[] = []) => {
    // 1. Try Player API
    const player = playersRef.current[reelId];
    if (player && typeof player[command] === "function") {
      try {
        player[command](...args);
        return;
      } catch {
        // Fall back to postMessage
      }
    }

    // 2. PostMessage to iframe directly
    const iframe = iframeRefs.current[reelId];
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: command,
          args: args
        }),
        "*"
      );
    }
  };

  const toggleMute = (reelId: string) => {
    const currentlyMuted = activeMutedMap[reelId] ?? true;
    const nextMuted = !currentlyMuted;

    if (!nextMuted) {
      // If unmuting this reel, mute all other reels so audio doesn't clash
      REELS_DATA.forEach((item) => {
        if (item.id !== reelId) {
          sendIframeCommand(item.id, "mute");
        }
      });
      setActiveMutedMap({
        "reel-1": true,
        "reel-2": true,
        "reel-3": true,
        "reel-4": true,
        [reelId]: false
      });
      sendIframeCommand(reelId, "unMute");
    } else {
      // Mute this reel
      sendIframeCommand(reelId, "mute");
      setActiveMutedMap((prev) => ({
        ...prev,
        [reelId]: true
      }));
    }
  };

  const togglePlayPause = (reelId: string) => {
    const isPlaying = playingMap[reelId] ?? true;
    if (isPlaying) {
      sendIframeCommand(reelId, "pauseVideo");
      setPlayingMap((prev) => ({ ...prev, [reelId]: false }));
    } else {
      sendIframeCommand(reelId, "playVideo");
      setPlayingMap((prev) => ({ ...prev, [reelId]: true }));
    }
  };

  const toggleLike = (reelId: string) => {
    setLikedMap((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  const handleShare = (reel: ReelItem) => {
    const url = `https://www.youtube.com/shorts/${reel.videoId}`;
    navigator.clipboard?.writeText(url);
    setCopiedId(reel.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const unmuteAllOrMuteAll = (shouldMute: boolean) => {
    REELS_DATA.forEach((reel) => {
      sendIframeCommand(reel.id, shouldMute ? "mute" : "unMute");
    });
    setActiveMutedMap({
      "reel-1": shouldMute,
      "reel-2": shouldMute,
      "reel-3": shouldMute,
      "reel-4": shouldMute,
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#181513] text-stone-100 relative overflow-hidden border-b border-[#C49F5D]/20">
      {/* Decorative luxury background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C49F5D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#901A2E]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C49F5D]/15 border border-[#C49F5D]/30 rounded-full text-[#E5D5B8] text-[11px] font-mono uppercase tracking-[0.25em] mb-3">
              <Film className="w-3.5 h-3.5 text-[#C49F5D] animate-pulse" />
              <span>Artisan In Motion • Live Curations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white leading-tight">
              Curated Jewels in Motion
            </h2>
            <p className="mt-2 text-stone-400 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
              Experience the 360° light play, artisanal brilliance, and real-time movement of our finest handcrafted bridal & solitaire ornaments.
            </p>
          </div>

          {/* Quick Audio Controls for whole row */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-stone-400 tracking-wider uppercase hidden sm:inline">
              Audio Controls:
            </span>
            <button
              onClick={() => unmuteAllOrMuteAll(true)}
              className="px-3.5 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-stone-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
              title="Mute all 4 reels"
            >
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              <span>Mute All</span>
            </button>
            <button
              onClick={() => toggleMute("reel-1")}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all flex items-center gap-1.5 ${
                !activeMutedMap["reel-1"]
                  ? "bg-[#C49F5D] text-stone-950 border-[#C49F5D] font-medium"
                  : "bg-stone-800/80 hover:bg-stone-700/80 border-stone-700 text-stone-300 hover:text-white"
              }`}
              title="Play sound for featured reel"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Sound On (Reel 1)</span>
            </button>
          </div>
        </div>

        {/* 4 REELS GRID (Continuous loop, mute/unmute buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REELS_DATA.map((reel, index) => {
            const isMuted = activeMutedMap[reel.id] ?? true;
            const isPlaying = playingMap[reel.id] ?? true;
            const isLiked = likedMap[reel.id] ?? false;

            return (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-stone-900/90 rounded-3xl overflow-hidden border border-stone-800/90 hover:border-[#C49F5D]/70 shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* 9:16 Video Container */}
                <div className="relative w-full aspect-[9/16] bg-black overflow-hidden select-none">
                  {/* YouTube IFrame Embed */}
                  <iframe
                    id={`yt-iframe-${reel.id}`}
                    ref={(el) => {
                      iframeRefs.current[reel.id] = el;
                    }}
                    src={`https://www.youtube-nocookie.com/embed/${reel.videoId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${reel.videoId}&controls=0&playsinline=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1&origin=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.origin : ""
                    )}`}
                    title={reel.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full object-cover scale-[1.08] pointer-events-none"
                  />

                  {/* Top Overlay Badge & Header */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-200 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Looping</span>
                    </span>

                    <button
                      onClick={() => setSelectedReelModal(reel)}
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/90 transition-all"
                      title="Expand Reel"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Side Action Column (Instagram Reels / YouTube Shorts style) */}
                  <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 z-20 pointer-events-auto">
                    {/* Audio Mute/Unmute Toggle */}
                    <button
                      onClick={() => toggleMute(reel.id)}
                      className={`relative p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg ${
                        isMuted
                          ? "bg-black/60 border-white/20 text-white hover:bg-black/80 hover:scale-105"
                          : "bg-[#C49F5D] border-amber-300 text-stone-950 font-bold scale-110 shadow-amber-500/30"
                      }`}
                      title={isMuted ? "Click to unmute audio" : "Click to mute audio"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-300" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-stone-950 animate-bounce" />
                      )}
                      
                      {/* Pulse ring when unmuted */}
                      {!isMuted && (
                        <span className="absolute -inset-1 rounded-full border border-amber-400 animate-ping opacity-75" />
                      )}
                    </button>

                    {/* Play / Pause Toggle */}
                    <button
                      onClick={() => togglePlayPause(reel.id)}
                      className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 hover:scale-105 transition-all"
                      title={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-stone-200" />
                      ) : (
                        <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                      )}
                    </button>

                    {/* Like button */}
                    <button
                      onClick={() => toggleLike(reel.id)}
                      className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all flex flex-col items-center gap-0.5"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? "text-rose-500 fill-rose-500" : "text-stone-300"
                        }`}
                      />
                      <span className="text-[9px] font-mono text-stone-300">
                        {isLiked ? "Saved" : reel.likes}
                      </span>
                    </button>

                    {/* Share button */}
                    <button
                      onClick={() => handleShare(reel)}
                      className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all relative"
                      title="Copy short link"
                    >
                      <Share2 className="w-4 h-4 text-stone-300" />
                      {copiedId === reel.id && (
                        <span className="absolute -left-16 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-black text-amber-300 text-[10px] rounded whitespace-nowrap border border-amber-400/40 font-mono">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Bottom Gradient Scrim & Caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent pt-16 pb-3 px-4 z-10 pointer-events-auto">
                    <span className="inline-block text-[10px] font-mono text-[#E5D5B8] uppercase tracking-widest mb-1 font-semibold">
                      {reel.collection}
                    </span>
                    <h3 className="font-serif text-sm font-medium text-white line-clamp-1 leading-snug">
                      {reel.title}
                    </h3>

                    {/* Mute status bar */}
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                      <span className="text-amber-300/90 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {reel.caratOrPurity}
                      </span>
                      <button
                        onClick={() => toggleMute(reel.id)}
                        className={`text-[10px] underline hover:text-white transition-colors ${
                          isMuted ? "text-rose-300/90 font-medium" : "text-emerald-400 font-semibold"
                        }`}
                      >
                        {isMuted ? "🔇 Tap to unmute" : "🔊 Audio Playing"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-4 bg-stone-900/95 flex-1 flex flex-col justify-between border-t border-stone-800">
                  <p className="text-xs text-stone-400 font-light line-clamp-2 leading-relaxed">
                    {reel.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 bg-stone-800 rounded text-stone-300">
                      {reel.tag}
                    </span>
                    <a
                      href={`https://www.youtube.com/shorts/${reel.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-serif text-[#C49F5D] hover:text-amber-200 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Open Short</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Boutique Guarantee Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-stone-900/80 border border-stone-800 text-stone-300 text-xs font-light">
            <RotateCcw className="w-3.5 h-3.5 text-[#C49F5D]" />
            <span>
              All video clips showcase authentic Rupkotha atelier studio pieces. Tap any reel icon to toggle audio or expand high-definition view.
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Reel Modal */}
      <AnimatePresence>
        {selectedReelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedReelModal(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-stone-950 rounded-3xl overflow-hidden border border-[#C49F5D]/40 shadow-2xl"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedReelModal(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 text-white hover:bg-stone-800 transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* YouTube video full frame */}
              <div className="relative w-full aspect-[9/16] bg-black">
                <iframe
                  ref={modalIframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${selectedReelModal.videoId}?autoplay=1&mute=${
                    modalMuted ? 1 : 0
                  }&loop=1&playlist=${selectedReelModal.videoId}&controls=1&playsinline=1`}
                  title={selectedReelModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />

                {/* Audio quick toggle inside modal */}
                <button
                  onClick={() => setModalMuted(!modalMuted)}
                  className="absolute bottom-20 right-4 z-20 p-3 rounded-full bg-black/80 border border-white/20 text-white hover:bg-black transition-all shadow-xl"
                  title={modalMuted ? "Unmute" : "Mute"}
                >
                  {modalMuted ? (
                    <VolumeX className="w-5 h-5 text-rose-300" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-amber-300" />
                  )}
                </button>
              </div>

              {/* Modal Bottom Details */}
              <div className="p-5 bg-stone-900 border-t border-stone-800 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#C49F5D] tracking-widest">
                    {selectedReelModal.collection}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {selectedReelModal.caratOrPurity}
                  </span>
                </div>
                <h4 className="font-serif text-lg text-white font-medium">
                  {selectedReelModal.title}
                </h4>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {selectedReelModal.description}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={`https://www.youtube.com/shorts/${selectedReelModal.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#C49F5D] hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    Watch directly on YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => {
                      setSelectedReelModal(null);
                    }}
                    className="px-4 py-2 bg-[#C49F5D] hover:bg-[#b08b49] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Inquire Piece</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
