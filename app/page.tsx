"use client"

import { LoginAdsCarousel } from "@/components/ads/LoginAdsCarousel"
import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Leaf, Megaphone, X } from "lucide-react"
import { AdvertiseForm } from "@/components/advertise-form"

export default function HomePage() {
  const [showAdvertise, setShowAdvertise] = useState(false)

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/fruits.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        filter: "brightness(0.9)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            FoodShare
          </h1>
          <p className="text-muted-foreground">
            Reducing waste, feeding communities
          </p>
        </div>

        {/* Auth */}
        <LoginForm />

        {/* Advertise link */}
        <button
          type="button"
          onClick={() => setShowAdvertise(true)}
          className="mt-4 ml-24 flex items-center justify-center gap-1.5 text-xs text-foreground/200hover:text-foreground underline-offset-2 hover:underline"
        >
          <Megaphone className="h-3.5 w-3.5" />
          Want to advertise with FoodShare?
        </button>
      </div>
      <LoginAdsCarousel />

      {/* Advertise Modal */}
      {showAdvertise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-xl bg-card shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-6 py-4 rounded-t-xl">
              <h2 className="text-lg font-bold text-primary-foreground flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Advertise with FoodShare
              </h2>
              <button
                onClick={() => setShowAdvertise(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <AdvertiseForm onSuccess={() => setShowAdvertise(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
