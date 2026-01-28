"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Apple, Carrot, Leaf, Phone, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("donor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");


// ✅ LOGIN HANDLER (FIXED & ROLE-SAFE)
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    const response = await loginUser({ email, password })

    console.log("🔹 Login response:", response)

    if (response.error) {
      setError(response.error)
      return
    }

    if (!response.donor?.id || !response.donor?.role) {
      setError("Invalid login response from server.")
      return
    }

    // 🔥 CLEAR EVERYTHING FIRST (VERY IMPORTANT)
    localStorage.clear()

    // ✅ SINGLE SOURCE OF TRUTH
    localStorage.setItem("token", response.token)
    localStorage.setItem("userId", response.donor.id)
    localStorage.setItem("role", response.donor.role)

    // ✅ OPTIONAL (role-based convenience keys)
    if (response.donor.role === "donor") {
      localStorage.setItem("donorId", response.donor.id)
      router.push("/donor/dashboard")
    }

    if (response.donor.role === "ngo") {
      localStorage.setItem("ngoId", response.donor.id)
      router.push("/ngo/dashboard")
    }

    if (response.donor.role === "admin") {
      router.push("/admin/dashboard")
    }

  } catch (err) {
    console.error("⚠️ Login failed:", err)
    setError("Something went wrong while logging in.")
  } finally {
    setIsLoading(false)
  }
}



// ✅ REGISTER HANDLER (Donor + NGO)
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match. Please retype your password.");
    return;
  }

  setIsLoading(true);
  try {
    // 🧠 Build the request payload dynamically
    const payload =
      role === "ngo"
        ? {
            full_name: name,
            email,
            phone,
            password,
            role,
            address,
            description,
          }
        : {
            full_name: name,
            email,
            phone,
            password,
            role, // donor only needs these
          };

    console.log("📦 Registration payload:", payload); // debug check

    const response = await registerUser(payload);

    if (response.error) {
      setError(response.error);
    } else {
      alert("Registration successful! Please log in.");
      // Optional: auto-switch to Login tab or redirect
      window.location.reload(); // simple refresh to reset form
    }
  } catch (err) {
    console.error("⚠️ Registration error:", err);
    setError("Something went wrong during registration.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative overflow-hidden">
      {/* 🍏 Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-green-50 opacity-60" />
      <div className="absolute top-4 left-4 text-orange-300 opacity-30">
        <Apple className="h-16 w-16" />
      </div>
      <div className="absolute top-12 right-8 text-red-300 opacity-30">
        <Carrot className="h-12 w-12" />
      </div>
      <div className="absolute bottom-8 left-12 text-green-300 opacity-30">
        <Leaf className="h-20 w-20" />
      </div>

      {/* 🧱 Card */}
      <Card className="w-full relative z-10 border-2 border-orange-200 shadow-xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-green-500 text-white text-center py-3 rounded-t-lg">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Apple className="h-6 w-6" />
            Welcome to FoodShare
            <Carrot className="h-6 w-6" />
          </h2>
          <p className="text-orange-100 text-sm">
            Join our community to reduce food waste and help those in need
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-orange-100 to-red-100 p-1">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-semibold"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-semibold"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-2 border-orange-200 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-2 border-red-200 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "🚀 Sign In"}
                </Button>
              </form>
            </TabsContent>

<TabsContent value="register">
  <form onSubmit={handleRegister} className="space-y-4">
    {/* Role Selection */}
    <div className="space-y-2">
      <Label>Role</Label>
      <Select onValueChange={setRole} value={role} required>
        <SelectTrigger className="border-2 border-green-200 focus:border-green-500">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="donor">Donor</SelectItem>
          <SelectItem value="ngo">NGO</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Donor Registration Fields */}
    {role === "donor" && (
      <>
        {/* Full Name */}
        <div className="space-y-2">
          <Label>Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>
      </>
    )}

    {/* NGO Registration Fields */}
    {role === "ngo" && (
      <>
        {/* Organization Name */}
        <div className="space-y-2">
          <Label>Organization Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="text"
              placeholder="Enter organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            type="text"
            placeholder="Enter organization address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-2 border-green-200 focus:border-green-500"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            type="text"
            placeholder="Short description of your organization"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-green-200 focus:border-green-500"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="email"
              placeholder="Enter organization email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 border-2 border-green-200 focus:border-green-500"
              required
            />
          </div>
        </div>
      </>
    )}

    {error && <p className="text-sm text-red-500">{error}</p>}

    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3"
      disabled={isLoading}
    >
      {isLoading ? "Registering..." : "🌱 Create Account"}
    </Button>
  </form>
</TabsContent>

          </Tabs>
        </div>
      </Card>
    </div>
  );
}
