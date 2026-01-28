"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Building2,
  User,
} from "lucide-react"

export default function NgoProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("ngoId")
    if (!userId) {
      setError("NGO not logged in")
      setLoading(false)
      return
    }

    fetch(`http://localhost:5050/api/profile?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile")
        return res.json()
      })
      .then((data) => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load NGO profile")
        setLoading(false)
      })
  }, [])

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading NGO profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    )
  }

  if (!profile?.user) {
    return (
      <div className="p-6 text-center text-red-500">
        Invalid profile data
      </div>
    )
  }

  const { user, organization } = profile
  const isVerified = organization?.verification_status === "approved"

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* ORGANIZATION CARD */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 size={20} />
              {organization?.name || "Organization Pending"}
            </span>

            <Badge
              className={
                isVerified
                  ? "bg-green-500 text-white"
                  : "bg-yellow-400 text-black"
              }
            >
              {isVerified ? "Verified NGO" : "Pending Verification"}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <p className="flex gap-2 items-center">
            <MapPin size={16} />
            {organization?.address || "Address not provided"}
          </p>

          <p className="flex gap-2 items-center">
            <Phone size={16} />
            {organization?.phone || "Phone not provided"}
          </p>

          <p className="text-gray-600">
            {organization?.description || "No organization description yet."}
          </p>
        </CardContent>
      </Card>

      {/* ADMIN USER CARD */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} />
            NGO Administrator
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <p className="flex gap-2 items-center">
            <Mail size={16} /> {user.email}
          </p>

          <p className="flex gap-2 items-center">
            <Phone size={16} /> {user.phone || "—"}
          </p>

          <p className="flex gap-2 items-center">
            <ShieldCheck size={16} /> Role: NGO
          </p>
        </CardContent>
      </Card>

    </div>
  )
}
