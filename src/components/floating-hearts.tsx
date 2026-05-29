"use client";

import { useEffect, useState } from "react";

/* ─── Types ─── */
type Particle = {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  symbol: string;
  color: string;
};

type Twinkle = {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
};

const SYMBOLS = ["♥", "✦", "♡", "❋", "✧", "⋆", "❤", "✿", "❥"];
const COLORS = [
  "text-plum/15",
  "text-orchid/12",
  "text-powder/12",
  "text-saffron/8",
  "text-tomato/8",
  "text-plum/20",
  "text-orchid/15",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 2 + Math.random() * 96,
    size: Math.random() * 12 + 8,
    delay: Math.random() * 12,
    duration: Math.random() * 12 + 14,
    symbol: SYMBOLS[i % SYMBOLS.length],
    color: COLORS[i % COLORS.length],
  }));
}

function generateTwinkles(count: number): Twinkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 2 + Math.random() * 96,
    y: 2 + Math.random() * 96,
    delay: Math.random() * 6,
    duration: 2.5 + Math.random() * 2.5,
    size: Math.random() > 0.5 ? 4 : 3,
  }));
}

export function FloatingHearts() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [twinkles, setTwinkles] = useState<Twinkle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    // Fewer elements on mobile for smooth 60fps
    setParticles(generateParticles(mobile ? 8 : 16));
    setTwinkles(generateTwinkles(mobile ? 10 : 25));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Floating particles — pure CSS animation (compositor thread) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color}`}
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.symbol}
        </div>
      ))}

      {/* Twinkling stars — pure CSS */}
      {twinkles.map((t) => (
        <div
          key={`star-${t.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: t.size,
            height: t.size,
            boxShadow: "0 0 6px rgba(255,255,255,0.5)",
            animation: `twinkle ${t.duration}s ease-in-out ${t.delay}s infinite`,
          }}
        />
      ))}

      {/* Ambient orbs — CSS only, fewer on mobile */}
      <div
        className="absolute left-[10%] top-[10%] h-32 w-32 rounded-full bg-orchid/5 blur-[60px] sm:h-48 sm:w-48 sm:blur-[80px]"
        style={{ animation: "orbit-slow 35s linear infinite" }}
      />
      <div
        className="absolute right-[10%] top-[30%] h-28 w-28 rounded-full bg-plum/6 blur-[50px] sm:h-44 sm:w-44 sm:blur-[70px]"
        style={{ animation: "orbit-slow 30s linear infinite reverse" }}
      />
      {!isMobile && (
        <>
          <div
            className="absolute bottom-[15%] left-[20%] h-24 w-24 rounded-full bg-saffron/4 blur-[40px] sm:h-36 sm:w-36 sm:blur-[60px]"
            style={{ animation: "orbit-slow 28s linear infinite" }}
          />
          <div
            className="absolute bottom-[30%] right-[15%] h-20 w-20 rounded-full bg-powder/5 blur-[35px] sm:h-32 sm:w-32 sm:blur-[50px]"
            style={{ animation: "orbit-slow 32s linear infinite reverse" }}
          />
        </>
      )}

      {/* Aurora ribbons — CSS only */}
      <div
        className="absolute -left-[20%] top-[20%] h-px w-[140%] rotate-[15deg] bg-gradient-to-r from-transparent via-orchid/8 to-transparent"
        style={{ animation: "aurora-drift 20s ease-in-out infinite" }}
      />
      <div
        className="absolute -left-[10%] top-[50%] h-px w-[120%] -rotate-[8deg] bg-gradient-to-r from-transparent via-plum/6 to-transparent"
        style={{ animation: "aurora-drift 25s ease-in-out infinite reverse" }}
      />
      {!isMobile && (
        <div
          className="absolute -left-[5%] top-[75%] h-px w-[110%] rotate-[5deg] bg-gradient-to-r from-transparent via-powder/5 to-transparent"
          style={{ animation: "aurora-drift 18s ease-in-out infinite" }}
        />
      )}
    </div>
  );
}
