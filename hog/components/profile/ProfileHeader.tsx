"use client";

import { motion } from "framer-motion";
import type { Profile, Hedgehog } from "@/types";
import { HedgehogAvatar } from "@/components/game/HedgehogAvatar";
import { getRarityLabel, getRarityColor, formatScore, formatCoin } from "@/utils";

interface ProfileHeaderProps {
  profile: Profile;
  hedgehog: Hedgehog | null;
  isOwnProfile: boolean;
}

export function ProfileHeader({
  profile,
  hedgehog,
  isOwnProfile,
}: ProfileHeaderProps) {
  return (
    <div className="bg-hedgehog-card rounded-4xl shadow-soft-lg overflow-hidden">
      {/* Top gradient banner */}
      <div className="h-20 bg-gradient-to-br from-pastel-peach via-pastel-pink to-pastel-lavender relative">
        <div className="absolute inset-0 opacity-20">
          {["🌸", "⭐", "🍃", "💫"].map((e, i) => (
            <span
              key={i}
              className="absolute text-xl"
              style={{ left: `${20 + i * 20}%`, top: `${20 + (i % 2) * 30}%` }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6 -mt-10">
        {/* Avatar */}
        <div className="flex items-end justify-between mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white shadow-soft-lg flex items-center justify-center border-4 border-white">
              {hedgehog ? (
                <HedgehogAvatar
                  mood={hedgehog.mood}
                  rarity={hedgehog.rarity}
                  isAlive={hedgehog.is_alive}
                  size="md"
                  animated={false}
                />
              ) : (
                <span className="text-4xl">🦔</span>
              )}
            </div>
            {isOwnProfile && (
              <span className="absolute -bottom-1 -right-1 text-sm bg-hedgehog-accent text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
                ✓
              </span>
            )}
          </div>

          {hedgehog && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold mt-10 ${getRarityColor(hedgehog.rarity)}`}
            >
              {getRarityLabel(hedgehog.rarity)} 고슴도치
            </span>
          )}
        </div>

        {/* Name */}
        <h2
          className="text-xl font-bold text-hedgehog-text"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {profile.nickname}
        </h2>
        {hedgehog && (
          <p className="text-sm text-hedgehog-muted">
            고슴도치 이름: <span className="font-semibold">{hedgehog.name}</span>
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-hedgehog-bg rounded-2xl p-3 text-center">
            <p className="text-xs text-hedgehog-muted font-semibold">최고 점수</p>
            <p
              className="text-xl font-bold text-hedgehog-accent"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {formatScore(profile.best_score)}
            </p>
          </div>
          <div className="bg-hedgehog-bg rounded-2xl p-3 text-center">
            <p className="text-xs text-hedgehog-muted font-semibold">현재 점수</p>
            <p
              className="text-xl font-bold text-teal-600"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {formatScore(profile.current_score)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
