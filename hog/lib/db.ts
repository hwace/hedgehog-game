import { supabase } from "./supabase";
import type {
  Profile,
  Hedgehog,
  ShopItem,
  InventoryItem,
  UserAchievement,
  GuestbookEntry,
  FeedResult,
  TouchResult,
  CleanResult,
  PurchaseResult,
} from "@/types";

// ── Profile ──────────────────────────────────────────────
export async function getOrCreateProfile(nickname: string): Promise<Profile> {
  const { data: existing, error: selectErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("nickname", nickname)
    .single();

  if (existing && !selectErr) return existing as Profile;

  const { data, error } = await supabase
    .from("profiles")
    .insert({ nickname })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Profile;
}

export async function getProfileByNickname(nickname: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("nickname", nickname)
    .single();
  if (error) return null;
  return data as Profile;
}

// ── Hedgehog ─────────────────────────────────────────────
export async function getAliveHedgehog(userId: string): Promise<Hedgehog | null> {
  const { data, error } = await supabase
    .from("hedgehogs")
    .select("*")
    .eq("user_id", userId)
    .eq("is_alive", true)
    .single();
  if (error) return null;
  return data as Hedgehog;
}

export async function updateHedgehogStatus(hedgehogId: string) {
  const { data, error } = await supabase.rpc("update_hedgehog_status", {
    p_hedgehog_id: hedgehogId,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function feedHedgehog(
  userId: string,
  hedgehogId: string,
  itemId: string
): Promise<FeedResult> {
  const { data, error } = await supabase.rpc("feed_hedgehog", {
    p_user_id: userId,
    p_hedgehog_id: hedgehogId,
    p_item_id: itemId,
  });
  if (error) throw new Error(error.message);
  return data as FeedResult;
}

export async function touchHedgehog(
  userId: string,
  hedgehogId: string
): Promise<TouchResult> {
  const { data, error } = await supabase.rpc("touch_hedgehog", {
    p_user_id: userId,
    p_hedgehog_id: hedgehogId,
  });
  if (error) throw new Error(error.message);
  return data as TouchResult;
}

export async function cleanPoop(
  userId: string,
  hedgehogId: string
): Promise<CleanResult> {
  const { data, error } = await supabase.rpc("clean_poop", {
    p_user_id: userId,
    p_hedgehog_id: hedgehogId,
  });
  if (error) throw new Error(error.message);
  return data as CleanResult;
}

export async function renameHedgehog(hedgehogId: string, name: string, userId: string) {
  const { error } = await supabase
    .from("hedgehogs")
    .update({ name })
    .eq("id", hedgehogId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

// ── Shop ─────────────────────────────────────────────────
export async function getShopItems(): Promise<ShopItem[]> {
  const { data, error } = await supabase
    .from("shop_items")
    .select("*")
    .order("price", { ascending: true });
  if (error) throw new Error(error.message);
  return data as ShopItem[];
}

export async function purchaseItem(
  userId: string,
  itemId: string,
  quantity: number = 1
): Promise<PurchaseResult> {
  const { data, error } = await supabase.rpc("purchase_item", {
    p_user_id: userId,
    p_item_id: itemId,
    p_quantity: quantity,
  });
  if (error) throw new Error(error.message);
  return data as PurchaseResult;
}

// ── Inventory ─────────────────────────────────────────────
export async function getInventory(userId: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select("*, shop_items(*)")
    .eq("user_id", userId)
    .gt("quantity", 0);
  if (error) throw new Error(error.message);
  return data as InventoryItem[];
}

// ── Rankings ─────────────────────────────────────────────
export async function getTopRankings(limit = 20) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nickname, best_score, current_score")
    .order("best_score", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data;
}

// ── Achievements ──────────────────────────────────────────
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data as UserAchievement[];
}

export async function getAllAchievements() {
  const { data, error } = await supabase.from("achievements").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function grantAchievement(userId: string, achievementName: string) {
  const { data, error } = await supabase.rpc("grant_achievement", {
    p_user_id: userId,
    p_achievement_name: achievementName,
  });
  if (error) throw new Error(error.message);
  return data as boolean;
}

// ── Guestbook ─────────────────────────────────────────────
export async function getGuestbook(ownerUserId: string): Promise<GuestbookEntry[]> {
  const { data, error } = await supabase
    .from("guestbook")
    .select("*, writer:profiles!guestbook_writer_user_id_fkey(id, nickname)")
    .eq("owner_user_id", ownerUserId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return data as GuestbookEntry[];
}

export async function addGuestbookEntry(
  ownerUserId: string,
  writerUserId: string | null,
  message: string
) {
  const { error } = await supabase.from("guestbook").insert({
    owner_user_id: ownerUserId,
    writer_user_id: writerUserId,
    message,
  });
  if (error) throw new Error(error.message);
}

export async function deleteGuestbookEntry(entryId: string) {
  const { error } = await supabase.from("guestbook").delete().eq("id", entryId);
  if (error) throw new Error(error.message);
}
