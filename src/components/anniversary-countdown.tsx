"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Target Date ─── */
const ANNIVERSARY_DATE = new Date("2027-01-21T00:00:00");
const ANNIVERSARY_LABEL = "1st";

/* ─── Types ─── */
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* ─── Helpers ─── */
function calcTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const target = ANNIVERSARY_DATE.getTime();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function padTwo(n: number): string {
  return n.toString().padStart(2, "0");
}

/* ─── Single Digit Card ─── */
function FlipDigit({ digit, index }: { digit: string; index: number }) {
  return (
    <div className="relative" style={{ perspective: "500px" }}>
      {/* Glassmorphic card */}
      <div
        className="relative flex h-[52px] w-[34px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] shadow-lg shadow-orchid/5 backdrop-blur-md xs:h-[66px] xs:w-[44px] sm:h-[75px] sm:w-[50px] md:h-[95px] md:w-[64px]"
      >
        {/* Subtle gradient shimmer overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(255,170,234,0.08) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: `shimmer 3s ease-in-out ${index * 0.3}s infinite`,
          }}
        />

        {/* Top half divider line */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-white/[0.06]" />

        {/* Animated digit */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={digit}
            initial={{ y: 20, opacity: 0, rotateX: -60 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -20, opacity: 0, rotateX: 60 }}
            transition={{
              duration: 0.45,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative z-10 font-display text-xl font-bold tracking-tight text-plum drop-shadow-[0_0_12px_rgba(255,170,234,0.3)] xs:text-2xl sm:text-3xl md:text-4xl"
          >
            {digit}
          </motion.span>
        </AnimatePresence>

        {/* Inner glow at the bottom */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-orchid/10 blur-xl"
        />
      </div>
    </div>
  );
}

/* ─── Digit Pair (two cards + label) ─── */
function DigitGroup({
  value,
  label,
  startIndex,
}: {
  value: number;
  label: string;
  startIndex: number;
}) {
  const digits = padTwo(value).split("");

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className="flex gap-1 sm:gap-1 md:gap-1.5">
        {digits.map((d, i) => (
          <FlipDigit key={`${label}-${i}`} digit={d} index={startIndex + i} />
        ))}
      </div>
      <span
        className="text-[9px] font-medium uppercase tracking-[0.1em] text-plum/50 xs:tracking-[0.15em] sm:text-xs sm:tracking-[0.2em]"
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Colon Separator ─── */
function ColonSeparator() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 pb-4 sm:gap-3 sm:pb-5">
      <motion.div
        className="h-1 w-1 rounded-full bg-plum/40 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-1 w-1 rounded-full bg-plum/40 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
    </div>
  );
}

/* ─── Main Component ─── */
export function AnniversaryCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);

    // Inject shimmer keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shimmer {
        0%, 100% { background-position: 200% 200%; }
        50% { background-position: 0% 0%; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(timer);
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full px-4 py-12 sm:py-16">
      {/* Outer card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm xs:p-6 sm:p-8 md:p-8"
      >
        {/* Background ambient glow */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-orchid/10 blur-[100px]"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-plum/[0.08] blur-[100px]"
        />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8 text-center sm:mb-10"
        >
          <h2
            className="font-heading text-lg tracking-wide text-plum/80 sm:text-xl md:text-2xl"
          >
            Counting down to our {ANNIVERSARY_LABEL} Anniversary 💍
          </h2>
        </motion.div>

        {/* Countdown digits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-3.5"
        >
          <DigitGroup value={timeLeft.days} label="Days" startIndex={0} />
          <ColonSeparator />
          <DigitGroup value={timeLeft.hours} label="Hours" startIndex={2} />
          <ColonSeparator />
          <DigitGroup value={timeLeft.minutes} label="Mins" startIndex={4} />
          <ColonSeparator />
          <DigitGroup value={timeLeft.seconds} label="Secs" startIndex={6} />
        </motion.div>

        {/* Date subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative mt-8 text-center font-signature text-xl text-saffron/70 drop-shadow-[0_0_8px_rgba(234,196,53,0.15)] sm:mt-10 sm:text-2xl md:text-3xl"
        >
          January 21, 2027
        </motion.p>

        {/* Decorative sparkle dots */}
        <div
          className="pointer-events-none absolute left-6 top-6 h-1 w-1 rounded-full bg-saffron/30"
          style={{ animation: "twinkle 3s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute bottom-8 right-10 h-1.5 w-1.5 rounded-full bg-plum/25"
          style={{ animation: "twinkle 2.5s ease-in-out 1s infinite" }}
        />
        <div
          className="pointer-events-none absolute right-6 top-10 h-1 w-1 rounded-full bg-plum/20"
          style={{ animation: "twinkle 4s ease-in-out 0.5s infinite" }}
        />
      </motion.div>

    </section>
  );
}
