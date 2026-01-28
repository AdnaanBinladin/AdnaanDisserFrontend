"use client"

import { useEffect, useState } from "react"
import { MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationBell } from "@/components/NotificationBell"
import ProfileAnimation from "@/public/animations/profile-person.json"
import LogoutAnimation from "@/public/animations/Log-out.json"
import Lottie from "lottie-react"

type Role = "donor" | "ngo" | null

export default function TopRightMenu() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<Role>(null)
  const router = useRouter()

  // 🔍 Detect role once
  useEffect(() => {
    if (localStorage.getItem("donorId")) setRole("donor")
    else if (localStorage.getItem("ngoId")) setRole("ngo")
  }, [])

  const handleProfileClick = () => {
    if (role === "donor") router.push("/donor/dashboard/profile")
    if (role === "ngo") router.push("/ngo/dashboard/profile")
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  if (!role) return null // safety guard

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* 🔘 3-dot trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition"
      >
        <MoreVertical className="w-6 h-6 text-orange-600" />
      </button>

      {/* 📦 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 bg-white rounded-xl shadow-xl border border-orange-200 p-2 flex flex-col gap-2">
          
          {/* 🔔 Notifications */}
          <NotificationBell />

          <div className="h-px bg-orange-100" />

          {/* 👤 Profile */}
          <button
            title="Profile"
            onClick={handleProfileClick}
            className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-orange-100 transition"
          >
            <Lottie
              animationData={ProfileAnimation}
              loop
              autoplay
              style={{ width: 36, height: 36 }}
            />
          </button>

          {/* 🚪 Logout */}
          <button
            title="Logout"
            onClick={handleLogout}
            className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-red-100"
          >
            <Lottie
              animationData={LogoutAnimation}
              loop={false}
              autoplay
              style={{ width: 36, height: 36 }}
            />
          </button>
        </div>
      )}
    </div>
  )
}
