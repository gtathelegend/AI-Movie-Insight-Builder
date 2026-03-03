"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="space-y-3">
          <div className="h-5 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />
          <div className="h-4 w-10/12 animate-pulse rounded-lg bg-slate-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-3 w-4/5 animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-3 w-4/5 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>

        <p className="text-center text-base text-slate-600">Analyzing audience sentiment with AI...</p>
      </div>
    </motion.div>
  );
}
