"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
  
      if (res.ok) {
        setIsSubmitted(true)
      } else {
        // stay on form, later you can show an error
        console.error("Request failed")
      }
    } catch (err) {
      console.error("Network error", err)
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FF6B35] via-[#F7C948] to-[#4CAF50] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-[#4CAF50]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-xl">
              F
            </div>
            <span className="text-2xl font-bold">FoodShare</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4">
            Forgot your password?
          </h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-md">
            No worries! We will send you a secure link to reset your password. Just enter your email address and check your inbox.
          </p>

          {/* Info block */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">Secure Reset Link</p>
              <p className="text-sm text-white/80">Time-limited and works only once</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FFF8F0]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B35] text-white font-bold">
              F
            </div>
            <span className="text-xl font-semibold text-[#FF6B35]">FoodShare</span>
          </div>

          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="space-y-1 pb-4">
              {!isSubmitted ? (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#F7C948] shadow-lg mb-4">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Enter your email address and we will send you a link to reset your password.
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] shadow-lg mb-4">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Check your email
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    If an account exists for <span className="font-medium text-[#FF6B35]">{email}</span>, a reset link has been sent.
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 border-[#FF6B35]/30 bg-[#FFF5F0] focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D04A1B] text-white font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Reset Link
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-xl bg-[#E8F5E9] border border-[#4CAF50]/20 p-4">
                    <p className="text-sm text-[#2E7D32] leading-relaxed">
                      The link will expire in 1 hour for security reasons. If you do not see the email, check your spam folder.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full h-12 border-[#FF6B35]/30 text-[#FF6B35] hover:bg-[#FFF5F0] bg-transparent"
                  >
                    Try a different email
                  </Button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[#FF6B35]/10">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 text-sm text-[#FF6B35] hover:text-[#E55A2B] font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
