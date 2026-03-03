"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2.5 w-2.5 rounded-full bg-blue-500"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: dot * 0.15, ease: "easeInOut" }}
            />
          ))}
        </div>
        <p className="text-sm text-slate-600">Analyzing audience sentiment...</p>
      </div>
    </motion.div>
  );
}
