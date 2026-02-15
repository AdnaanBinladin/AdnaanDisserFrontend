"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  LayoutDashboard,
  User,
  ShieldCheck,
  LogOut,
  Leaf,
  Clock,
  Inbox,
} from "lucide-react";

import {
  getNotifications,
  markAllAsRead,
  markOneAsRead,
} from "@/lib/notifications";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

/* ================= Types ================= */
interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

/* ================= Component ================= */
export default function NotificationsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"ngo" | "donor" | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= Detect role + user ================= */
  useEffect(() => {
    const ngoId = localStorage.getItem("ngoId");
    const donorId = localStorage.getItem("donorId");
    const genericUserId = localStorage.getItem("userId");

    if (ngoId) {
      setRole("ngo");
      setUserId(ngoId);
    } else if (donorId) {
      setRole("donor");
      setUserId(donorId);
    } else if (genericUserId) {
      setUserId(genericUserId);
    } else {
      router.replace("/");
    }
  }, [router]);

  /* ================= Sidebar Items ================= */
  const sidebarItems =
    role === "ngo"
      ? [
          { icon: LayoutDashboard, label: "Dashboard", href: "/ngo/dashboard" },
          { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
          { icon: User, label: "Profile", href: "/ngo/dashboard/profile" },
          { icon: ShieldCheck, label: "Security", href: "/ngo/dashboard/security" },
        ]
      : [
          { icon: LayoutDashboard, label: "Dashboard", href: "/donor/dashboard" },
          { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
          { icon: User, label: "Profile", href: "/donor/dashboard/profile" },
          { icon: ShieldCheck, label: "Security", href: "/donor/dashboard/security" },
        ];

  /* ================= Fetch notifications ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  /* ================= Helpers ================= */
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "read") return n.read;
    return true;
  });

  const isRouteActive = (href: string) => {
    if (href === "/ngo/dashboard" || href === "/donor/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ================= Actions ================= */
  const handleMarkAllAsRead = async () => {
    if (!userId || unreadCount === 0) return;
    await markAllAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkSingleAsRead = async (notifId: string) => {
    await markOneAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  /* ================= Render ================= */
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B35]">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-[#FF6B35]">FoodShare</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isRouteActive(item.href)
                      ? "bg-[#FF6B35] text-white shadow-md"
                      : "text-muted-foreground hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.label === "Notifications" && unreadCount > 0 && (
                    <span className="ml-auto bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              localStorage.clear();
              router.replace("/");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-r from-[#FF6B35] via-[#F7C948] to-[#4CAF50] overflow-hidden">
          <div className="absolute bottom-6 left-8 flex items-center gap-4">
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/20">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <p className="text-white/80">
                Stay updated with platform activity
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 -mt-8 pb-12">
          {/* Tabs */}
          <Card className="mb-6 shadow-xl border-[#FF6B35]/15">
            <div className="p-4 flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="bg-[#FF6B35]/5 border border-[#FF6B35]/15">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>
              </Tabs>

              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="border-[#FF6B35] text-[#FF6B35]"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
          </Card>

          {/* Notifications */}
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading notifications…
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center border-[#FF6B35]/15">
              <Inbox className="mx-auto mb-4 w-8 h-8 text-[#FF6B35]/50" />
              <p className="font-semibold">No notifications</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((n) => (
                <Card
                  key={n.id}
                  onClick={() => !n.read && handleMarkSingleAsRead(n.id)}
                  className={`p-5 cursor-pointer transition-all ${
                    n.read
                      ? "opacity-70"
                      : "bg-[#FFF8F0] border-l-4 border-l-[#FF6B35]"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{n.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {n.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(n.created_at)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
