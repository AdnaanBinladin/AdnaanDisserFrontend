"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BellAnimation from "@/public/animations/bell-notification.json"; // 🔔 active bell
import NoNotif from "@/public/animations/no-notif.json"; // 📭 empty animation
import { getNotifications, markAllAsRead } from "@/lib/notifications";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [userId, setUserId] = useState<string>(""); // ✅ default to empty string

  // 🔹 Load donorId from localStorage once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("donorId") || "";
      setUserId(stored);
    }
  }, []);
  
  // 🔹 Fetch notifications periodically
  useEffect(() => {
    if (!userId) return; // ✅ ensures userId is a valid string

    async function fetchNotifications() {
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
        const hasUnread = data.some((n: any) => !n.read);
        setIsAnimating(hasUnread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [userId]);

  // 🔔 Unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🟢 Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!userId) return; // ✅ prevents calling with empty string
    try {
      setIsMarking(true);
      await markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setIsAnimating(false);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div id="notification-bell" className="relative">
      {/* 🔔 Animated Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center"
        title="Notifications"
      >
        <div className="h-14 w-14 bg-white rounded-full shadow-lg border border-orange-200 flex items-center justify-center hover:scale-105 transition-transform">
          <Lottie
            animationData={isAnimating ? BellAnimation : NoNotif}
            loop
            autoplay
            style={{ height: 48, width: 48 }}
          />
        </div>

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-red-500 w-3.5 h-3.5 rounded-full animate-pulse" />
        )}
      </button>

      {/* 📬 Dropdown Card */}
      {open && (
        <Card className="absolute right-0 mt-4 w-80 bg-white border border-orange-200 shadow-xl rounded-lg overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 via-red-50 to-green-50 border-b border-orange-100">
            <span className="font-semibold text-orange-700">
              Notifications ({notifications.length})
            </span>
            {notifications.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-orange-300 hover:bg-orange-100"
                onClick={handleMarkAllAsRead}
                disabled={isMarking}
              >
                {isMarking ? "Marking..." : "Mark all as read"}
              </Button>
            )}
          </div>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center transition-all">
              <Lottie animationData={NoNotif} loop={false} className="w-36 h-36 mb-2" />
              <p className="text-gray-500 text-sm">No new notifications</p>
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-orange-100">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 transition-all ${
                    n.read ? "opacity-60" : "bg-orange-50 hover:bg-orange-100"
                  }`}
                >
                  <div className="text-sm font-medium text-orange-800">{n.title}</div>
                  <div className="text-xs text-gray-600">{n.message}</div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
