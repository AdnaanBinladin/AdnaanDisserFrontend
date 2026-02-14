"use client";

import Link from "next/link";
import React, { useState } from "react";
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
  Leaf,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

/* ================= Sidebar Items ================= */
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/ngo/dashboard" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: User, label: "Profile", href: "/ngo/dashboard/profile" },
  { icon: ShieldCheck, label: "Security", href: "/ngo/dashboard/security" },
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

  /* ================= Validation (UNCHANGED) ================= */
  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const handleBlur = (field: keyof typeof form) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = { ...errors };

    if (field === "currentPassword") {
      newErrors.currentPassword = form.currentPassword
        ? ""
        : "Current password is required";
    }

    if (field === "newPassword") {
      newErrors.newPassword = validatePassword(form.newPassword);
    }

    if (field === "confirmPassword") {
      newErrors.confirmPassword =
        form.confirmPassword !== form.newPassword
          ? "Passwords do not match"
          : "";
    }

    setErrors(newErrors);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });

    if (!touched[field]) return;

    const newErrors = { ...errors };

    if (field === "currentPassword") {
      newErrors.currentPassword = value ? "" : "Current password is required";
    }

    if (field === "newPassword") {
      newErrors.newPassword = validatePassword(value);
      newErrors.confirmPassword =
        form.confirmPassword && value !== form.confirmPassword
          ? "Passwords do not match"
          : "";
    }

    if (field === "confirmPassword") {
      newErrors.confirmPassword =
        value !== form.newPassword ? "Passwords do not match" : "";
    }

    setErrors(newErrors);
  };

  const isFormValid =
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword &&
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.confirmPassword;

  /* ================= Submit (UNCHANGED) ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (form.currentPassword === form.newPassword) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "New password must be different from your current password",
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
          description: data.error || "Failed to send verification code",
        });
        return;
      }

      sessionStorage.setItem("pending_new_password", form.newPassword);

      toast({
        title: "Verification code sent",
        description: "Check your email to continue",
      });

      router.push("/ngo/dashboard/security/verify");
    } catch {
      toast({
        variant: "destructive",
        title: "Server error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const isRouteActive = (href: string) => {
    if (href === "/ngo/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  /* ================= Render ================= */
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FFF8F0" }}>
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#FF6B35]/10 flex flex-col fixed h-full">
        <div className="p-6 border-b border-[#FF6B35]/10">
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
                      : "text-gray-500 hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#FF6B35]/10">
          <button
            onClick={() => {
              localStorage.clear();
              router.replace("/");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-[#FF6B35]/15 overflow-hidden p-0">
            <div className="h-10 bg-gradient-to-r from-[#FF6B35] via-[#F7C948] to-[#4CAF50]" />

            <CardHeader className="text-center pt-8 pb-2">
              <div className="w-16 h-16 rounded-full bg-[#FF6B35]/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Change Password
              </CardTitle>
              <p className="text-gray-500 mt-2">
                For your safety, confirm your current password
              </p>
            </CardHeader>

            <CardContent className="pt-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordField
                  label="Current Password"
                  value={form.currentPassword}
                  show={showCurrentPassword}
                  setShow={setShowCurrentPassword}
                  onChange={(v: string) => handleChange("currentPassword", v)}
                  onBlur={() => handleBlur("currentPassword")}
                  error={errors.currentPassword}
                  touched={touched.currentPassword}
                />

                <PasswordField
                  label="New Password"
                  value={form.newPassword}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                  onChange={(v: string) => handleChange("newPassword", v)}
                  onBlur={() => handleBlur("newPassword")}
                />

                <PasswordField
                  label="Confirm Password"
                  value={form.confirmPassword}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  onChange={(v: string) => handleChange("confirmPassword", v)}
                  onBlur={() => handleBlur("confirmPassword")}
                />

                <div className="rounded-lg p-4 border border-[#FF6B35]/15 bg-[#FFF8F0]">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Password must contain:
                  </p>
                  <ul className="text-sm space-y-1">
                    <RequirementItem met={form.newPassword.length >= 8} text="At least 8 characters" />
                    <RequirementItem met={/[A-Z]/.test(form.newPassword)} text="One uppercase letter" />
                    <RequirementItem met={/[a-z]/.test(form.newPassword)} text="One lowercase letter" />
                    <RequirementItem met={/[0-9]/.test(form.newPassword)} text="One number" />
                    <RequirementItem
                      met={/[!@#$%^&*(),.?\":{}|<>]/.test(form.newPassword)}
                      text="One special character (!@#$%^&*)"
                    />
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full text-white font-semibold"
                  style={{
                    background: isFormValid
                      ? "linear-gradient(to right, #FF6B35, #F7C948)"
                      : undefined,
                  }}
                >
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

/* Requirement item */
function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-2 ${met ? "text-[#4CAF50]" : "text-gray-400"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${met ? "bg-[#4CAF50]" : "bg-gray-300"}`} />
      {text}
    </li>
  );
}

/* Password field */
function PasswordField({
  label,
  value,
  show,
  setShow,
  onChange,
  onBlur,
  error,
  touched,
}: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium">{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B35]/50" />
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="pl-10 pr-10 border-[#FF6B35]/20 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B35]"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && touched && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
