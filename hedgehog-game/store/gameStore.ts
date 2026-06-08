import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Hedgehog, InventoryItem } from "@/types";

interface GameState {
  // Auth
  user: Profile | null;
  setUser: (user: Profile | null) => void;
  updateUser: (partial: Partial<Profile>) => void;

  // Hedgehog
  hedgehog: Hedgehog | null;
  setHedgehog: (hedgehog: Hedgehog | null) => void;
  updateHedgehog: (partial: Partial<Hedgehog>) => void;

  // Inventory
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;

  // Logout
  logout: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      hedgehog: null,
      setHedgehog: (hedgehog) => set({ hedgehog }),
      updateHedgehog: (partial) =>
        set((state) => ({
          hedgehog: state.hedgehog ? { ...state.hedgehog, ...partial } : null,
        })),

      inventory: [],
      setInventory: (inventory) => set({ inventory }),

      logout: () => set({ user: null, hedgehog: null, inventory: [] }),
    }),
    {
      name: "hedgehog-game-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
