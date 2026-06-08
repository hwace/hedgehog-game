"use client";

import { motion } from "framer-motion";
import type { HedgehogMood, HedgehogRarity } from "@/types";
import { getRarityGlow } from "@/utils";

interface HedgehogAvatarProps {
  mood: HedgehogMood;
  rarity: HedgehogRarity;
  isHungry?: boolean;
  hasPoop?: boolean;
  isAlive?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  animated?: boolean;
}

const sizeMap = {
  sm: 80,
  md: 120,
  lg: 180,
  xl: 240,
};

const rarityBodyColor: Record<HedgehogRarity, string> = {
  normal: "#C8956C",
  rare: "#7EB8E8",
  epic: "#B89BE8",
  legendary: "#E8D07E",
};

const raritySpineColor: Record<HedgehogRarity, string> = {
  normal: "#8B5E3C",
  rare: "#4A8CC4",
  epic: "#7B5BC4",
  legendary: "#C4A020",
};

export function HedgehogAvatar({
  mood,
  rarity,
  isHungry = false,
  hasPoop = false,
  isAlive = true,
  size = "lg",
  onClick,
  animated = true,
}: HedgehogAvatarProps) {
  const px = sizeMap[size];
  const glow = getRarityGlow(rarity);
  const bodyColor = rarityBodyColor[rarity];
  const spineColor = raritySpineColor[rarity];

  const moodEyes = {
    happy: (
      <>
        {/* Happy curved eyes */}
        <path d="M 34 52 Q 37 48 40 52" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 60 52 Q 63 48 66 52" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    ),
    sensitive: (
      <>
        {/* Tense eyes */}
        <ellipse cx="37" cy="51" rx="4" ry="3" fill="#5C3D2E" />
        <ellipse cx="63" cy="51" rx="4" ry="3" fill="#5C3D2E" />
        {/* Sweat drop */}
        <ellipse cx="72" cy="44" rx="2.5" ry="3.5" fill="#93C5FD" opacity="0.8" />
      </>
    ),
    angry: (
      <>
        {/* Angry eyebrows */}
        <line x1="30" y1="44" x2="42" y2="48" stroke="#5C3D2E" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="44" x2="58" y2="48" stroke="#5C3D2E" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="37" cy="52" rx="4" ry="3" fill="#5C3D2E" />
        <ellipse cx="63" cy="52" rx="4" ry="3" fill="#5C3D2E" />
      </>
    ),
  };

  const moodMouth = {
    happy: <path d="M 44 62 Q 50 68 56 62" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    sensitive: <line x1="44" y1="64" x2="56" y2="64" stroke="#5C3D2E" strokeWidth="2.5" strokeLinecap="round" />,
    angry: <path d="M 44 66 Q 50 60 56 66" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  };

  const svg = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Spines (back) */}
      {[20, 30, 40, 50, 60, 70, 80].map((x, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={38 - Math.abs(50 - x) * 0.2}
          rx="5"
          ry="14"
          fill={spineColor}
          opacity="0.9"
          transform={`rotate(${(x - 50) * 0.6}, ${x}, 38)`}
        />
      ))}
      {/* Inner spines */}
      {[25, 37, 50, 63, 75].map((x, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={32 - Math.abs(50 - x) * 0.15}
          rx="4"
          ry="12"
          fill={spineColor}
          opacity="0.7"
          transform={`rotate(${(x - 50) * 0.5}, ${x}, 32)`}
        />
      ))}

      {/* Body */}
      <ellipse cx="50" cy="65" rx="32" ry="24" fill={bodyColor} />
      {/* Belly */}
      <ellipse cx="50" cy="68" rx="20" ry="14" fill="#F5D5A8" opacity="0.8" />

      {/* Head */}
      <ellipse cx="50" cy="52" rx="22" ry="20" fill={bodyColor} />

      {/* Snout */}
      <ellipse cx="50" cy="62" rx="10" ry="7" fill="#E8B090" />
      {/* Nose */}
      <ellipse cx="50" cy="58" rx="4" ry="3" fill="#5C3D2E" />
      <circle cx="51" cy="57" r="1" fill="white" opacity="0.7" />

      {/* Eyes */}
      {isAlive ? (
        moodEyes[mood]
      ) : (
        <>
          <text x="30" y="57" fontSize="12" textAnchor="middle">✕</text>
          <text x="66" y="57" fontSize="12" textAnchor="middle">✕</text>
        </>
      )}

      {/* Mouth */}
      {isAlive && moodMouth[mood]}

      {/* Ear hint */}
      <ellipse cx="32" cy="36" rx="5" ry="7" fill={bodyColor} />
      <ellipse cx="68" cy="36" rx="5" ry="7" fill={bodyColor} />
      <ellipse cx="32" cy="37" rx="3" ry="4" fill="#E8B090" opacity="0.6" />
      <ellipse cx="68" cy="37" rx="3" ry="4" fill="#E8B090" opacity="0.6" />

      {/* Hungry indicator */}
      {isHungry && isAlive && (
        <text x="82" y="30" fontSize="14" textAnchor="middle">🍽️</text>
      )}

      {/* Poop indicator */}
      {hasPoop && isAlive && (
        <text x="82" y="85" fontSize="14" textAnchor="middle">💩</text>
      )}

      {/* Rarity sparkle for epic/legendary */}
      {(rarity === "epic" || rarity === "legendary") && (
        <>
          <text x="12" y="20" fontSize="10">✨</text>
          <text x="78" y="20" fontSize="10">✨</text>
        </>
      )}
      {rarity === "legendary" && (
        <text x="50" y="14" fontSize="10" textAnchor="middle">👑</text>
      )}
    </svg>
  );

  if (!animated) return <div onClick={onClick} className={`cursor-pointer ${glow} rounded-full`}>{svg}</div>;

  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer inline-block ${glow} rounded-full`}
      animate={
        isAlive
          ? { y: [0, -8, 0] }
          : { rotate: [0, 5, -5, 0], opacity: 0.6 }
      }
      transition={
        isAlive
          ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          : { duration: 1.5, repeat: Infinity }
      }
      whileHover={isAlive ? { scale: 1.08 } : undefined}
      whileTap={isAlive ? { scale: 0.92, rotate: [0, -10, 10, 0] } : undefined}
    >
      {svg}
    </motion.div>
  );
}
