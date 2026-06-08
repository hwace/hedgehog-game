"use client";

import { motion } from "framer-motion";

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`bg-hedgehog-border/20 rounded-4xl ${className}`}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function HedgehogSkeleton() {
  return (
    <div className="bg-hedgehog-card rounded-4xl shadow-soft-lg overflow-hidden p-6">
      <div className="h-1.5 bg-hedgehog-border/30 rounded mb-6" />
      <SkeletonCard className="h-6 w-40 mb-4" />
      <div className="flex justify-center mb-6">
        <SkeletonCard className="w-40 h-40 rounded-full" />
      </div>
      <div className="space-y-3 mb-5">
        <SkeletonCard className="h-6" />
        <SkeletonCard className="h-6" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="h-24 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
