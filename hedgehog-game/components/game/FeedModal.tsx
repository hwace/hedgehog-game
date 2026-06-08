"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getRarityColor, getRarityLabel } from "@/utils";

interface FeedModalProps {
  open: boolean;
  onClose: () => void;
  onFeed: (itemId: string) => void;
  isLoading: boolean;
}

export function FeedModal({ open, onClose, onFeed, isLoading }: FeedModalProps) {
  const { inventory } = useGameStore();
  const foodItems = inventory.filter(
    (item) => item.shop_items?.type === "food" && item.quantity > 0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-hedgehog-card rounded-t-4xl shadow-soft-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="text-xl font-bold text-hedgehog-text"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  🍽️ 먹이 주기
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-hedgehog-border/40 transition-colors"
                >
                  <X size={18} className="text-hedgehog-muted" />
                </button>
              </div>

              {foodItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="text-hedgehog-muted font-medium">
                    먹이가 없습니다!
                  </p>
                  <p className="text-sm text-hedgehog-muted/70 mt-1">
                    상점에서 먹이를 구매해주세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {foodItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onFeed(item.item_id);
                        onClose();
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl 
                                 bg-hedgehog-bg hover:bg-pastel-peach/30
                                 border-2 border-hedgehog-border hover:border-hedgehog-accent/40
                                 transition-all duration-200 text-left btn-press"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-3xl">🍎</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-hedgehog-text">
                            {item.shop_items?.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getRarityColor(
                              item.shop_items?.rarity ?? "normal"
                            )}`}
                          >
                            {getRarityLabel(item.shop_items?.rarity ?? "normal")}
                          </span>
                        </div>
                        <p className="text-sm text-hedgehog-muted">
                          점수 보너스: +{item.shop_items?.score_bonus ?? 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-hedgehog-accent">
                          x{item.quantity}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
