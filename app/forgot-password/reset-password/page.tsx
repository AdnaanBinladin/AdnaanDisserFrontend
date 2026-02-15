"use client"

import React from "react"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
const API_URL = process.env.NEXT_PUBLIC_API_URL


export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
  ]

  const allRequirementsMet = passwordRequirements.every((req) => req.met)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    if (!allRequirementsMet) {
      setError("Please meet all password requirements")
      return
    }
  
    if (!passwordsMatch) {
      setError("Passwords do not match")
      return
    }
  
    if (!token) {
      setError("Invalid or missing reset token")
      return
    }
  
    setIsLoading(true)
  
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        setError(data.error || "Password reset failed")
        setIsLoading(false)
        return
      }
  
      setIsSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    }
  
    setIsLoading(false)
  }
  

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Updated!
            </h2>
            <p className="text-gray-500 mb-8">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white font-medium"
            >
              <span className="flex items-center gap-2">
                Continue to Sign In
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-white font-bold text-xl">
              F
            </div>
            <span className="text-2xl font-bold">FoodShare</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Create a new password
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-md">
            Choose a strong password to keep your account secure. Make sure it is unique and memorable.
          </p>
          
          {/* Security info */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8 text-amber-300" />
            </div>
            <div>
              <p className="font-medium text-white">Secure Password</p>
              <p className="text-sm text-teal-200">Use a mix of letters, numbers & symbols</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white font-bold">
              F
            </div>
            <span className="text-xl font-semibold text-teal-800">FoodShare</span>
          </div>

          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg mb-4">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Set New Password
              </CardTitle>
              <CardDescription className="text-gray-500">
                Create a strong password that you have not used before.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Password must contain:</p>
                  <ul className="space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full ${req.met ? "bg-teal-100 text-teal-600" : "bg-gray-200 text-gray-400"}`}>
                          {req.met ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                          )}
                        </div>
                        <span className={req.met ? "text-teal-700" : "text-gray-500"}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                  )}
                  {passwordsMatch && (
                    <p className="text-sm text-teal-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Passwords match
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                  className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating Password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-medium transition-colors"
                >
                  Remember your password? Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
