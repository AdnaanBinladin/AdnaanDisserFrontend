"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  Filter,
  MapPin,
  Download,
} from "lucide-react"

import { motion } from "framer-motion"

type ClaimStatus = "all" | "claimed" | "completed" | "cancelled"

interface NgoClaim {
  id: string
  title: string
  category: string
  quantity: number
  unit: "kg" | "pieces" | "liters" | "boxes"
  pickup_address: string
  claimed_at: string
  completed_at?: string
  status: "claimed" | "completed" | "cancelled"
}

export default function NgoClaimsPage() {
  const [statusFilter, setStatusFilter] = useState<ClaimStatus>("all")

  // 🔧 MOCK DATA (replace later with backend)
  const claims: NgoClaim[] = [
    {
      id: "1",
      title: "Fresh Apples",
      category: "Fruits",
      quantity: 10,
      unit: "kg",
      pickup_address: "Port Louis",
      claimed_at: "2026-02-01",
      status: "claimed",
    },
    {
      id: "2",
      title: "Bread Boxes",
      category: "Grains",
      quantity: 3,
      unit: "boxes",
      pickup_address: "Curepipe",
      claimed_at: "2026-01-28",
      completed_at: "2026-01-29",
      status: "completed",
    },
    {
      id: "3",
      title: "Milk Bottles",
      category: "Dairy",
      quantity: 5,
      unit: "liters",
      pickup_address: "Quatre Bornes",
      claimed_at: "2026-01-25",
      status: "cancelled",
    },
  ]

  // ---------------------------
  // FILTER
  // ---------------------------
  const filteredClaims = useMemo(() => {
    if (statusFilter === "all") return claims
    return claims.filter((c) => c.status === statusFilter)
  }, [claims, statusFilter])

  // ---------------------------
  // UI HELPERS
  // ---------------------------
  const getStatusBadge = (status: NgoClaim["status"]) => {
    switch (status) {
      case "claimed":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            <Package className="h-4 w-4 mr-1" />
            Claimed
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-gray-600 text-white">
            <XCircle className="h-4 w-4 mr-1" />
            Cancelled
          </Badge>
        )
    }
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* BACK */}
        <Button
          variant="outline"
          onClick={() => history.back()}
          className="mb-6 bg-white border-2 border-orange-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2 text-orange-600" />
          Back to Dashboard
        </Button>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-green-500 p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            📦 My Claims
          </h1>
          <p className="text-white/90">
            Track claimed donations, pickups, and cancellations
          </p>

          {/* FILTER */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white">
              <Filter className="h-4 w-4" />
              Filter by status
            </div>

            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as ClaimStatus)}
              >
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="claimed">Claimed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-white">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* CLAIM CARDS */}
        <div className="space-y-5">
          {filteredClaims.length === 0 ? (
            <Card className="border-4 border-orange-200 bg-white">
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  No claims found
                </h3>
              </CardContent>
            </Card>
          ) : (
            filteredClaims.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-l-8 border-orange-500 bg-white shadow-md">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{claim.title}</CardTitle>
                      {getStatusBadge(claim.status)}
                    </div>
                    <CardDescription>
                      Claimed on {claim.claimed_at}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <b>Category:</b> {claim.category}
                    </div>
                    <div>
                      <b>Quantity:</b> {claim.quantity} {claim.unit}
                    </div>

                    <div className="md:col-span-2">
                      <b className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Pickup Address:
                      </b>
                      {claim.pickup_address}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
