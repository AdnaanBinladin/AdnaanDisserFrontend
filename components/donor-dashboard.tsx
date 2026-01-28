"use client"

import TopRightMenu from "@/components/TopRightMenu";

import Lottie from "lottie-react"
import EmptyBox from "@/public/animations/empty-box.json"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  Plus,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  Apple,
  Carrot,
  Leaf,
  User,
  Mail,
  Award,
  Trash2,
} from "lucide-react"
import { AddDonationDialog } from "@/components/add-donation-dialog"
import { DonationHistory } from "@/components/donation-history"
import { getDonations } from "@/lib/donations"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { getDonorProfile } from "@/lib/auth"

// ------------------------------------------------------
// TYPES
// ------------------------------------------------------
export interface DonationItem {
  id: string
  title: string
  description?: string
  category: string
  quantity: number
  unit: string
  expiry_date: string
  pickup_address: string
  pickup_lat?: number
  pickup_lng?: number
  pickup_instructions?: string
  urgency: "low" | "medium" | "high"
  status: "available" | "claimed" | "completed" | "expired" | "cancelled"
  created_at: string
  qr_code?: string  // ✅ base64 QR code image returned from backend

}

// ------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------
export function DonorDashboard() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [foodItems, setFoodItems] = useState<DonationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [donor, setDonor] = useState<any>(null)
  const [donorId, setDonorId] = useState<string>("")

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  // ------------------------------------------------------
  // LOAD DONOR ID FROM LOCALSTORAGE
  // ------------------------------------------------------
  useEffect(() => {
    try {
      const storedId = typeof window !== "undefined" ? localStorage.getItem("donorId") : null
      if (storedId) setDonorId(storedId)
      else console.warn("⚠️ No donorId found in localStorage — user might not be logged in.")
    } catch (err) {
      console.error("Error accessing localStorage:", err)
    }
  }, [])

  // ------------------------------------------------------
  // FETCH DONOR PROFILE + DONATIONS
  // ------------------------------------------------------
  useEffect(() => {
    if (!donorId) return
    async function fetchAllData() {
      try {
        setIsLoading(true)
  
        // 🔹 Run expiry check every time you reload the dashboard
        await fetch("http://localhost:5050/api/donations/auto-expire", { method: "PUT" })
  
        const [donorData, donationsRes] = await Promise.all([
          getDonorProfile(donorId),
          getDonations(donorId),
        ])
  
        if (donorData) setDonor(donorData)
        if (donationsRes?.data) setFoodItems(donationsRes.data)
      } catch (err) {
        console.error("❌ Error fetching donor dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllData()
  }, [donorId])
  

  const addDonation = (newItem: DonationItem) => {
    setFoodItems((prev) => [newItem, ...prev])
  }

  // ------------------------------------------------------
  // 🗑 DELETE HANDLER (Cancel Donation)
  // ------------------------------------------------------
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this donation?")
    if (!confirmDelete) return

    try {
      const res = await fetch(`http://localhost:5050/api/donations/${id}/cancel`, {
        method: "PUT",
      })

      if (res.ok) {
        setFoodItems((prev) => prev.filter((item) => item.id !== id))
        alert("Donation cancelled successfully!")
      } else {
        alert("Failed to cancel donation.")
      }
    } catch (err) {
      console.error("❌ Error cancelling donation:", err)
      alert("An error occurred while cancelling donation.")
    }
  }

  // ------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Package className="h-4 w-4" />
      case "claimed":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "expired":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "claimed":
      case "completed":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "expired":
        return "bg-gradient-to-r from-red-600 to-orange-600 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

// ------------------------------------------------------
// FILTER: Exclude cancelled donations from dashboard
// ------------------------------------------------------
const visibleDonations = foodItems.filter((item) => item.status !== "cancelled")

// ------------------------------------------------------
// COUNTS
// ------------------------------------------------------
const availableCount = visibleDonations.filter((i) => i.status === "available").length
const claimedCount = visibleDonations.filter((i) => i.status === "claimed" || i.status === "completed").length
const expiredCount = visibleDonations.filter((i) => i.status === "expired").length
const totalCount = visibleDonations.length


  // ------------------------------------------------------
  // 🏅 DONOR LEVEL LOGIC
  // ------------------------------------------------------
  const getDonorLevel = (count: number) => {
    if (count >= 30) return { title: "🏅 Zero-Waste Champion", color: "from-yellow-500 to-orange-500" }
    if (count >= 15) return { title: "🥈 Community Hero", color: "from-green-500 to-emerald-500" }
    if (count >= 5) return { title: "🥉 Food Saver", color: "from-orange-400 to-red-400" }
    return { title: "🌱 New Contributor", color: "from-gray-300 to-gray-400" }
  }

  // ------------------------------------------------------
  // SUBCOMPONENTS
  // ------------------------------------------------------
  const DonorProfileCard = () => {
    const level = getDonorLevel(totalCount)
    const progress = Math.min((totalCount / 30) * 100, 100)

    return (
      <Card className="bg-white/90 backdrop-blur-md border-2 border-orange-200 shadow-md hover:shadow-lg transition-all mb-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <User className="h-5 w-5 text-orange-500" /> {donor?.full_name || "Donor Profile"}
          </CardTitle>
          <Badge className={`bg-gradient-to-r ${level.color} text-white flex items-center gap-1 shadow-md`}>
            <Award className="h-4 w-4" /> {level.title}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-orange-500" /> {donor?.email || "Loading..."}
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600" /> Total Donations:{" "}
            <span className="font-semibold">{totalCount}</span>
          </div>

          {/* 🌱 Progress Bar */}
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Next Level Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 bg-gradient-to-r ${level.color} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <CardDescription className="text-gray-500">
            Thank you for your continued contribution to reducing food waste.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  const DashboardStats = () => {
    const stats = [
      { label: "Total Donations", value: totalCount, icon: Package, color: "from-orange-400 to-red-400" },
      { label: "Available", value: availableCount, icon: Clock, color: "from-amber-400 to-yellow-400" },
      { label: "Completed", value: claimedCount, icon: CheckCircle, color: "from-green-400 to-emerald-400" },
      { label: "Expired", value: expiredCount, icon: AlertTriangle, color: "from-rose-400 to-pink-400" },
    ]

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <Card
            key={i}
            className={`bg-gradient-to-r ${s.color} text-white shadow-md hover:shadow-xl transition-all duration-200`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // ------------------------------------------------------
  // CONDITIONAL RENDERING
  // ------------------------------------------------------
  if (!donorId) {
    return (
      <div className="h-screen flex items-center justify-center text-orange-600 font-medium">
        Loading your dashboard...
      </div>
    )
  }

  if (showHistory) {
    return <DonationHistory onBack={() => setShowHistory(false)} foodItems={foodItems as any} />
  }

  // ------------------------------------------------------
  // MAIN RENDER
  // ------------------------------------------------------
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🍎 Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-green-50 opacity-60" />
      <Apple className="absolute top-8 left-8 h-24 w-24 text-orange-300 opacity-20" />
      <Carrot className="absolute top-20 right-12 h-16 w-16 text-red-300 opacity-20" />
      <Leaf className="absolute bottom-12 left-16 h-28 w-28 text-green-300 opacity-20" />
      <Apple className="absolute bottom-20 right-20 h-20 w-20 text-orange-300 opacity-20" />

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        {/* 🧡 Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-green-500 text-white p-6 rounded-xl shadow-xl">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Apple className="h-8 w-8" />
              Donor Dashboard
              <Carrot className="h-8 w-8" />
            </h1>
            <p className="text-orange-100">Manage your food donations and help reduce waste</p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
  

            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white border-2 border-white hover:scale-105 transition-transform font-semibold shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Donation
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 bg-white/90 text-orange-600 border-2 border-white hover:bg-white hover:scale-105 transition-transform font-semibold shadow-md"
            >
              <History className="h-4 w-4" />
              View History
            </Button>
          </div>
        </div>

        {/* 🧍 Donor Profile */}
        <DonorProfileCard />

        {/* 📊 Dashboard Insights */}
        <DashboardStats />

        {/* 📦 Donations Table */}
        <Card className="border-2 border-orange-200 shadow-xl bg-white/95 backdrop-blur-sm mt-8">
          <CardHeader className="bg-gradient-to-r from-orange-100 via-red-100 to-green-100 rounded-t-lg">
            <CardTitle className="text-orange-700 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Current Food Donations
            </CardTitle>
            <CardDescription className="text-orange-600/70">
              Track the status and location of your recent food donations
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Skeleton className="w-3/4 h-6 bg-orange-200/50" />
                <Skeleton className="w-2/3 h-6 bg-orange-200/50" />
                <Skeleton className="w-1/2 h-6 bg-orange-200/50" />
              </div>
            ) : foodItems.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center">
                <Lottie animationData={EmptyBox} loop className="w-40 h-40 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-orange-700">No donations yet</h3>
                <p className="text-orange-600/70 mb-4">Start by adding your first food donation</p>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Donation
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Quantity</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Expiry</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Urgency</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">QR Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Created</th>
                      <th className="text-left py-3 px-4 font-semibold text-orange-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleDonations.map((item) => (
                      <tr key={item.id} className="border-b border-orange-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-orange-900">{item.title}</td>
                        <td className="py-3 px-4 capitalize text-orange-800">{item.category}</td>
                        <td className="py-3 px-4 text-orange-800">{item.quantity} {item.unit}</td>
                        <td className="py-3 px-4 text-orange-800">{item.expiry_date}</td>
                        <td className="py-3 px-4 capitalize text-orange-800">{item.urgency}</td>
                        <td className="py-3 px-4">
                          <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(item.status)} font-semibold shadow-md`}>
                            {getStatusIcon(item.status)}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </td>
{/* 🧾 QR Code (click to enlarge) */}
<td className="py-3 px-4 text-center">
  {item.qr_code ? (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={`data:image/png;base64,${item.qr_code}`}
          alt="Pickup QR Code"
          className="w-12 h-12 border rounded-md shadow-md cursor-pointer hover:scale-105 transition-transform"
          title="Click to enlarge QR code"
        />
      </DialogTrigger>

      <DialogContent className="max-w-sm bg-white rounded-xl shadow-xl flex flex-col items-center justify-center p-6">
        <h3 className="text-lg font-semibold text-orange-700 mb-3">
          Scan this QR Code to confirm pickup
        </h3>
        <img
          src={`data:image/png;base64,${item.qr_code}`}
          alt="Full QR Code"
          className="w-64 h-64 border-2 border-orange-300 rounded-lg shadow-md"
        />
        <p className="text-sm text-gray-600 mt-3 text-center">
          NGOs can scan this QR code when collecting your donation.
        </p>
      </DialogContent>
    </Dialog>
  ) : (
    <span className="text-gray-400 text-xs italic">No QR</span>
  )}
</td>

                        <td className="py-3 px-4">
                          {isLoaded && item.pickup_lat && item.pickup_lng ? (
                            <a
                              href={`https://www.google.com/maps?q=${item.pickup_lat},${item.pickup_lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-md overflow-hidden border border-orange-200 shadow hover:shadow-md hover:scale-105 transition-all"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <GoogleMap
                                mapContainerStyle={{ width: "40px", height: "40px" }}
                                center={{ lat: item.pickup_lat, lng: item.pickup_lng }}
                                zoom={15}
                                options={{
                                  disableDefaultUI: true,
                                  zoomControl: false,
                                  streetViewControl: false,
                                  mapTypeControl: false,
                                  gestureHandling: "none",
                                }}
                              >
                                <Marker position={{ lat: item.pickup_lat, lng: item.pickup_lng }} />
                              </GoogleMap>
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs italic">No map</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-orange-700">{new Date(item.created_at).toISOString().split("T")[0]}</td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-105 transition-transform"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ➕ Floating Add Donation Button */}
        <Button
          onClick={() => setShowAddDialog(true)}
          className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:scale-110 transition-transform text-white flex items-center justify-center z-50"
          title="Add Donation"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* ➕ Add Donation Dialog */}
        <AddDonationDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          donorId={donorId}
          onAdded={addDonation}
        />

        {/* 🔔 Floating Notification Bell */}
        <TopRightMenu />
      </div>
    </div>
  )
}
