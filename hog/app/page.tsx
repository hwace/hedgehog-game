"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useHedgehog } from "@/hooks/useHedgehog";
import { HedgehogCard } from "@/components/game/HedgehogCard";
import { HedgehogSkeleton } from "@/components/ui/Skeleton";
import { Navbar } from "@/components/ui/Navbar";
import { formatScore, formatCoin } from "@/utils";

export default function HomePage() {
  const router = useRouter();
  const { user } = useGameStore();
  const {
    hedgehog,
    hedgehogLoading,
    feed,
    touch,
    clean,
    isFeedLoading,
    isTouchLoading,
    isCleanLoading,
  } = useHedgehog();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-pastel-gradient">
      <Navbar />

      <main className="max-w-md mx-auto px-4 pt-4 pb-28">
        {/* Welcome banner */}
        <motion.div
          className="flex items-center justify-between mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1
              className="text-2xl font-bold text-hedgehog-text"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              안녕하세요, {user.nickname}님! 🌿
            </h1>
            <p className="text-sm text-hedgehog-muted">오늘도 고슴도치를 돌봐주세요</p>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-hedgehog-card rounded-3xl shadow-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-hedgehog-accent/10 flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <p className="text-xs text-hedgehog-muted font-semibold">현재 점수</p>
              <p className="text-lg font-bold text-hedgehog-accent" style={{ fontFamily: "var(--font-fredoka)" }}>
                {formatScore(user.current_score)}
              </p>
            </div>
          </div>
          <div className="bg-hedgehog-card rounded-3xl shadow-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <span className="text-xl">🪙</span>
            </div>
            <div>
              <p className="text-xs text-hedgehog-muted font-semibold">보유 코인</p>
              <p className="text-lg font-bold text-yellow-700" style={{ fontFamily: "var(--font-fredoka)" }}>
                {formatCoin(user.coin)}
              </p>
            </div>
          </div>
          <div className="bg-hedgehog-card rounded-3xl shadow-card p-4 flex items-center gap-3 col-span-2">
            <div className="w-10 h-10 rounded-2xl bg-pastel-mint flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <p className="text-xs text-hedgehog-muted font-semibold">최고 점수</p>
              <p className="text-lg font-bold text-teal-700" style={{ fontFamily: "var(--font-fredoka)" }}>
                {formatScore(user.best_score)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hedgehog card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {hedgehogLoading ? (
            <HedgehogSkeleton />
          ) : hedgehog ? (
            <HedgehogCard
              hedgehog={hedgehog}
              onFeed={feed}
              onTouch={touch}
              onClean={clean}
              isFeedLoading={isFeedLoading}
              isTouchLoading={isTouchLoading}
              isCleanLoading={isCleanLoading}
            />
          ) : (
            <div className="text-center py-12 bg-hedgehog-card rounded-4xl shadow-soft">
              <p className="text-5xl mb-3">🦔</p>
              <p className="font-bold text-hedgehog-muted">고슴도치를 불러오는 중...</p>
            </div>
          )}
        </motion.div>

        {/* Tip section */}
        <motion.div
          className="mt-5 bg-pastel-blue/40 border border-pastel-blue rounded-3xl p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-blue-700 font-semibold">💡 게임 팁</p>
          <ul className="text-xs text-blue-600 mt-2 space-y-1">
            <li>• 8시간마다 배가 고파요. 배고플 때 먹이면 점수 획득!</li>
            <li>• 기분이 좋을 때 쓰다듬으면 2배 점수!</li>
            <li>• 15시간 이상 방치하면 사망해요 ⚠️</li>
            <li>• 똥 치우면 코인 획득!</li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
