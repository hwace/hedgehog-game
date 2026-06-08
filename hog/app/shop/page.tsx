"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getShopItems, purchaseItem, getInventory, getProfile } from "@/lib/db";
import { useGameStore } from "@/store/gameStore";
import { ShopCard } from "@/components/shop/ShopCard";
import { Navbar } from "@/components/ui/Navbar";
import { formatCoin } from "@/utils";

export default function ShopPage() {
  const router = useRouter();
  const { user, updateUser } = useGameStore();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "food" | "decoration">("all");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["shop-items"],
    queryFn: getShopItems,
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory", user?.id],
    queryFn: () => getInventory(user!.id),
    enabled: !!user?.id,
  });

  const purchaseMutation = useMutation({
    mutationFn: ({ itemId }: { itemId: string }) =>
      purchaseItem(user!.id, itemId, 1),
    onMutate: ({ itemId }) => setBuyingId(itemId),
    onSuccess: async (result) => {
      setBuyingId(null);
      if (result.success) {
        toast.success(`🛍️ ${result.message} (-${result.total_price}코인)`);
        queryClient.invalidateQueries({ queryKey: ["inventory", user?.id] });
        const fresh = await getProfile(user!.id);
        if (fresh) updateUser(fresh);
      } else {
        toast.error(result.message);
      }
    },
    onError: (e: Error) => {
      setBuyingId(null);
      toast.error(e.message);
    },
  });

  if (!user) return null;

  const filteredItems = items.filter(
    (item) => filter === "all" || item.type === filter
  );

  const getOwnedQty = (itemId: string) =>
    inventory.find((inv) => inv.item_id === itemId)?.quantity ?? 0;

  return (
    <div className="min-h-screen bg-pastel-gradient">
      <Navbar />

      <main className="max-w-md mx-auto px-4 pt-4 pb-28">
        {/* Header */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-2xl font-bold text-hedgehog-text"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            🛒 상점
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-hedgehog-muted">보유 코인:</span>
            <span className="font-bold text-yellow-700">
              🪙 {formatCoin(user.coin)}
            </span>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "food", "decoration"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all
                          ${filter === f
                            ? "bg-hedgehog-accent text-white shadow-soft"
                            : "bg-hedgehog-card text-hedgehog-muted border border-hedgehog-border"
                          }`}
            >
              {f === "all" ? "전체" : f === "food" ? "🍎 먹이" : "🎀 장식"}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="h-44 bg-hedgehog-card rounded-3xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <ShopCard
                  item={item}
                  quantity={getOwnedQty(item.id)}
                  userCoin={user.coin}
                  onBuy={(itemId) => purchaseMutation.mutate({ itemId })}
                  isBuying={buyingId === item.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
