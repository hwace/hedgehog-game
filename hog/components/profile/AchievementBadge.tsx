"use client";

import { motion } from "framer-motion";
import type { Achievement } from "@/types";
import { formatCoin } from "@/utils";

interface AchievementBadgeProps {
  achievement: Achievement;
  achieved: boolean;
  achievedAt?: string;
}

const achievementEmoji: Record<string, string> = {
  "첫 먹이 주기": "🍎",
  "첫 청소": "🧹",
  "첫 24시간 생존": "⭐",
};

export function AchievementBadge({
  achievement,
  achieved,
  achievedAt,
}: AchievementBadgeProps) {
  const emoji = achievementEmoji[achievement.name] ?? "🏅";

  return (
    <motion.div
      className={`relative p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-2
                  ${achieved
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-hedgehog-bg border-hedgehog-border/30 opacity-50"
                  }`}
      whileHover={achieved ? { scale: 1.03 } : undefined}
    >
      {achieved && (
        <motion.div
          className="absolute -top-2 -right-2 text-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          ✅
        </motion.div>
      )}

      <span className="text-3xl">{emoji}</span>
      <div>
        <p className="font-bold text-hedgehog-text text-sm">{achievement.name}</p>
        <p className="text-xs text-hedgehog-muted mt-0.5">{achievement.description}</p>
        <p className="text-xs text-yellow-700 font-semibold mt-1">
          🪙 +{formatCoin(achievement.reward_coin)}
        </p>
      </div>

      {!achieved && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/40">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </motion.div>
  );
}
