"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const EMOJIS = ["💖", "🌹", "✨", "💕", "💗", "🦋", "💫", "🌸", "💜", "🥰", "💝", "🔥"];

export function EmojiRain({ active, duration = 4000 }: { active: boolean; duration?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const burst = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: Date.now() + i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * 100,
        size: 14 + Math.random() * 18,
        duration: 2 + Math.random() * 2.5,
        delay: Math.random() * 1.5,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), duration);
  }, [duration]);

  useEffect(() => {
    if (active) burst();
  }, [active, burst]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -60, x: `${p.x}vw`, opacity: 1, scale: 0.3, rotate: 0 }}
            animate={{
              y: "110vh",
              opacity: [1, 1, 0.7, 0],
              scale: [0.3, 1, 0.8, 0.5],
              rotate: Math.random() > 0.5 ? 360 : -360,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeIn",
            }}
            style={{
              position: "fixed",
              fontSize: p.size,
              userSelect: "none",
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
