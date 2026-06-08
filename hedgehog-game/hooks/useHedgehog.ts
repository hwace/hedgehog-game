"use client";

import { useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAliveHedgehog,
  updateHedgehogStatus,
  feedHedgehog,
  touchHedgehog,
  cleanPoop,
  getInventory,
  getProfile,
  grantAchievement,
} from "@/lib/db";
import { useGameStore } from "@/store/gameStore";

export function useHedgehog() {
  const { user, setHedgehog, hedgehog, updateUser, setInventory } = useGameStore();
  const queryClient = useQueryClient();
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch hedgehog
  const { data: hedgehogData, isLoading: hedgehogLoading } = useQuery({
    queryKey: ["hedgehog", user?.id],
    queryFn: () => getAliveHedgehog(user!.id),
    enabled: !!user?.id,
    refetchInterval: 30_000, // every 30s
  });

  // Fetch inventory
  const { data: inventoryData } = useQuery({
    queryKey: ["inventory", user?.id],
    queryFn: () => getInventory(user!.id),
    enabled: !!user?.id,
  });

  // Sync to store
  useEffect(() => {
    if (hedgehogData !== undefined) setHedgehog(hedgehogData);
  }, [hedgehogData, setHedgehog]);

  useEffect(() => {
    if (inventoryData) setInventory(inventoryData);
  }, [inventoryData, setInventory]);

  // Periodically call update_hedgehog_status (every 60s)
  useEffect(() => {
    if (!hedgehog?.id) return;
    const run = async () => {
      try {
        const result = await updateHedgehogStatus(hedgehog.id);
        if (result?.status === "died") {
          toast.error("💀 고슴도치가 사망했습니다... 새 친구가 생겼어요!");
          queryClient.invalidateQueries({ queryKey: ["hedgehog", user?.id] });
        } else {
          queryClient.invalidateQueries({ queryKey: ["hedgehog", user?.id] });
        }
        // Refresh profile for score/coin
        if (user?.id) {
          const freshProfile = await getProfile(user.id);
          if (freshProfile) updateUser(freshProfile);
        }
      } catch {
        // silent
      }
    };
    run();
    statusIntervalRef.current = setInterval(run, 60_000);
    return () => {
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    };
  }, [hedgehog?.id, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Feed
  const feedMutation = useMutation({
    mutationFn: ({ itemId }: { itemId: string }) =>
      feedHedgehog(user!.id, hedgehog!.id, itemId),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message + (result.score_gained ? ` (+${result.score_gained}점)` : ""));
        // First feed achievement
        await grantAchievement(user!.id, "첫 먹이 주기").catch(() => {});
      } else {
        toast.error(result.message);
      }
      queryClient.invalidateQueries({ queryKey: ["hedgehog", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["inventory", user?.id] });
      if (user?.id) {
        const fresh = await getProfile(user.id);
        if (fresh) updateUser(fresh);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Touch
  const touchMutation = useMutation({
    mutationFn: () => touchHedgehog(user!.id, hedgehog!.id),
    onSuccess: async (result) => {
      if (result.success) {
        const sign = (result.score_gained ?? 0) >= 0 ? "+" : "";
        toast.success(`${result.message} (${sign}${result.score_gained}점)`);
      } else {
        toast.error(result.message);
      }
      queryClient.invalidateQueries({ queryKey: ["hedgehog", user?.id] });
      if (user?.id) {
        const fresh = await getProfile(user.id);
        if (fresh) updateUser(fresh);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Clean poop
  const cleanMutation = useMutation({
    mutationFn: () => cleanPoop(user!.id, hedgehog!.id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(`${result.message} (+${result.coin_reward}코인)`);
        await grantAchievement(user!.id, "첫 청소").catch(() => {});
      } else {
        toast.error(result.message);
      }
      queryClient.invalidateQueries({ queryKey: ["hedgehog", user?.id] });
      if (user?.id) {
        const fresh = await getProfile(user.id);
        if (fresh) updateUser(fresh);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["hedgehog", user?.id] });
  }, [queryClient, user?.id]);

  return {
    hedgehog,
    hedgehogLoading,
    feed: feedMutation.mutate,
    isFeedLoading: feedMutation.isPending,
    touch: touchMutation.mutate,
    isTouchLoading: touchMutation.isPending,
    clean: cleanMutation.mutate,
    isCleanLoading: cleanMutation.isPending,
    refetch,
  };
}
