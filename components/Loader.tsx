"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Movie card skeleton */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[200px_1fr] lg:items-start">
            <div className="shimmer aspect-[2/3] w-full rounded-xl lg:w-[200px]" />
            <div className="space-y-4">
              <div className="shimmer h-6 w-3/4 rounded-lg" />
              <div className="flex gap-2">
                <div className="shimmer h-6 w-16 rounded-lg" />
                <div className="shimmer h-6 w-16 rounded-lg" />
                <div className="shimmer h-6 w-20 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="shimmer h-4 w-full rounded-lg" />
                <div className="shimmer h-4 w-11/12 rounded-lg" />
                <div className="shimmer h-4 w-4/5 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="shimmer h-3 w-12 rounded-lg" />
                <div className="flex flex-wrap gap-1.5">
                  <div className="shimmer h-6 w-24 rounded-lg" />
                  <div className="shimmer h-6 w-20 rounded-lg" />
                  <div className="shimmer h-6 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment card skeleton */}
        <div className="space-y-6 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div className="shimmer h-5 w-40 rounded-lg" />
            <div className="shimmer h-5 w-20 rounded-lg" />
          </div>
          <div className="space-y-2 border-l-2 border-zinc-100 pl-4">
            <div className="shimmer h-3 w-16 rounded-lg" />
            <div className="shimmer h-4 w-full rounded-lg" />
            <div className="shimmer h-4 w-10/12 rounded-lg" />
            <div className="shimmer h-4 w-3/4 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="shimmer h-3 w-20 rounded-lg" />
            <div className="flex gap-1.5">
              <div className="shimmer h-6 w-20 rounded-lg" />
              <div className="shimmer h-6 w-24 rounded-lg" />
              <div className="shimmer h-6 w-16 rounded-lg" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="shimmer h-3 w-10 rounded-lg" />
              <div className="shimmer h-4 w-full rounded-lg" />
              <div className="shimmer h-4 w-4/5 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="shimmer h-3 w-10 rounded-lg" />
              <div className="shimmer h-4 w-full rounded-lg" />
              <div className="shimmer h-4 w-3/4 rounded-lg" />
            </div>
          </div>
          <div className="shimmer h-1.5 w-full rounded-full" />
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-zinc-400">Analyzing audience sentiment with AI…</p>
    </motion.div>
  );
}
