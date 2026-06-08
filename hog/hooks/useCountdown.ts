"use client";

import { useState, useEffect } from "react";
import { formatTime } from "@/utils";

export function useCountdown(targetMs: number): string {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, targetMs - Date.now())
  );

  useEffect(() => {
    setRemaining(Math.max(0, targetMs - Date.now()));
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, targetMs - Date.now());
        if (next === 0) clearInterval(interval);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return formatTime(remaining);
}
