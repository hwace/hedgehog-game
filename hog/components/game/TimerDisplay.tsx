"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface TimerDisplayProps {
  label: string;
  emoji: string;
  targetMs: number;
  urgentThresholdMs?: number;
}

export function TimerDisplay({
  label,
  emoji,
  targetMs,
  urgentThresholdMs = 60 * 60 * 1000, // 1 hour
}: TimerDisplayProps) {
  const display = useCountdown(targetMs);
  const remaining = Math.max(0, targetMs - Date.now());
  const isUrgent = remaining < urgentThresholdMs;
  const isDone = remaining <= 0;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-semibold
        ${isDone
          ? "bg-red-100 text-red-600 animate-pulse-soft"
          : isUrgent
          ? "bg-orange-100 text-orange-600"
          : "bg-hedgehog-border/40 text-hedgehog-muted"
        }`}
    >
      <span>{emoji}</span>
      <div>
        <div className="text-xs opacity-70">{label}</div>
        <div className="font-bold tabular-nums">{isDone ? "지금!" : display}</div>
      </div>
    </div>
  );
}
