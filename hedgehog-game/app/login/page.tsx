"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getOrCreateProfile } from "@/lib/db";
import { useGameStore } from "@/store/gameStore";

export default function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useGameStore();
  const router = useRouter();

  const handleLogin = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      toast.error("닉네임을 입력해주세요!");
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 12) {
      toast.error("닉네임은 2~12자로 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const profile = await getOrCreateProfile(trimmed);
      setUser(profile);
      toast.success(`어서오세요, ${profile.nickname}님! 🦔`);
      router.push("/");
    } catch (e) {
      toast.error("로그인 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-pastel-gradient flex flex-col items-center justify-center p-6">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {["🌸", "🍃", "⭐", "🌼", "💫", "🍀"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-30"
            style={{
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Card */}
        <div className="glass rounded-4xl shadow-soft-lg p-8 text-center">
          {/* Hedgehog mascot */}
          <motion.div
            className="text-8xl mb-4 inline-block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            🦔
          </motion.div>

          <h1
            className="text-3xl font-bold mb-1 text-hedgehog-text"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            고슴도치 하우스
          </h1>
          <p className="text-hedgehog-muted text-sm mb-8">
            귀여운 고슴도치를 키워보세요! 🌿
          </p>

          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-left text-sm font-semibold text-hedgehog-muted mb-2">
                닉네임 입력
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="귀여운 닉네임을 입력하세요"
                maxLength={12}
                className="w-full px-4 py-3 rounded-2xl border-2 border-hedgehog-border bg-white/80 
                           text-hedgehog-text placeholder:text-hedgehog-border/80
                           focus:outline-none focus:border-hedgehog-accent focus:ring-2 focus:ring-hedgehog-accent/20
                           transition-all duration-200 font-medium text-center text-lg"
              />
              <p className="text-xs text-hedgehog-muted mt-1 text-right">
                {nickname.length}/12
              </p>
            </div>

            <motion.button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-hedgehog-accent text-white font-bold text-lg
                         shadow-soft hover:bg-hedgehog-accent-dark
                         disabled:opacity-60 disabled:cursor-not-allowed
                         btn-press"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🌀
                  </motion.span>
                  입장 중...
                </span>
              ) : (
                "🦔 입장하기"
              )}
            </motion.button>
          </div>

          <p className="text-xs text-hedgehog-muted mt-6">
            비밀번호 없이 닉네임만으로 시작해요 ✨
          </p>
        </div>
      </motion.div>
    </main>
  );
}
