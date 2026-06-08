export type HedgehogMood = "happy" | "sensitive" | "angry";
export type HedgehogRarity = "normal" | "rare" | "epic" | "legendary";
export type ItemType = "food" | "decoration";

export interface Profile {
  id: string;
  nickname: string;
  coin: number;
  current_score: number;
  best_score: number;
  created_at: string;
  updated_at: string;
}

export interface Hedgehog {
  id: string;
  user_id: string;
  name: string;
  rarity: HedgehogRarity;
  mood: HedgehogMood;
  is_hungry: boolean;
  has_poop: boolean;
  is_alive: boolean;
  touch_count: number;
  last_fed_at: string | null;
  last_touched_at: string | null;
  last_cleaned_at: string | null;
  last_mood_changed_at: string;
  last_poop_generated_at: string;
  last_interaction_at: string;
  created_at: string;
  death_at: string | null;
}

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: HedgehogRarity;
  price: number;
  score_bonus: number;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  shop_items?: ShopItem;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  reward_coin: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achieved_at: string;
  achievements?: Achievement;
}

export interface Ranking {
  id: string;
  user_id: string;
  score: number;
  recorded_at: string;
  profiles?: Pick<Profile, "id" | "nickname" | "best_score">;
}

export interface GuestbookEntry {
  id: string;
  owner_user_id: string;
  writer_user_id: string | null;
  message: string;
  created_at: string;
  writer?: Pick<Profile, "id" | "nickname">;
}

export interface FeedResult {
  success: boolean;
  was_hungry?: boolean;
  score_gained?: number;
  message: string;
}

export interface TouchResult {
  success: boolean;
  mood?: HedgehogMood;
  score_gained?: number;
  touch_count?: number;
  message: string;
}

export interface CleanResult {
  success: boolean;
  coin_reward?: number;
  message: string;
}

export interface PurchaseResult {
  success: boolean;
  item_name?: string;
  quantity?: number;
  total_price?: number;
  message: string;
}
