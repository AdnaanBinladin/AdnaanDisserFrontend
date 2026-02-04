"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

import BellAnimation from "@/public/animations/bell-notification.json";
import NoNotif from "@/public/animations/no-notif.json";
import { getNotifications } from "@/lib/notifications";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function NotificationBell() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  /* ================= Load userId (NGO or Donor) ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUserId =
      localStorage.getItem("userId") ||
      localStorage.getItem("ngoId") ||
      localStorage.getItem("donorId");

    setUserId(storedUserId);
  }, []);

  /* ================= Fetch notifications ================= */
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const data: Notification[] = await getNotifications(userId);

        if (!isMounted) return;

        setNotifications(data);
        setIsAnimating(data.some((n) => !n.read));
      } catch (err) {
        console.error("❌ Notification fetch failed:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  /* ================= Derived ================= */
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ================= Render ================= */
  return (
    <div className="relative">
      {/* 🔔 Bell → ALWAYS redirect to notifications page */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/notifications")}
        title="Notifications"
        className="relative"
      >
        <div className="h-12 w-12 rounded-full bg-white border shadow flex items-center justify-center hover:scale-105 transition">
          <Lottie
            animationData={isAnimating ? BellAnimation : NoNotif}
            loop
            autoplay
            style={{ width: 36, height: 36 }}
          />
        </div>

        {/* 🔴 Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
