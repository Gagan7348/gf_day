"use client";

import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-orchid/40"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ transformOrigin: "left" }}
        />
        <motion.span
          className="text-lg text-plum/50"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ✦
        </motion.span>
        <motion.span
          className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-orchid/40"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ transformOrigin: "right" }}
        />
      </motion.div>
    </div>
  );
}
