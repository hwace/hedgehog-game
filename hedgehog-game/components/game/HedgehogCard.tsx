"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HedgehogAvatar } from "./HedgehogAvatar";
import { StatusBar } from "./StatusBar";
import { TimerDisplay } from "./TimerDisplay";
import { ActionButtons } from "./ActionButtons";
import { FeedModal } from "./FeedModal";
import type { Hedgehog } from "@/types";
import {
  getMoodColor,
  getMoodEmoji,
  getMoodLabel,
  getRarityColor,
  getRarityLabel,
  getRarityStars,
  getHungerTimeLeft,
  getDeathTimeLeft,
  getTouchRechargeLeft,
  getHoursSince,
} from "@/utils";

interface HedgehogCardProps {
  hedgehog: Hedgehog;
  onFeed: (args: { itemId: string }) => void;
  onTouch: () => void;
  onClean: () => void;
  isFeedLoading: boolean;
  isTouchLoading: boolean;
  isCleanLoading: boolean;
}

export function HedgehogCard({
  hedgehog,
  onFeed,
  onTouch,
  onClean,
  isFeedLoading,
  isTouchLoading,
  isCleanLoading,
}: HedgehogCardProps) {
  const [feedOpen, setFeedOpen] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string }[]>([]);

  const hungerTimeLeft = getHungerTimeLeft(hedgehog.last_fed_at);
  const deathTimeLeft = getDeathTimeLeft(hedgehog.last_interaction_at);
  const touchRechargeLeft = getTouchRechargeLeft(hedgehog.last_touched_at);

  // Compute "fullness" bar: 0-100, decreases as time since last feed increases
  const hoursSinceFed = getHoursSince(hedgehog.last_fed_at);
  const fullness = Math.max(0, Math.min(100, 100 - (hoursSinceFed / 8) * 100));

  // Survival bar
  const hoursSinceInteraction = getHoursSince(hedgehog.last_interaction_at);
  const survival = Math.max(0, Math.min(100, 100 - (hoursSinceInteraction / 15) * 100));

  const handleTouchWithEffect = () => {
    const emoji = hedgehog.mood === "happy" ? "💕" : hedgehog.mood === "angry" ? "💢" : "😤";
    const id = Date.now();
    setFloatingEmojis((prev) => [...prev, { id, emoji }]);
    setTimeout(() => setFloatingEmojis((prev) => prev.filter((e) => e.id !== id)), 1200);
    onTouch();
  };

  return (
    <>
      <div className="relative bg-hedgehog-card rounded-4xl shadow-soft-lg overflow-hidden">
        {/* Top accent bar based on rarity */}
        <div
          className={`h-1.5 ${
            hedgehog.rarity === "legendary"
              ? "bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300"
              : hedgehog.rarity === "epic"
              ? "bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300"
              : hedgehog.rarity === "rare"
              ? "bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300"
              : "bg-gradient-to-r from-hedgehog-border via-pastel-peach to-hedgehog-border"
          }`}
        />

        <div className="p-6">
          {/* Name & badges */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-xl font-bold text-hedgehog-text"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {hedgehog.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getRarityColor(hedgehog.rarity)}`}>
                  {getRarityStars(hedgehog.rarity)} {getRarityLabel(hedgehog.rarity)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getMoodColor(hedgehog.mood)}`}>
                  {getMoodEmoji(hedgehog.mood)} {getMoodLabel(hedgehog.mood)}
                </span>
              </div>
            </div>
            {!hedgehog.is_alive && (
              <div className="text-sm font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full">
                💀 사망
              </div>
            )}
          </div>

          {/* Avatar area */}
          <div className="relative flex justify-center py-4 mb-4">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-pastel-mint/30 blur-xl" />
            </div>

            <div className="relative">
              <HedgehogAvatar
                mood={hedgehog.mood}
                rarity={hedgehog.rarity}
                isHungry={hedgehog.is_hungry}
                hasPoop={hedgehog.has_poop}
                isAlive={hedgehog.is_alive}
                size="xl"
                onClick={hedgehog.is_alive ? handleTouchWithEffect : undefined}
              />

              {/* Floating emoji effects */}
              <AnimatePresence>
                {floatingEmojis.map(({ id, emoji }) => (
                  <motion.div
                    key={id}
                    className="absolute top-0 left-1/2 text-2xl pointer-events-none"
                    initial={{ y: 0, x: "-50%", opacity: 1, scale: 1 }}
                    animate={{ y: -60, opacity: 0, scale: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Status bars */}
          <div className="space-y-3 mb-5">
            <StatusBar
              label="포만감"
              emoji="🍎"
              value={fullness}
              color={fullness < 25 ? "bg-red-400" : fullness < 50 ? "bg-orange-400" : "bg-green-400"}
              bgColor="bg-hedgehog-border/30"
            />
            <StatusBar
              label="생존력"
              emoji="💚"
              value={survival}
              color={survival < 25 ? "bg-red-400" : survival < 50 ? "bg-orange-400" : "bg-teal-400"}
              bgColor="bg-hedgehog-border/30"
            />
          </div>

          {/* Timers */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <TimerDisplay
              label="배고픔까지"
              emoji="🍽️"
              targetMs={Date.now() + hungerTimeLeft}
              urgentThresholdMs={2 * 60 * 60 * 1000}
            />
            <TimerDisplay
              label="위험까지"
              emoji="⚠️"
              targetMs={Date.now() + deathTimeLeft}
              urgentThresholdMs={3 * 60 * 60 * 1000}
            />
            {hedgehog.touch_count >= 3 && (
              <TimerDisplay
                label="터치 충전"
                emoji="✋"
                targetMs={Date.now() + touchRechargeLeft}
                urgentThresholdMs={30 * 60 * 1000}
              />
            )}
          </div>

          {/* Action buttons */}
          {hedgehog.is_alive && (
            <ActionButtons
              hedgehog={hedgehog}
              onFeedClick={() => setFeedOpen(true)}
              onTouch={handleTouchWithEffect}
              onClean={onClean}
              isFeedLoading={isFeedLoading}
              isTouchLoading={isTouchLoading}
              isCleanLoading={isCleanLoading}
            />
          )}
        </div>
      </div>

      <FeedModal
        open={feedOpen}
        onClose={() => setFeedOpen(false)}
        onFeed={(itemId) => onFeed({ itemId })}
        isLoading={isFeedLoading}
      />
    </>
  );
}
