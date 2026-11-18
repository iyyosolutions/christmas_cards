"use client";

import { motion } from "framer-motion";

const flakes = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 53) % 100}%`,
  delay: (index % 7) * 0.7,
  duration: 10 + (index % 5) * 2,
  size: 4 + (index % 4) * 2,
}));

export function Snowfall() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {flakes.map((flake) => (
        <motion.span
          key={flake.id}
          className="absolute top-0 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ left: flake.left, width: flake.size, height: flake.size }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: "100vh", opacity: [0, 0.85, 0.85, 0] }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
