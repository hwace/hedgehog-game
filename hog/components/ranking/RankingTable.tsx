"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatScore } from "@/utils";

interface RankEntry {
  id: string;
  nickname: string;
  best_score: number;
  current_score: number;
}

interface RankingTableProps {
  rankings: RankEntry[];
  currentUserId?: string;
}

const medalEmoji = ["🥇", "🥈", "🥉"];

export function RankingTable({ rankings, currentUserId }: RankingTableProps) {
  return (
    <div className="space-y-2">
      {rankings.map((entry, i) => {
        const isMine = entry.id === currentUserId;
        const medal = medalEmoji[i] ?? null;

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/profile/${entry.id}`}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-all
                            ${isMine
                              ? "bg-hedgehog-accent/10 border-hedgehog-accent/40"
                              : "bg-hedgehog-card border-hedgehog-border hover:border-hedgehog-accent/30"
                            }`}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  {medal ? (
                    <span className="text-xl">{medal}</span>
                  ) : (
                    <span className="text-sm font-bold text-hedgehog-muted">
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Avatar placeholder */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                              ${i === 0 ? "bg-yellow-100" : i === 1 ? "bg-gray-100" : i === 2 ? "bg-orange-100" : "bg-hedgehog-bg"}`}
                >
                  🦔
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p
                    className={`font-bold ${isMine ? "text-hedgehog-accent" : "text-hedgehog-text"}`}
                  >
                    {entry.nickname}
                    {isMine && <span className="ml-1 text-xs">(나)</span>}
                  </p>
                  <p className="text-xs text-hedgehog-muted">
                    현재: {formatScore(entry.current_score)}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p
                    className="font-bold text-lg"
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {formatScore(entry.best_score)}
                  </p>
                  <p className="text-xs text-hedgehog-muted">최고 점수</p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
