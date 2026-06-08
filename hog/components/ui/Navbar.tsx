"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Trophy, User, LogOut } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { formatCoin, formatScore } from "@/utils";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useGameStore();

  if (!user) return null;

  const navItems = [
    { href: "/", icon: Home, label: "홈" },
    { href: "/shop", icon: ShoppingBag, label: "상점" },
    { href: "/ranking", icon: Trophy, label: "랭킹" },
    { href: `/profile/${user.id}`, icon: User, label: "프로필" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="sticky top-0 z-30 glass border-b border-hedgehog-border/50 px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-hedgehog-text"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <span className="text-xl">🦔</span>
            <span className="text-lg">고슴도치 하우스</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full">
              <span className="text-sm">🪙</span>
              <span className="text-xs font-bold text-yellow-700">
                {formatCoin(user.coin)}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-hedgehog-accent/10 border border-hedgehog-accent/20 px-2.5 py-1 rounded-full">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-bold text-hedgehog-accent">
                {formatScore(user.current_score)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-hedgehog-border/50">
        <div className="max-w-md mx-auto flex items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-3 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-1 inset-x-4 h-0.5 bg-hedgehog-accent rounded-full"
                  />
                )}
                <item.icon
                  size={20}
                  className={isActive ? "text-hedgehog-accent" : "text-hedgehog-muted"}
                />
                <span
                  className={`text-xs font-semibold ${
                    isActive ? "text-hedgehog-accent" : "text-hedgehog-muted"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-hedgehog-muted"
          >
            <LogOut size={20} />
            <span className="text-xs font-semibold">로그아웃</span>
          </button>
        </div>
      </nav>
    </>
  );
}
