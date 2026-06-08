"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pastel-gradient flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl mb-6"
      >
        🦔
      </motion.div>
      <h1 className="text-2xl font-bold text-hedgehog-text mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-hedgehog-muted mb-6">고슴도치도 여기서 길을 잃었나봐요...</p>
      <Link
        href="/"
        className="px-6 py-3 bg-hedgehog-accent text-white rounded-2xl font-bold hover:bg-hedgehog-accent-dark transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
