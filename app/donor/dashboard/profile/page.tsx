"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react"
import ProfilePersonsAnimation from "@/public/animations/profile_persons.json"

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Bell,
  LogOut,
  LayoutDashboard,
  Save,
  X,
  Edit3,
  Shield,
} from "lucide-react";

/* ============================
   TYPES
============================ */

type DonorUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "donor";
};

type DonorProfileResponse = {
  type: "donor";
  user: DonorUser;
};

type DonationActivity = {
  id: string;
  title: string;
  status: "completed" | "available" | "expired";
  location: string;
  created_at: string;
};

/* ============================
   COMPONENT
============================ */

export default function DonorProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<DonorProfileResponse | null>(null);
  const [activity, setActivity] = useState<DonationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  /* ============================
     AUTH + DATA FETCH
  ============================ */

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    // 🔒 Guard
    if (!userId || role !== "donor") {
      router.replace("/login");
      return;
    }

    // 👤 Fetch profile
    fetch(`http://localhost:5050/api/profile?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile fetch failed");
        return res.json();
      })
      .then((data: DonorProfileResponse) => {
        setProfile(data);
        setEditForm({
          full_name: data.user.full_name,
          email: data.user.email,
          phone: data.user.phone || "",
        });
      })
      .catch(() => {
        router.replace("/login");
      });

    // 📦 Fetch activity (optional backend endpoint)
    fetch(`http://localhost:5050/api/donations?donorId=${userId}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setActivity)
      .catch(() => setActivity([]))
      .finally(() => setLoading(false));

  }, [router]);

  /* ============================
     EDIT HANDLERS
  ============================ */

  const handleSave = async () => {
    if (!profile) return;
  
    try {
      const res = await fetch("http://localhost:5050/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.user.id,
          full_name: editForm.full_name,
          email: editForm.email,
          phone: editForm.phone,
        }),
      });
  
      if (!res.ok) {
        throw new Error("Update failed");
      }
  
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          ...editForm,
        },
      });
  
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save profile. Try again.");
    }
  };
  

  const handleCancel = () => {
    if (!profile) return;

    setEditForm({
      full_name: profile.user.full_name,
      email: profile.user.email,
      phone: profile.user.phone || "",
    });

    setIsEditing(false);
  };

  /* ============================
     STATES
  ============================ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
    );
  }

  const { user } = profile;

  /* ============================
     RENDER
  ============================ */

  return (
    <div className="min-h-screen bg-background flex">

      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-card border-r fixed h-full flex flex-col">
        <div className="p-6 border-b font-bold text-xl">FoodShare</div>

        <nav className="flex-1 p-4 space-y-2">
          <a className="flex gap-3 p-3 rounded-xl hover:bg-muted" href="/donor/dashboard">
            <LayoutDashboard /> Dashboard
          </a>
          <a className="flex gap-3 p-3 rounded-xl hover:bg-muted" href="/donor/dashboard/notifications">
            <Bell /> Notifications
          </a>
          <a className="flex gap-3 p-3 rounded-xl bg-primary text-white">
            <User /> Profile
          </a>
          <a className="flex gap-3 p-3 rounded-xl hover:bg-muted" href="/donor/dashboard/security">
            <Shield /> Security
          </a>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              localStorage.clear();
              router.replace("/");
            }}
            className="flex gap-3 w-full p-3 rounded-xl hover:bg-destructive/10 text-destructive"
          >
            <LogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* ================= Main ================= */}
      <main className="flex-1 ml-64">

        {/* Header */}
        <div className="h-40 bg-gradient-to-r from-primary to-secondary flex items-end p-8 text-white">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="max-w-4xl mx-auto px-8 -mt-10 space-y-8">

          {/* Profile Card */}
          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <div className="flex gap-6 items-start">

              <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
  <Lottie
    animationData={ProfilePersonsAnimation}
    loop
    autoplay
    style={{ width: 80, height: 80 }}
  />
</div>


                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Label>Full Name</Label>
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      />

                      <Label>Email</Label>
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />

                      <Label>Phone</Label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />

                      <div className="flex gap-3">
                        <Button onClick={handleSave}><Save className="mr-2" /> Save</Button>
                        <Button variant="outline" onClick={handleCancel}><X className="mr-2" /> Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">{user.full_name}</h2>
                        <Badge>Donor</Badge>
                      </div>

                      <p className="flex gap-2 text-muted-foreground"><Mail /> {user.email}</p>
                      {user.phone && <p className="flex gap-2 text-muted-foreground"><Phone /> {user.phone}</p>}

                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="mr-2" /> Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-bold flex gap-2"><Clock /> Recent Activity</h2>

              {activity.length === 0 && (
                <p className="text-muted-foreground text-sm">No recent donations yet.</p>
              )}

              {activity.map((a) => (
                <div key={a.id} className="flex justify-between p-4 bg-muted rounded-xl">
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-sm text-muted-foreground flex gap-2">
                      <MapPin className="w-3 h-3" /> {a.location}
                    </p>
                  </div>
                  <Badge>{a.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
