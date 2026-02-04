"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

/* ================= Sidebar Items (DONOR) ================= */
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/donor/dashboard" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" }, // ✅ shared
  { icon: User, label: "Profile", href: "/donor/dashboard/profile" },
  { icon: ShieldCheck, label: "Security", href: "/donor/dashboard/security" },
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

  /* ================= Helpers ================= */
  const isRouteActive = (href: string) => {
    if (href === "/donor/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must contain an uppercase letter";
    if (!/[a-z]/.test(password)) return "Must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Must contain a number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Must contain a special character";
    return "";
  };

  const handleBlur = (field: keyof typeof form) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    setErrors((prev) => ({
      ...prev,
      [field]:
        field === "currentPassword"
          ? form.currentPassword
            ? ""
            : "Current password is required"
          : field === "newPassword"
          ? validatePassword(form.newPassword)
          : form.confirmPassword !== form.newPassword
          ? "Passwords do not match"
          : "",
    }));
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (!touched[field]) return;

    setErrors((prev) => ({
      ...prev,
      [field]:
        field === "newPassword"
          ? validatePassword(value)
          : field === "confirmPassword" && value !== form.newPassword
          ? "Passwords do not match"
          : "",
    }));
  };

  const isFormValid =
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword &&
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.confirmPassword;

  /* ================= Submit ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (form.currentPassword === form.newPassword) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "New password must be different from current password",
      });
      return;
    }

    try {
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

      const data = await res.json();

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Password change failed",
          description: data.error || "Request failed",
        });
        return;
      }

      sessionStorage.setItem("pending_new_password", form.newPassword);

      toast({
        title: "Verification code sent",
        description: "Check your email to continue",
      });

      router.push("/donor/dashboard/security/verify");
    } catch {
      toast({
        variant: "destructive",
        title: "Server error",
        description: "Something went wrong. Please try again.",
      });
    }
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
      <main className="flex-1 ml-64 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Change Password
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                For your safety, confirm your current password
              </p>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordField
                  label="Current Password"
                  value={form.currentPassword}
                  show={showCurrentPassword}
                  setShow={setShowCurrentPassword}
                  onChange={(v) => handleChange("currentPassword", v)}
                  onBlur={() => handleBlur("currentPassword")}
                  error={errors.currentPassword}
                  touched={touched.currentPassword}
                />

                <PasswordField
                  label="New Password"
                  value={form.newPassword}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                  onChange={(v) => handleChange("newPassword", v)}
                  onBlur={() => handleBlur("newPassword")}
                />

                <PasswordField
                  label="Confirm Password"
                  value={form.confirmPassword}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  onChange={(v) => handleChange("confirmPassword", v)}
                  onBlur={() => handleBlur("confirmPassword")}
                />

                {/* Password Requirements */}
<div className="bg-muted/50 rounded-lg p-4">
  <p className="text-sm font-medium mb-2">
    Password must contain:
  </p>

  <ul className="text-sm space-y-1 text-muted-foreground">
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

    <li
      className={
        /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)
          ? "text-secondary"
          : ""
      }
    >
      - One special character (!@#$%^&*)
    </li>
  </ul>
</div>


                <Button type="submit" className="w-full" disabled={!isFormValid}>
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

/* ================= Reusable Password Field ================= */
function PasswordField({
  label,
  value,
  show,
  setShow,
  onChange,
  onBlur,
  error,
  touched,
}: {
  label: string;
  value: string;
  show: boolean;
  setShow: (v: boolean) => void;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {error && touched && (
        <p className="text-sm text-destructive flex gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
