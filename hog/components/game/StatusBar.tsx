"use client";

import { motion } from "framer-motion";

interface StatusBarProps {
  label: string;
  emoji: string;
  value: number; // 0-100
  color: string;
  bgColor: string;
}

export function StatusBar({ label, emoji, value, color, bgColor }: StatusBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg w-6 text-center">{emoji}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs text-hedgehog-muted mb-1">
          <span className="font-semibold">{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
        <div className={`h-2.5 rounded-full ${bgColor} overflow-hidden`}>
          <motion.div
            className={`h-full rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
