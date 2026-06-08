import type { HedgehogMood, HedgehogRarity } from "@/types";

export function formatTime(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

export function getHoursUntil(targetMs: number): number {
  const remaining = targetMs - Date.now();
  return Math.max(0, remaining / 1000 / 3600);
}

export function getTimeSince(dateStr: string | null): number {
  if (!dateStr) return Infinity;
  return Date.now() - new Date(dateStr).getTime();
}

export function getHoursSince(dateStr: string | null): number {
  return getTimeSince(dateStr) / 1000 / 3600;
}

export function getMoodEmoji(mood: HedgehogMood): string {
  switch (mood) {
    case "happy": return "😊";
    case "sensitive": return "😤";
    case "angry": return "😠";
  }
}

export function getMoodLabel(mood: HedgehogMood): string {
  switch (mood) {
    case "happy": return "행복";
    case "sensitive": return "예민";
    case "angry": return "화남";
  }
}

export function getMoodColor(mood: HedgehogMood): string {
  switch (mood) {
    case "happy": return "text-green-600 bg-green-100";
    case "sensitive": return "text-yellow-600 bg-yellow-100";
    case "angry": return "text-red-600 bg-red-100";
  }
}

export function getRarityLabel(rarity: HedgehogRarity): string {
  switch (rarity) {
    case "normal": return "일반";
    case "rare": return "레어";
    case "epic": return "에픽";
    case "legendary": return "전설";
  }
}

export function getRarityColor(rarity: HedgehogRarity): string {
  switch (rarity) {
    case "normal": return "text-gray-600 bg-gray-100";
    case "rare": return "text-blue-600 bg-blue-100";
    case "epic": return "text-purple-600 bg-purple-100";
    case "legendary": return "text-yellow-700 bg-yellow-100";
  }
}

export function getRarityGlow(rarity: HedgehogRarity): string {
  switch (rarity) {
    case "normal": return "";
    case "rare": return "shadow-[0_0_20px_rgba(59,130,246,0.4)]";
    case "epic": return "shadow-[0_0_20px_rgba(147,51,234,0.4)]";
    case "legendary": return "shadow-[0_0_30px_rgba(234,179,8,0.5)]";
  }
}

export function getRarityStars(rarity: HedgehogRarity): string {
  switch (rarity) {
    case "normal": return "⭐";
    case "rare": return "⭐⭐";
    case "epic": return "⭐⭐⭐";
    case "legendary": return "⭐⭐⭐⭐";
  }
}

export function formatScore(score: number): string {
  return score.toLocaleString("ko-KR");
}

export function formatCoin(coin: number): string {
  return coin.toLocaleString("ko-KR");
}

export function getHungerTimeLeft(lastFedAt: string | null): number {
  const hungerAfterMs = 8 * 60 * 60 * 1000;
  if (!lastFedAt) return 0;
  const elapsed = Date.now() - new Date(lastFedAt).getTime();
  return Math.max(0, hungerAfterMs - elapsed);
}

export function getDeathTimeLeft(lastInteractionAt: string): number {
  const deathAfterMs = 15 * 60 * 60 * 1000;
  const elapsed = Date.now() - new Date(lastInteractionAt).getTime();
  return Math.max(0, deathAfterMs - elapsed);
}

export function getTouchRechargeLeft(lastTouchedAt: string | null): number {
  if (!lastTouchedAt) return 0;
  const rechargeMs = 3 * 60 * 60 * 1000;
  const elapsed = Date.now() - new Date(lastTouchedAt).getTime();
  return Math.max(0, rechargeMs - elapsed);
}

export function getHedgehogEmoji(rarity: HedgehogRarity, mood: HedgehogMood): string {
  // base hedgehog face varies by mood
  if (mood === "happy") return "🦔";
  if (mood === "angry") return "🦔";
  return "🦔";
}
