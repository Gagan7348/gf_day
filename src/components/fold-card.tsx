"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface FoldCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function FoldCard({ children, className = "", index = 0 }: FoldCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.7"],
  });

  // Simple reveal — no blur, no 3D rotateX (expensive on mobile)
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0.1, 0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 0.6], [30, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.96, 1]);

  return (
    <div ref={ref}>
      <motion.div
        style={{ opacity, y, scale }}
        transition={{ delay: index * 0.03 }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* A section that reveals as a whole — lightweight */
export function FoldSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.45"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [0.15, 0.65, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [20, 0]);

  return (
    <div ref={ref}>
      <motion.div
        style={{ opacity, y }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
