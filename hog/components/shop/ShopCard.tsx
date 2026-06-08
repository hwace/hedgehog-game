"use client";

import { motion } from "framer-motion";
import type { ShopItem } from "@/types";
import { getRarityColor, getRarityLabel, formatCoin } from "@/utils";

interface ShopCardProps {
  item: ShopItem;
  quantity: number; // owned quantity
  userCoin: number;
  onBuy: (itemId: string) => void;
  isBuying: boolean;
}

const itemEmoji: Record<string, string> = {
  "일반 먹이": "🍎",
  "고급 먹이": "🥩",
  "프리미엄 먹이": "👑",
  "작은 모자": "🎩",
  "선글라스": "🕶️",
  "작은 침대": "🛏️",
};

export function ShopCard({ item, quantity, userCoin, onBuy, isBuying }: ShopCardProps) {
  const canBuy = userCoin >= item.price;
  const emoji = itemEmoji[item.name] ?? (item.type === "food" ? "🍽️" : "🎀");

  return (
    <motion.div
      className={`bg-hedgehog-card rounded-3xl shadow-card p-4 flex flex-col gap-3
                  border-2 ${canBuy ? "border-hedgehog-border hover:border-hedgehog-accent/40" : "border-hedgehog-border/30 opacity-60"}`}
      whileHover={canBuy ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.15 }}
    >
      {/* Icon */}
      <div className="flex items-start justify-between">
        <div className="text-4xl">{emoji}</div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getRarityColor(item.rarity)}`}>
          {getRarityLabel(item.rarity)}
        </span>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-bold text-hedgehog-text text-base">{item.name}</h3>
        <p className="text-xs text-hedgehog-muted mt-0.5">
          {item.type === "food" ? `점수 보너스 +${item.score_bonus}` : `장식 아이템`}
        </p>
        {quantity > 0 && (
          <p className="text-xs text-green-600 font-semibold mt-1">보유: {quantity}개</p>
        )}
      </div>

      {/* Price & buy */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1">
          <span className="text-base">🪙</span>
          <span className="font-bold text-yellow-700">{formatCoin(item.price)}</span>
        </div>
        <motion.button
          onClick={() => canBuy && onBuy(item.id)}
          disabled={!canBuy || isBuying}
          className={`px-4 py-1.5 rounded-xl text-sm font-bold btn-press
                      ${canBuy
                        ? "bg-hedgehog-accent text-white hover:bg-hedgehog-accent-dark shadow-soft"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
          whileTap={canBuy ? { scale: 0.92 } : undefined}
        >
          {isBuying ? "..." : canBuy ? "구매" : "코인부족"}
        </motion.button>
      </div>
    </motion.div>
  );
}
