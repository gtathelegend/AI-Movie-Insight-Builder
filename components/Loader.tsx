"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-zinc-200">
      <motion.div
        className="h-5 w-5 rounded-full border-2 border-sky-400 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      <span className="text-sm">Analyzing audience sentiment...</span>
    </div>
  );
}
