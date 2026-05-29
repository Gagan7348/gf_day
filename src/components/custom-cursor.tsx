"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isClickable, setIsClickable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);


  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setVisible(true);
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      const p = { x: e.clientX, y: e.clientY };
      setPos(p);
      setTrail((t) => [...t.slice(-6), { ...p, id: Math.random() }]);
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      setIsClickable(
        !!(
          el?.closest("button") ||
          el?.closest("a") ||
          el?.closest('[role="button"]') ||
          el?.closest("input")
        )
      );
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none" style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Trailing heart particles */}
      <AnimatePresence>
        {trail.map((pt, i) => (
          <motion.div
            key={pt.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.1, y: -12 }}
            exit={{}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: pt.x,
              top: pt.y,
              transform: "translate(-50%, -50%)",
              fontSize: `${7 + i * 2}px`,
              color:
                i % 3 === 0
                  ? "rgba(147,51,234,0.9)"
                  : i % 3 === 1
                  ? "rgba(225,29,72,0.8)"
                  : "rgba(245,158,11,0.7)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            ♥
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Outer glow ring */}
      <motion.div
        animate={{
          scale: clicking ? 0.65 : isClickable ? 1.6 : 1,
          borderColor: isClickable
            ? "rgba(225,29,72,0.8)"
            : "rgba(147,51,234,0.7)",
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid rgba(147,51,234,0.7)",
          backgroundColor: "rgba(147,51,234,0.06)",
          backdropFilter: "blur(2px)",
          pointerEvents: "none",
          boxShadow: isClickable
            ? "0 0 14px rgba(225,29,72,0.5)"
            : "0 0 10px rgba(147,51,234,0.35)",
        }}
      />

      {/* Center dot */}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: clicking
            ? "rgba(245,158,11,1)"
            : isClickable
            ? "rgba(225,29,72,1)"
            : "rgba(147,51,234,0.9)",
          pointerEvents: "none",
          transition: "background-color 0.15s ease",
          boxShadow: "0 0 6px currentColor",
        }}
      />
    </div>
  );
}
