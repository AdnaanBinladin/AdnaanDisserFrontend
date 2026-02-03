"use client"

import { useEffect, useMemo, useState } from "react"
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
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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

  const [claims, setClaims] = useState<NgoClaim[]>([])
  const [loading, setLoading] = useState(true)
  
  const downloadAsPDF = () => {
    const doc = new jsPDF("p", "mm", "a4")
  
    // =========================
    // BRAND HEADER
    // =========================
    doc.setFont("helvetica", "bold")
    doc.setFontSize(26)
    doc.setTextColor(255, 120, 0)
    doc.text("FoodShare", 14, 20)
  
    doc.setFontSize(11)
    doc.setTextColor(120)
    doc.text("Reducing food waste, one donation at a time", 14, 27)
  
    // Divider
    doc.setDrawColor(255, 180, 120)
    doc.line(14, 31, 196, 31)
  
    // =========================
    // REPORT TITLE
    // =========================
    doc.setFontSize(18)
    doc.setTextColor(40)
    doc.text("NGO Claim History Report", 14, 42)
  
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      14,
      49
    )
  
    // =========================
    // TABLE DATA
    // =========================
    const tableData = filteredClaims.map((claim) => [
      claim.title,
      claim.category,
      `${claim.quantity} ${claim.unit}`,
      claim.status.toUpperCase(),
      claim.claimed_at,
      claim.completed_at || "-",
      claim.pickup_address || "N/A",
    ])
  
    autoTable(doc, {
      startY: 56,
      head: [[
        "Title",
        "Category",
        "Quantity",
        "Status",
        "Claimed At",
        "Completed At",
        "Pickup Address",
      ]],
      body: tableData,
  
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
        textColor: 60,
        valign: "middle",
      },
  
      headStyles: {
        fillColor: [255, 140, 0], // FoodShare orange
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
  
      bodyStyles: {
        halign: "left",
      },
  
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
  
      columnStyles: {
        2: { halign: "center" }, // Quantity
        3: { halign: "center" }, // Status
        4: { halign: "center" }, // Claimed At
        5: { halign: "center" }, // Completed At
      },
    })
  
    // =========================
    // FOOTER
    // =========================
    const pageHeight = doc.internal.pageSize.height
    doc.setDrawColor(220)
    doc.line(14, pageHeight - 20, 196, pageHeight - 20)
  
    doc.setFontSize(9)
    doc.setTextColor(120)
    doc.text(
      "This document contains NGO claim history generated from FoodShare.",
      14,
      pageHeight - 14
    )
  
    doc.text(
      "© FoodShare – For internal NGO use only",
      14,
      pageHeight - 9
    )
  
    doc.save("foodshare-ngo-claim-history.pdf")
  }
  


  useEffect(() => {
    fetchClaims()
  }, [])
  
  const fetchClaims = async () => {
    try {
      setLoading(true)
  
      const ngoId = localStorage.getItem("ngoId")
      if (!ngoId) return
  
      const res = await fetch(
        `http://localhost:5050/api/ngo/claims/history?ngoId=${ngoId}`
      )
  
      if (!res.ok) throw new Error("Failed to load claim history")
  
      const json = await res.json()
      setClaims(json.data || [])
  
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
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

              <Button variant="outline" className="bg-white"   onClick={downloadAsPDF}              >
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
