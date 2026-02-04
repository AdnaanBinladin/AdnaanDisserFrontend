"use client";


import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  User,
  AlertTriangle,
  Bell,
  LogOut,
  LayoutDashboard,
  Save,
  X,
  Edit3,
  Settings,
  Shield,
  Calendar,
  Trash2,
  CheckCircle2,
  Building2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type VerificationStatus = "pending" | "approved" | "rejected";

type NGOOrganization = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  verification_status: VerificationStatus;
  created_at?: string;
};

type NGOUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "ngo";
};

type NGOProfileResponse = {
  type: "ngo";
  user: NGOUser;
  organization: NGOOrganization;
};

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/ngo/dashboard" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications"},
  { icon: User, label: "Profile", href: "/ngo/dashboard/profile" },
  { icon: Settings, label: "Security", href: "/ngo/dashboard/security"},
];


export default function NGOProfilePage() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<NGOProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const ngoId = localStorage.getItem("ngoId");
  
    // 🔒 No NGO → force login (no silent mock data)
    if (!ngoId) {
      window.location.href = "/";
      return;
    }
  
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile?userId=${ngoId}`
        );
  
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
  
        const data: NGOProfileResponse = await res.json();
  
        // 🛑 Safety: ensure NGO + organization exists
        if (!data.organization || data.type !== "ngo") {
          throw new Error("Invalid profile data");
        }
  
        setProfile(data);
  
        // 🧩 Sync edit form with backend data
        setEditForm({
          name: data.organization.name,
          description: data.organization.description ?? "",
          address: data.organization.address ?? "",
          phone: data.organization.phone ?? "",
        });
      } catch (err) {
        console.error("❌ Profile fetch failed:", err);
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleSave = async () => {
    if (!profile?.organization || !profile?.user) return;
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${profile.organization.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editForm.name,
            description: editForm.description,
            address: editForm.address,
            phone: editForm.phone,
          }),
        }
      );
  
      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Backend error:", err);
        throw new Error(err.error || "Failed to update organization");
      }
      
  
      // 🔄 Refresh local state from editForm
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              organization: {
                ...prev.organization,
                ...editForm,
              },
            }
          : prev
      );
  
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Failed to save organization profile. Please try again.");
    }
  };
  

  const handleCancel = () => {
    if (!profile?.organization) return;
  
    setEditForm({
      name: profile.organization.name,
      description: profile.organization.description ?? "",
      address: profile.organization.address ?? "",
      phone: profile.organization.phone ?? "",
    });
  
    setIsEditing(false);
  };
  

  const handleDeleteAccount = async () => {
    if (!profile?.user) return;
  
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: profile.user.id }),
        }
      );
  
      if (!res.ok) throw new Error("Delete failed");
  
      localStorage.clear();
      window.location.href = "/";
    } catch {
      setDeleteError("Failed to delete account. Please try again.");
    }
  };
  
  
  

  const resetDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText("");
    setDeleteError("");
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.user || !profile.organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">Failed to load profile</p>
        </Card>
      </div>
    );
  }

  const { user, organization } = profile;

  const verificationStatus = organization.verification_status;
  const isVerified = verificationStatus === "approved";
  
  const verificationLabel =
    verificationStatus === "approved"
      ? "Verified"
      : verificationStatus === "rejected"
      ? "Rejected"
      : "Pending";
  
      const formatMemberSince = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      };
      
  

      const isRouteActive = (href: string) => {
        // Dashboard must be an exact match
        if (href === "/ngo/dashboard") {
          return pathname === "/ngo/dashboard";
        }
      
        // All other routes can use startsWith
        return pathname.startsWith(href);
      };
      
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">FoodShare</span>
          </div>
        </div>

        {/* Navigation */}
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

        {/* Sign Out */}
        <div className="p-4 border-t border-border">
  <button
    type="button"
    onClick={() => {
      localStorage.clear();
      router.replace("/");
    }}
    className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
  >
    <LogOut className="w-5 h-5" />
    <span className="font-medium">Sign Out</span>
  </button>
</div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header Banner */}
        <div className="relative h-40 bg-gradient-to-r from-primary via-primary/90 to-amber-500 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute bottom-6 left-8 flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-3">
                {organization.name}
                <Badge
  className={
    verificationStatus === "approved"
      ? "bg-white/20 text-white border-white/30"
      : verificationStatus === "rejected"
      ? "bg-destructive/80 text-white border-destructive"
      : "bg-amber-400/80 text-black border-amber-500"
  }
>
  <ShieldCheck className="w-3 h-3 mr-1" />
  {verificationLabel}
</Badge>

              </h1>
              <p className="text-primary-foreground/80">Manage your organization details and verification status</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 -mt-12 pb-12">
          {/* NGO Profile Card */}
          <Card className="relative mb-8 overflow-visible shadow-xl">
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Logo / Avatar */}
                <div className="relative -mt-12">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-amber-500 p-1 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                      <Building2 className="w-14 h-14 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Organization Info / Edit Form */}
                <div className="flex-1 py-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground">Edit Organization</h2>
                        <Badge
  className={
    verificationStatus === "approved"
      ? "bg-secondary text-secondary-foreground"
      : verificationStatus === "rejected"
      ? "bg-destructive text-destructive-foreground"
      : "bg-amber-400 text-amber-900"
  }
>
  {verificationLabel}
</Badge>

                      </div>

                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="org_name" className="text-sm font-medium text-foreground">
                            Organization Name
                          </Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="org_name"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="pl-10"
                              placeholder="Enter organization name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-sm font-medium text-foreground">
                            Address
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="address"
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              className="pl-10"
                              placeholder="Enter address"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="org_phone" className="text-sm font-medium text-foreground">
                            Organization Phone
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="org_phone"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="pl-10"
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-sm font-medium text-foreground">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Describe your organization's mission..."
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-foreground">{organization.name}</h2>
                          <Badge
  className={
    verificationStatus === "approved"
      ? "bg-secondary text-secondary-foreground"
      : verificationStatus === "rejected"
      ? "bg-destructive text-destructive-foreground"
      : "bg-amber-400 text-amber-900"
  }
>
  {verificationLabel}
</Badge>

                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Address</p>
                            <p className="text-foreground font-medium">{organization.address || "Address not provided"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-foreground font-medium">{organization.phone || "Phone not provided"}</p>
                          </div>
                        </div>

                        {organization.description && (
                          <p className="text-sm text-muted-foreground mt-4 p-4 rounded-xl bg-muted/50">
                            {organization.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="shadow-lg mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                Account Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p
  className={`text-lg font-semibold ${
    verificationStatus === "approved"
      ? "text-secondary"
      : verificationStatus === "rejected"
      ? "text-destructive"
      : "text-amber-600"
  }`}
>
  {verificationLabel}
</p>

                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-semibold text-foreground">{formatMemberSince(organization.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="text-lg font-semibold text-primary">NGO</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NGO Administrator */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                NGO Administrator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium">{user.phone || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-foreground font-medium">NGO</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone - Delete Account */}
          <Card className="shadow-lg border-destructive/30">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-destructive flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </h2>
              <p className="text-muted-foreground mb-4">
                Deleting this NGO account is permanent. All claims, donation history, and organization data will be removed.
              </p>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete NGO Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={resetDeleteModal}>
      <DialogContent className="sm:max-w-md">
  <DialogHeader>
    <DialogTitle className="flex items-center gap-2 text-destructive">
      <AlertTriangle className="w-5 h-5" />
      Delete NGO Account
    </DialogTitle>
    <DialogDescription>
      This action cannot be undone. This will permanently delete your NGO account,
      all claims, and organization data.
    </DialogDescription>
  </DialogHeader>

  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="confirm-delete" className="text-sm font-medium">
        Type <span className="font-bold text-destructive">DELETE</span> to confirm
      </Label>
      <Input
        id="confirm-delete"
        value={deleteConfirmText}
        onChange={(e) => setDeleteConfirmText(e.target.value)}
        placeholder="Type DELETE here"
        className="border-destructive/50 focus-visible:ring-destructive"
      />
    </div>

    {deleteError && (
      <p className="text-sm text-destructive flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        {deleteError}
      </p>
    )}
  </div>

  <div className="flex gap-3 justify-end">
    <Button variant="outline" onClick={resetDeleteModal}>
      Cancel
    </Button>
    <Button
      variant="destructive"
      onClick={handleDeleteAccount}
      className="bg-destructive hover:bg-destructive/90"
    >
      Delete My Account
    </Button>
  </div>
</DialogContent>

      </Dialog>
    </div>
  );
}
