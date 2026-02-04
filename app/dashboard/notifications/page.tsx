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
    const userId = localStorage.getItem("userId");

    if (ngoId) {
      setRole("ngo");
      setUserId(ngoId);
    } else if (donorId) {
      setRole("donor");
      setUserId(donorId);
    } else if (userId) {
      setUserId(userId);
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
          {
            icon: ShieldCheck,
            label: "Security",
            href: "/ngo/dashboard/security",
          },
        ]
      : [
          { icon: LayoutDashboard, label: "Dashboard", href: "/donor/dashboard" },
          {
            icon: Bell,
            label: "Notifications",
            href: "/dashboard/notifications",
          },
          { icon: User, label: "Profile", href: "/donor/dashboard/profile" },
          {
            icon: ShieldCheck,
            label: "Security",
            href: "/donor/dashboard/security",
          },
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

  const isRouteActive = (href: string) => pathname.startsWith(href);

  /* ================= Actions ================= */
  const handleMarkAllAsRead = async () => {
    if (!userId || unreadCount === 0) return;

    await markAllAsRead(userId);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleMarkSingleAsRead = async (notifId: string) => {
    await markOneAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId ? { ...n, read: true } : n
      )
    );
  };

  /* ================= Render ================= */
  return (
    <div className="min-h-screen bg-background flex">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border font-bold text-xl">
          FoodShare
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isRouteActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary">
              <Bell className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground text-sm">
                Stay updated with platform activity
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">
              All <Badge className="ml-2">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : filteredNotifications.length === 0 ? (
              <p className="text-muted-foreground">No notifications</p>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((n) => (
                  <Card
                    key={n.id}
                    onClick={() => !n.read && handleMarkSingleAsRead(n.id)}
                    className={`p-4 cursor-pointer transition ${
                      n.read ? "opacity-60" : "bg-muted hover:bg-muted/70"
                    }`}
                  >
                    <div className="font-medium">{n.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {n.message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
