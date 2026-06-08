"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTopRankings } from "@/lib/db";
import { useGameStore } from "@/store/gameStore";
import { RankingTable } from "@/components/ranking/RankingTable";
import { Navbar } from "@/components/ui/Navbar";

export default function RankingPage() {
  const router = useRouter();
  const { user } = useGameStore();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const { data: rankings = [], isLoading } = useQuery({
    queryKey: ["rankings"],
    queryFn: () => getTopRankings(30),
    refetchInterval: 60_000,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-pastel-gradient">
      <Navbar />

      <main className="max-w-md mx-auto px-4 pt-4 pb-28">
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-2xl font-bold text-hedgehog-text"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            🏆 명예의 전당
          </h1>
          <p className="text-sm text-hedgehog-muted mt-1">
            최고 점수 기준 상위 랭킹입니다
          </p>
        </motion.div>

        {/* My rank highlight */}
        {user && rankings.length > 0 && (() => {
          const myRank = rankings.findIndex((r) => r.id === user.id);
          if (myRank === -1) return null;
          return (
            <motion.div
              className="bg-hedgehog-accent/10 border-2 border-hedgehog-accent/40 rounded-3xl p-4 mb-5 flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-3xl">🦔</span>
              <div>
                <p className="font-bold text-hedgehog-text">내 순위</p>
                <p className="text-hedgehog-accent font-bold text-xl" style={{ fontFamily: "var(--font-fredoka)" }}>
                  #{myRank + 1}위
                </p>
              </div>
            </motion.div>
          );
        })()}

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="h-16 bg-hedgehog-card rounded-2xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-3">🏅</p>
            <p className="text-hedgehog-muted font-semibold">아직 랭킹이 없습니다</p>
            <p className="text-sm text-hedgehog-muted/70">첫 번째 랭커가 되어보세요!</p>
          </div>
        ) : (
          <RankingTable rankings={rankings as any} currentUserId={user.id} />
        )}
      </main>
    </div>
  );
}
