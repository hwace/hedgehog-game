"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  getAliveHedgehog,
  getUserAchievements,
  getAllAchievements,
  getGuestbook,
} from "@/lib/db";
import { useGameStore } from "@/store/gameStore";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AchievementBadge } from "@/components/profile/AchievementBadge";
import { Guestbook } from "@/components/profile/Guestbook";
import { Navbar } from "@/components/ui/Navbar";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useGameStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfile(id),
    enabled: !!id,
  });

  const { data: hedgehog } = useQuery({
    queryKey: ["hedgehog-profile", id],
    queryFn: () => getAliveHedgehog(id),
    enabled: !!id,
  });

  const { data: userAchievements = [] } = useQuery({
    queryKey: ["user-achievements", id],
    queryFn: () => getUserAchievements(id),
    enabled: !!id,
  });

  const { data: allAchievements = [] } = useQuery({
    queryKey: ["all-achievements"],
    queryFn: getAllAchievements,
  });

  const { data: guestbookEntries = [], refetch: refetchGuestbook } = useQuery({
    queryKey: ["guestbook", id],
    queryFn: () => getGuestbook(id),
    enabled: !!id,
  });

  if (!user) return null;

  const isOwnProfile = user.id === id;
  const achievedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  return (
    <div className="min-h-screen bg-pastel-gradient">
      <Navbar />

      <main className="max-w-md mx-auto px-4 pt-4 pb-28 space-y-5">
        {profileLoading ? (
          <motion.div
            className="h-64 bg-hedgehog-card rounded-4xl"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ) : profile ? (
          <>
            {/* Profile header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProfileHeader
                profile={profile}
                hedgehog={hedgehog ?? null}
                isOwnProfile={isOwnProfile}
              />
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3
                className="font-bold text-hedgehog-text mb-3 text-lg"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                🏅 업적
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(allAchievements ?? []).map((ach) => (
                  <AchievementBadge
                    key={ach.id}
                    achievement={ach}
                    achieved={achievedIds.has(ach.id)}
                    achievedAt={
                      userAchievements.find((ua) => ua.achievement_id === ach.id)
                        ?.achieved_at
                    }
                  />
                ))}
              </div>
            </motion.div>

            {/* Guestbook */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3
                className="font-bold text-hedgehog-text mb-3 text-lg"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                💌 방명록
              </h3>
              <Guestbook
                entries={guestbookEntries}
                ownerUserId={id}
                onRefresh={() => refetchGuestbook()}
              />
            </motion.div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-bold text-hedgehog-muted">프로필을 찾을 수 없습니다</p>
          </div>
        )}
      </main>
    </div>
  );
}
