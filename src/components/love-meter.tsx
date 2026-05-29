"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, RotateCcw, Stars } from "lucide-react";

/* ─── Floating Heart Particle (loading animation) ─── */
function FloatingHeart({ delay, x }: { delay: number; x: number }) {
  const hearts = ["❤", "♥", "💕", "💗", "💖", "💘"];
  const symbol = hearts[Math.floor(Math.random() * hearts.length)];
  const size = 14 + Math.random() * 18;

  return (
    <motion.span
      className="pointer-events-none absolute bottom-0"
      style={{ left: `${x}%`, fontSize: size }}
      initial={{ y: 0, opacity: 1, scale: 0 }}
      animate={{
        y: -320,
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.6],
        x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60],
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: "easeOut",
      }}
    >
      {symbol}
    </motion.span>
  );
}

/* ─── Circular Progress Ring ─── */
function ProgressRing({ value, isVisible }: { value: number; isVisible: boolean }) {
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gradientId = "love-gradient";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={
        isVisible
          ? { scale: 1, opacity: 1 }
          : { scale: 0, opacity: 0 }
      }
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
    >
      <motion.div
        animate={isVisible ? { scale: [1, 1.03, 1] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2,
        }}
        className="relative"
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-[0_0_30px_rgba(255,170,234,0.4)]"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFAAEA" />
              <stop offset="50%" stopColor="#FB4D3D" />
              <stop offset="100%" stopColor="#EAC435" />
            </linearGradient>
            {/* glow filter */}
            <filter id="ring-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            filter="url(#ring-glow)"
            style={{
              transformOrigin: "center",
              transform: "rotate(-90deg)",
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={
              isVisible
                ? { strokeDashoffset: circumference * (1 - value / 100) }
                : { strokeDashoffset: circumference }
            }
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="bg-gradient-to-r from-plum via-tomato to-saffron bg-clip-text font-display text-5xl font-bold tracking-tight text-transparent"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
          >
            99.99%
          </motion.span>
          <motion.span
            className="mt-1 text-xs tracking-widest text-plum/60 uppercase"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            compatible
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export function LoveMeter() {
  const [name1, setName1] = useState("Gagan");
  const [name2, setName2] = useState("Avani");
  const [phase, setPhase] = useState<"idle" | "loading" | "result">("idle");
  const [hearts, setHearts] = useState<{ id: number; delay: number; x: number }[]>([]);

  const calculate = useCallback(() => {
    setPhase("loading");

    // Generate floating hearts for the loading phase
    const newHearts = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2.2,
      x: 5 + Math.random() * 90,
    }));
    setHearts(newHearts);

    setTimeout(() => {
      setPhase("result");
    }, 3000);
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setHearts([]);
  }, []);

  return (
    <div className="flex w-full items-center justify-center px-4 py-8">
      <motion.div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          boxShadow:
            "0 0 60px rgba(99, 29, 118, 0.15), 0 0 120px rgba(255, 170, 234, 0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Decorative corner sparkles */}
        <motion.div
          className="absolute -right-2 -top-2 text-saffron/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={28} />
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -left-2 text-plum/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Stars size={24} />
        </motion.div>

        {/* Title */}
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="flex items-center justify-center gap-2 font-display text-2xl text-plum">
            <Heart className="h-6 w-6 fill-tomato text-tomato" />
            Love Meter
            <Heart className="h-6 w-6 fill-tomato text-tomato" />
          </h2>
          <p className="mt-1 text-sm text-white/30">How compatible are you two?</p>
        </motion.div>

        {/* Name Inputs */}
        <AnimatePresence mode="wait">
          {phase !== "result" && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3">
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum/50" />
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="First name..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 font-sans text-sm text-white/90 outline-none transition-all placeholder:text-white/20 focus:border-plum/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-plum/20"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <motion.span
                    className="text-xl"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💘
                  </motion.span>
                </div>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum/50" />
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Second name..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 font-sans text-sm text-white/90 outline-none transition-all placeholder:text-white/20 focus:border-plum/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-plum/20"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <motion.button
                onClick={calculate}
                disabled={phase === "loading" || !name1.trim() || !name2.trim()}
                className="group relative mt-4 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-orchid via-tomato to-saffron p-[2px] shadow-lg shadow-orchid/20 transition-shadow hover:shadow-orchid/40 disabled:cursor-not-allowed disabled:opacity-40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="relative flex items-center justify-center gap-2 rounded-[14px] bg-[#0a0812] px-6 py-3.5 font-display text-lg text-white transition-colors group-hover:bg-[#0e0c16]">
                  {phase === "loading" ? (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Heart className="h-5 w-5 fill-plum text-plum" />
                      </motion.div>
                      <span>Calculating...</span>
                    </motion.div>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 fill-tomato text-tomato" />
                      <span>Calculate Love ❤️</span>
                    </>
                  )}
                </div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Hearts Animation */}
        <AnimatePresence>
          {phase === "loading" && (
            <motion.div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {hearts.map((h) => (
                <FloatingHeart key={h.id} delay={h.delay} x={h.x} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {phase === "result" && (
            <motion.div
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Names display */}
              <motion.div
                className="flex items-center gap-3 text-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="font-display text-plum">{name1}</span>
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
                >
                  💕
                </motion.span>
                <span className="font-display text-saffron">{name2}</span>
              </motion.div>

              {/* Progress Ring */}
              <ProgressRing value={99.99} isVisible={phase === "result"} />

              {/* Fun message */}
              <motion.p
                className="mt-1 text-center font-signature text-xl text-white/70"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.6 }}
              >
                Written in the stars since BEEE Lab! ⭐
              </motion.p>

              {/* Sparkle decorations around result */}
              <motion.div
                className="absolute left-6 top-1/2 text-saffron/40"
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 15, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={16} />
              </motion.div>
              <motion.div
                className="absolute right-6 top-1/3 text-plum/40"
                animate={{
                  opacity: [0.3, 0.9, 0.3],
                  scale: [0.9, 1.3, 0.9],
                  rotate: [0, -15, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles size={14} />
              </motion.div>

              {/* Calculate Again button */}
              <motion.button
                onClick={reset}
                className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 font-sans text-sm text-white/60 transition-all hover:border-plum/30 hover:bg-white/[0.08] hover:text-white/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="h-4 w-4" />
                Calculate Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
