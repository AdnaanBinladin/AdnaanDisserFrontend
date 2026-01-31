"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Mail,
  User,
  Bell,
  LogOut,
  LayoutDashboard,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

/* ================= Sidebar ================= */
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/donor/dashboard" },
  { icon: Bell, label: "Notifications", href: "/donor/dashboard/notifications", badge: 3 },
  { icon: User, label: "Profile", href: "/donor/dashboard/profile" },
];

export default function VerifyOTPPage() {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(600);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ================= Focus first input ================= */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ================= OTP Expiry Countdown ================= */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  /* ================= Resend Countdown ================= */
  useEffect(() => {
    if (resendCountdown > 0 && !canResend) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (resendCountdown === 0) setCanResend(true);
  }, [resendCountdown, canResend]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  /* ================= OTP Input Handling ================= */
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    setOtp(pasted.split(""));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /* ================= RESEND OTP ================= */
  const handleResend = async () => {
    try {
      setError("");
      setCanResend(false);
      setResendCountdown(30);
      setCountdown(600);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
  
      const token = localStorage.getItem("token");
  
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
  
      const res = await fetch(
        `${API_URL}/api/profile/password/resend`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || "Failed to resend code");
        return;
      }
  
    } catch {
      setError("Failed to resend code");
    }
  };
  

  /* ================= SUBMIT OTP ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length !== 6) return;

    const token = localStorage.getItem("token");
    const newPassword = sessionStorage.getItem("pending_new_password");

    if (!newPassword) {
      setError("Session expired. Please restart password change.");
      return;
    }

    try {
      setLoading(true);

      const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

const res = await fetch(
  `${API_URL}/api/profile/password/verify`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, new_password: newPassword }),
  }
);


      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code");
        return;
      }

      sessionStorage.removeItem("pending_new_password");
      router.replace("/");

    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border fixed h-full flex flex-col">
        <div className="p-6 border-b border-border font-bold text-xl">FoodShare</div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-destructive text-xs px-2 rounded-full text-white">
                      {item.badge}
                    </span>
                  )}
                </a>
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
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle>Verify Your Identity</CardTitle>
              <p className="text-sm text-muted-foreground flex justify-center gap-2 mt-2">
                <Mail className="w-4 h-4" /> Enter the 6-digit code sent to your email
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, i) => (
                    <Input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      value={digit}
                      maxLength={1}
                      inputMode="numeric"
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-xl font-bold"
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Code expires in <strong>{formatTime(countdown)}</strong>
                </div>

                {error && (
                  <p className="text-sm text-destructive flex items-center gap-1 justify-center">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </p>
                )}

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-primary text-sm flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" /> Resend code
                  </button>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Resend in {resendCountdown}s
                  </p>
                )}

                <Button className="w-full" disabled={!isComplete || loading}>
                  {loading ? "Verifying..." : "Confirm Password Change"}
                </Button>

                <div className="text-center">
                  <a
                    href="/donor/dashboard/security"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Go back
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
