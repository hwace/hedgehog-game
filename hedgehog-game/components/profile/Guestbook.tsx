"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { addGuestbookEntry, deleteGuestbookEntry } from "@/lib/db";
import type { GuestbookEntry } from "@/types";
import { useGameStore } from "@/store/gameStore";

interface GuestbookProps {
  entries: GuestbookEntry[];
  ownerUserId: string;
  onRefresh: () => void;
}

export function Guestbook({ entries, ownerUserId, onRefresh }: GuestbookProps) {
  const { user } = useGameStore();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("메시지를 입력해주세요!");
      return;
    }
    if (message.length > 500) {
      toast.error("500자 이하로 입력해주세요.");
      return;
    }
    setSending(true);
    try {
      await addGuestbookEntry(ownerUserId, user?.id ?? null, message.trim());
      setMessage("");
      toast.success("방명록을 남겼습니다! 💌");
      onRefresh();
    } catch (e) {
      toast.error("방명록 작성에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteGuestbookEntry(entryId);
      toast.success("삭제했습니다.");
      onRefresh();
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Write */}
      <div className="bg-hedgehog-card rounded-3xl p-4 shadow-card">
        <h3 className="font-bold text-hedgehog-text mb-3">✉️ 방명록 남기기</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="따뜻한 한마디를 남겨보세요 🌸"
          maxLength={500}
          rows={3}
          className="w-full px-3 py-2 rounded-2xl border-2 border-hedgehog-border bg-hedgehog-bg
                     text-hedgehog-text placeholder:text-hedgehog-border resize-none
                     focus:outline-none focus:border-hedgehog-accent/50 text-sm"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-hedgehog-muted">{message.length}/500</span>
          <motion.button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-hedgehog-accent text-white
                       text-sm font-bold btn-press disabled:opacity-60"
            whileTap={{ scale: 0.94 }}
          >
            <Send size={14} />
            {sending ? "전송 중..." : "남기기"}
          </motion.button>
        </div>
      </div>

      {/* Entries */}
      <AnimatePresence>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-hedgehog-muted">
            <p className="text-3xl mb-2">💌</p>
            <p className="font-medium text-sm">아직 방명록이 없습니다</p>
          </div>
        ) : (
          entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="bg-hedgehog-card rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🦔</span>
                    <span className="font-bold text-sm text-hedgehog-text">
                      {entry.writer?.nickname ?? "익명"}
                    </span>
                    <span className="text-xs text-hedgehog-muted">
                      {new Date(entry.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm text-hedgehog-text leading-relaxed">
                    {entry.message}
                  </p>
                </div>
                {(user?.id === ownerUserId || user?.id === entry.writer_user_id) && (
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-hedgehog-muted hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
