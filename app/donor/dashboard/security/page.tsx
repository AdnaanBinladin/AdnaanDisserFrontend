"use client";

import React from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  AlertCircle,
  User,
  Bell,
  LogOut,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

/* ================= Sidebar Items ================= */
const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/donor/dashboard",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/donor/dashboard/notifications",
    badge: 3,
  },
  {
    icon: User,
    label: "Profile",
    href: "/donor/dashboard/profile",
  },
  {
    icon: ShieldCheck,
    label: "Security",
    href: "/donor/dashboard/security",
  },
];

export default function ChangePasswordPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleBlur = (field: keyof typeof form) => {
    setTouched({ ...touched, [field]: true });

    const newErrors = { ...errors };

    if (field === "currentPassword" && !form.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    } else if (field === "currentPassword") {
      newErrors.currentPassword = "";
    }

    if (field === "newPassword") {
      newErrors.newPassword = validatePassword(form.newPassword);
    }

    if (field === "confirmPassword") {
      if (form.confirmPassword !== form.newPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        newErrors.confirmPassword = "";
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });

    if (touched[field]) {
      const newErrors = { ...errors };

      if (field === "currentPassword") {
        newErrors.currentPassword = value ? "" : "Current password is required";
      }

      if (field === "newPassword") {
        newErrors.newPassword = validatePassword(value);
        if (form.confirmPassword && form.confirmPassword !== value) {
          newErrors.confirmPassword = "Passwords do not match";
        } else if (form.confirmPassword === value) {
          newErrors.confirmPassword = "";
        }
      }

      if (field === "confirmPassword") {
        newErrors.confirmPassword =
          value !== form.newPassword ? "Passwords do not match" : "";
      }

      setErrors(newErrors);
    }
  };

  const isFormValid =
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword &&
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.confirmPassword;

    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
      
        const token = localStorage.getItem("token");
      
        const res = await fetch(
          "http://localhost:5050/api/profile/password/request",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              current_password: form.currentPassword,
              new_password: form.newPassword,
            }),
          }
        );
      
        const text = await res.text();
console.log("🔍 Password change raw response:", text);

let data;
try {
  data = JSON.parse(text);
} catch {
  alert("Server error occurred. Check console.");
  return;
}

      
        if (!res.ok) {
          alert(data.error || "Failed to send verification code");
          return;
        }
      
        // 🔐 store temporarily for OTP step
        sessionStorage.setItem("pending_new_password", form.newPassword);
      
        router.push("/settings/change-password/verify");
      };
      

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(form.newPassword);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-destructive",
    "bg-orange-500",
    "bg-amber-500",
    "bg-secondary",
    "bg-secondary",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border font-bold text-xl">
          FoodShare
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>

                    {item.badge && (
                      <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              router.replace("/login");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 ml-64 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Change Password
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                For your safety, confirm your current password
              </p>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={form.currentPassword}
                      onChange={(e) =>
                        handleChange("currentPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("currentPassword")}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.currentPassword && touched.currentPassword && (
                    <p className="text-sm text-destructive flex gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={form.newPassword}
                      onChange={(e) =>
                        handleChange("newPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("newPassword")}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("confirmPassword")}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
{/* Password Requirements */}
<div className="bg-muted/50 rounded-lg p-4">
  <p className="text-sm font-medium text-foreground mb-2">
    Password must contain:
  </p>
  <ul className="text-sm text-muted-foreground space-y-1">
    <li className={form.newPassword.length >= 8 ? "text-secondary" : ""}>
      - At least 8 characters
    </li>
    <li className={/[A-Z]/.test(form.newPassword) ? "text-secondary" : ""}>
      - One uppercase letter
    </li>
    <li className={/[a-z]/.test(form.newPassword) ? "text-secondary" : ""}>
      - One lowercase letter
    </li>
    <li className={/[0-9]/.test(form.newPassword) ? "text-secondary" : ""}>
      - One number
    </li>
  </ul>
</div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
              
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
