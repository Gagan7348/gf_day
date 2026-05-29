"use client";

import { useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────
interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  timer: number;
  delay: number;
  tailLength: number;
  life: number;
  maxLife: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: [number, number, number];
  opacity: number;
  baseOpacity: number;
  driftX: number;
  driftY: number;
  pulseSpeed: number;
  pulseOffset: number;
}

// ── Helpers ────────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createStar(w: number, h: number): Star {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: rand(0.5, 2),
    baseOpacity: rand(0.3, 0.9),
    opacity: 0,
    pulseSpeed: rand(0.3, 1.2),
    pulseOffset: Math.random() * Math.PI * 2,
  };
}

function createShootingStar(w: number, h: number, immediate = false): ShootingStar {
  const angle = rand(Math.PI * 0.1, Math.PI * 0.4); // angled downward-right
  return {
    x: rand(-w * 0.2, w * 0.6),
    y: rand(-h * 0.1, h * 0.3),
    length: rand(80, 160),
    speed: rand(6, 12),
    angle,
    opacity: 0,
    active: false,
    timer: 0,
    delay: immediate ? rand(0.5, 2) : rand(4, 8),
    tailLength: rand(60, 120),
    life: 0,
    maxLife: rand(1.2, 2.5),
  };
}

const NEBULA_COLORS: [number, number, number][] = [
  [99, 29, 118],   // orchid  #631D76
  [255, 170, 234], // plum    #FFAAEA
  [251, 77, 61],   // tomato  #FB4D3D
  [152, 193, 217], // powder  #98C1D9
];

function createNebula(w: number, h: number, index: number): Nebula {
  return {
    x: rand(w * 0.1, w * 0.9),
    y: rand(h * 0.1, h * 0.9),
    radius: rand(150, 350),
    color: NEBULA_COLORS[index % NEBULA_COLORS.length],
    baseOpacity: rand(0.03, 0.06),
    opacity: 0,
    driftX: rand(-0.15, 0.15),
    driftY: rand(-0.1, 0.1),
    pulseSpeed: rand(0.1, 0.3),
    pulseOffset: Math.random() * Math.PI * 2,
  };
}

// ── Component ──────────────────────────────────────────────────────
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);

  // Initialise scene entities
  const initScene = useCallback((w: number, h: number) => {
    starsRef.current = Array.from({ length: 120 }, () => createStar(w, h));
    shootingRef.current = [
      createShootingStar(w, h, true),
      createShootingStar(w, h, false),
      createShootingStar(w, h, false),
      createShootingStar(w, h, false),
    ];
    nebulaeRef.current = Array.from({ length: 4 }, (_, i) => createNebula(w, h, i));
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    dprRef.current = dpr;
    sizeRef.current = { w, h };
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Setup
    handleResize();
    const { w, h } = sizeRef.current;
    initScene(w, h);

    let lastTime = performance.now();

    // ── Render loop ──────────────────────────────────────────────
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1); // delta in seconds, capped
      lastTime = now;

      const { w, h } = sizeRef.current;
      const dpr = dprRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // ── Nebulae ────────────────────────────────────────────────
      for (const n of nebulaeRef.current) {
        // Drift
        n.x += n.driftX * dt * 60;
        n.y += n.driftY * dt * 60;

        // Wrap
        if (n.x < -n.radius) n.x = w + n.radius;
        if (n.x > w + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = h + n.radius;
        if (n.y > h + n.radius) n.y = -n.radius;

        // Pulse
        const pulse = Math.sin(now * 0.001 * n.pulseSpeed + n.pulseOffset) * 0.5 + 0.5;
        n.opacity = n.baseOpacity * (0.7 + pulse * 0.3);

        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        gradient.addColorStop(
          0,
          `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.opacity})`
        );
        gradient.addColorStop(1, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Stars ──────────────────────────────────────────────────
      for (const s of starsRef.current) {
        const pulse =
          Math.sin(now * 0.001 * s.pulseSpeed + s.pulseOffset) * 0.5 + 0.5;
        s.opacity = s.baseOpacity * (0.4 + pulse * 0.6);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();

        // Glow for larger stars
        if (s.radius > 1.3) {
          const glow = ctx.createRadialGradient(
            s.x, s.y, 0,
            s.x, s.y, s.radius * 3
          );
          glow.addColorStop(0, `rgba(255,255,255,${s.opacity * 0.3})`);
          glow.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Shooting Stars ─────────────────────────────────────────
      for (const ss of shootingRef.current) {
        if (!ss.active) {
          ss.timer += dt;
          if (ss.timer >= ss.delay) {
            ss.active = true;
            ss.life = 0;
            ss.opacity = 1;
            // Reset position
            ss.x = rand(-w * 0.2, w * 0.6);
            ss.y = rand(-h * 0.1, h * 0.3);
            ss.angle = rand(Math.PI * 0.1, Math.PI * 0.4);
          }
          continue;
        }

        ss.life += dt;
        const progress = ss.life / ss.maxLife;

        // Fade in quickly, fade out in last 30%
        if (progress < 0.1) {
          ss.opacity = progress / 0.1;
        } else if (progress > 0.7) {
          ss.opacity = 1 - (progress - 0.7) / 0.3;
        } else {
          ss.opacity = 1;
        }

        // Move
        const vx = Math.cos(ss.angle) * ss.speed * dt * 60;
        const vy = Math.sin(ss.angle) * ss.speed * dt * 60;
        ss.x += vx;
        ss.y += vy;

        // Draw tail
        const tailX = ss.x - Math.cos(ss.angle) * ss.tailLength;
        const tailY = ss.y - Math.sin(ss.angle) * ss.tailLength;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(255,250,240,${ss.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(255,255,255,${ss.opacity * 0.9})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Bright head glow
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 4);
        headGlow.addColorStop(0, `rgba(255,255,255,${ss.opacity * 0.8})`);
        headGlow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Reset when done
        if (ss.life >= ss.maxLife) {
          ss.active = false;
          ss.timer = 0;
          ss.delay = rand(4, 8);
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    // Resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, initScene]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
