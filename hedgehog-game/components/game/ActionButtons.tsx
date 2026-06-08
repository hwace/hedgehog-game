"use client";

import { motion } from "framer-motion";
import { Hand, Trash2, UtensilsCrossed } from "lucide-react";
import type { Hedgehog } from "@/types";
import { getMoodColor, getMoodLabel } from "@/utils";

interface ActionButtonsProps {
  hedgehog: Hedgehog;
  onFeedClick: () => void;
  onTouch: () => void;
  onClean: () => void;
  isTouchLoading: boolean;
  isCleanLoading: boolean;
  isFeedLoading: boolean;
}

export function ActionButtons({
  hedgehog,
  onFeedClick,
  onTouch,
  onClean,
  isTouchLoading,
  isCleanLoading,
  isFeedLoading,
}: ActionButtonsProps) {
  const touchRemaining = 3 - hedgehog.touch_count;
  const canTouch = hedgehog.touch_count < 3;

  const buttons = [
    {
      label: "먹이주기",
      emoji: "🍎",
      color: "bg-pastel-peach border-orange-200 hover:bg-orange-100",
      textColor: "text-orange-700",
      onClick: onFeedClick,
      loading: isFeedLoading,
      badge: hedgehog.is_hungry ? "배고파요!" : null,
      badgeColor: "bg-red-100 text-red-600",
      disabled: false,
    },
    {
      label: "쓰다듬기",
      emoji: hedgehog.mood === "angry" ? "😬" : "🤗",
      color: canTouch
        ? "bg-pastel-pink border-pink-200 hover:bg-pink-100"
        : "bg-gray-100 border-gray-200 opacity-60",
      textColor: canTouch ? "text-pink-700" : "text-gray-500",
      onClick: canTouch ? onTouch : undefined,
      loading: isTouchLoading,
      badge: `${touchRemaining}/3`,
      badgeColor: canTouch ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-500",
      disabled: !canTouch,
    },
    {
      label: "청소하기",
      emoji: "🧹",
      color: hedgehog.has_poop
        ? "bg-pastel-yellow border-yellow-200 hover:bg-yellow-100"
        : "bg-gray-100 border-gray-200 opacity-60",
      textColor: hedgehog.has_poop ? "text-yellow-700" : "text-gray-500",
      onClick: hedgehog.has_poop ? onClean : undefined,
      loading: isCleanLoading,
      badge: hedgehog.has_poop ? "💩 있음" : "깨끗함",
      badgeColor: hedgehog.has_poop
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-600",
      disabled: !hedgehog.has_poop,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {buttons.map((btn) => (
        <motion.button
          key={btn.label}
          onClick={btn.onClick}
          disabled={btn.disabled || btn.loading}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-3xl border-2
                      transition-all duration-200 btn-press
                      disabled:cursor-not-allowed ${btn.color}`}
          whileHover={!btn.disabled ? { scale: 1.03 } : undefined}
          whileTap={!btn.disabled ? { scale: 0.94 } : undefined}
        >
          {btn.badge && (
            <span
              className={`absolute -top-2 left-1/2 -translate-x-1/2
                          text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${btn.badgeColor}`}
            >
              {btn.badge}
            </span>
          )}
          <span className="text-3xl mt-1">
            {btn.loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                ⏳
              </motion.span>
            ) : (
              btn.emoji
            )}
          </span>
          <span className={`text-xs font-bold ${btn.textColor}`}>{btn.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
