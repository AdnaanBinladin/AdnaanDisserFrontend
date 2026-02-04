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
  CheckCircle2,
  AlertTriangle,
  Bell,
  LogOut,
  LayoutDashboard,
  Save,
  X,
  Edit3,
  Shield,
  Calendar,
  UserCheck,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ============================
   TYPES
============================ */

type DonorUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "donor";
  status: "active" | "inactive" | "suspended";
};


type DonorProfileResponse = {
  type: "donor";
  user: DonorUser;
};



/* ============================
   COMPONENT
============================ */

export default function DonorProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<DonorProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");


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
      })
      .finally(() => setLoading(false));

  }, [router]);

  /* ============================
     EDIT HANDLERS
  ============================ */
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5050/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile?.user.id }),
      });
  
      if (!res.ok) {
        throw new Error("Delete failed");
      }
  
      // ✅ Success
      localStorage.clear();
      router.replace("/");
    } catch (err) {
      setDeleteError("Failed to delete account. Please try again.");
    }
  };
  
  


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
          <a className="flex gap-3 p-3 rounded-xl hover:bg-muted" href="/dashboard/notifications">
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
  {/* Name + Badge + Edit button */}
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-3">
      <h2 className="text-2xl font-bold">{user.full_name}</h2>
      <Badge className="bg-primary text-primary-foreground">
        Donor
      </Badge>
    </div>

    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsEditing(true)}
      className="border-primary text-primary hover:bg-primary hover:text-white"
    >
      <Edit3 className="w-4 h-4 mr-2" />
      Edit Profile
    </Button>
  </div>

  {/* Email */}
  <div className="flex items-center gap-3 text-muted-foreground mb-2">
    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
      <Mail className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs">Email</p>
      <p className="font-medium text-foreground">{user.email}</p>
    </div>
  </div>

  {/* Phone */}
  {user.phone && (
    <div className="flex items-center gap-3 text-muted-foreground">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
        <Phone className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs">Phone</p>
        <p className="font-medium text-foreground">{user.phone}</p>
      </div>
    </div>
  )}
</div>

                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                Account Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Account Status */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-100">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <p className="font-semibold text-green-700">
  {profile ? "Active" : "Inactive"}
</p>

                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-semibold">
  {new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}
</p>

                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10">
                  <UserCheck className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-semibold text-primary">
  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
</p>

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/40">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-destructive flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </h2>

              <p className="text-muted-foreground mb-4">
                Deleting your account is permanent. All donations and personal data will be removed.
              </p>

              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>


        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Type <strong>DELETE</strong> to confirm account deletion.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={deleteConfirmText}
            onChange={(e) => {
              setDeleteConfirmText(e.target.value);
              setDeleteError("");
            }}
            placeholder="Type DELETE"
            className="border-destructive"
          />

          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmText("");
              setDeleteError("");
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete My Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
