"use client"
import { Download } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Package,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Apple,
  Carrot,
  Leaf,
  XCircle,
  Filter,
} from "lucide-react"
import type { DonationItem } from "@/components/donor-dashboard"
import { motion } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


interface DonationHistoryProps {
  onBack: () => void
  foodItems: DonationItem[]
}

type StatusFilter =
  | "all"
  | "available"
  | "claimed"
  | "completed"
  | "expired"
  | "cancelled"







export function DonationHistory({ onBack, foodItems }: DonationHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  // --------------------------------------------------
  // ✅ NORMALIZE STATUS (critical fix)
  // --------------------------------------------------
  const normalizeStatus = (status?: string): StatusFilter => {
    const s = (status || "").toLowerCase()
  
    if (s === "available") return "available"
    if (s === "claimed") return "claimed"
    if (s === "completed") return "completed"
    if (s === "expired") return "expired"
    if (s === "cancelled") return "cancelled"
  
    return "available"
  }
  

  // --------------------------------------------------
  // UI helpers
  // --------------------------------------------------
  const getStatusIcon = (status?: string) => {
    switch (normalizeStatus(status)) {
      case "available":
        return <Package className="h-4 w-4" />
      case "claimed":
        return <CheckCircle className="h-4 w-4" />
        case "completed":
  return "bg-gradient-to-r from-emerald-500 to-green-600 text-white"

      case "expired":
        return <AlertTriangle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (normalizeStatus(status)) {
      case "available":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "claimed":
        return "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
      case "expired":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white"
      case "cancelled":
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  // --------------------------------------------------
  // SORT (unchanged behavior)
  // --------------------------------------------------
  const sortedItems = useMemo(() => {
    return [...foodItems].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
  }, [foodItems])

  // --------------------------------------------------
  // FILTER (fixed – no silent empty state)
  // --------------------------------------------------
  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return sortedItems
    return sortedItems.filter(
      (item) => normalizeStatus(item.status) === statusFilter
    )
  }, [sortedItems, statusFilter])




   // --------------------------------------------------
// DOWNLOAD AS PDF
// --------------------------------------------------
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
  doc.text("Donation History Report", 14, 42)

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
  const tableData = filteredItems.map((item: DonationItem) => [
    item.title,
    item.category,
    `${item.quantity} ${item.unit}`,
    item.urgency,
    normalizeStatus(item.status),
    item.expiry_date,
    new Date(item.created_at).toISOString().split("T")[0],
    item.pickup_address || "N/A",
  ])

  autoTable(doc, {
    startY: 56,
    head: [[
      "Title",
      "Category",
      "Quantity",
      "Urgency",
      "Status",
      "Expiry",
      "Created",
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
      3: { halign: "center" }, // Urgency
      4: { halign: "center" }, // Status
      5: { halign: "center" }, // Expiry
      6: { halign: "center" }, // Created
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
    "This document contains personal donation data generated from FoodShare.",
    14,
    pageHeight - 14
  )

  doc.text(
    "© FoodShare – For personal use only",
    14,
    pageHeight - 9
  )

  doc.save("foodshare-donation-history.pdf")
}


  // --------------------------------------------------
  // COUNTS (fixed to match real data)
  // --------------------------------------------------
  const counts = useMemo(() => {
    const c = {
      available: 0,
      claimed: 0,
      completed: 0,
      expired: 0,
      cancelled: 0,
    }
    
    for (const it of foodItems) {
      const s = normalizeStatus(it.status)
      if (s === "available") c.available++
      else if (s === "cancelled") c.cancelled++
      else if (s === "expired") c.expired++
      else if (s === "claimed") c.claimed++
else if (s === "completed") c.completed++

    }
    return c
  }, [foodItems])

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-green-50 p-6">
      {/* Decorative icons */}
      <Apple className="absolute top-16 right-8 h-32 w-32 text-red-500 opacity-10 rotate-12" />
      <Carrot className="absolute bottom-16 left-8 h-28 w-28 text-orange-500 opacity-10 -rotate-12" />
      <Leaf className="absolute top-1/2 right-1/4 h-24 w-24 text-green-500 opacity-10 rotate-45" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back */}
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 mb-6 bg-white/80 border-2 border-orange-300"
        >
          <ArrowLeft className="h-4 w-4 text-orange-600" />
          <span className="text-orange-600 font-semibold">
            Back to Dashboard
          </span>
        </Button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-green-500 p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Apple className="h-7 w-7" /> Donation History
            <Carrot className="h-7 w-7" />
          </h1>
          <p className="text-white/90">
            View all your previous food donations and their current statuses
          </p>

          {/* Filter */}
          <div className="mt-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-white">
              <Filter className="h-4 w-4" />
              <span className="font-semibold">Filter by status</span>
            </div>

            <div className="flex gap-3 items-center">
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as StatusFilter)
                }
              >
                <SelectTrigger className="w-[220px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All ({foodItems.length})
                  </SelectItem>
                  <SelectItem value="available">
                    Available ({counts.available})
                  </SelectItem>
                  <SelectItem value="claimed">
                    Claimed ({counts.claimed})
                  </SelectItem>
                  <SelectItem value="completed">
  Completed ({counts.completed})
</SelectItem>

                  <SelectItem value="expired">
                    Expired ({counts.expired})
                  </SelectItem>
                  <SelectItem value="cancelled">
                    Cancelled ({counts.cancelled})
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setStatusFilter("all")}
                className="bg-white"
              >
                Reset
              </Button>
              <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        onClick={downloadAsPDF}
        className="p-2 rounded-lg bg-white border border-orange-300
                   hover:bg-orange-50 transition"
        aria-label="Download donation history as PDF"
      >
        <Download className="h-5 w-5 text-orange-600" />
      </button>
    </TooltipTrigger>

    <TooltipContent side="bottom">
      <p>Download donation history as PDF</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>


            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {filteredItems.length === 0 ? (
            <Card className="border-4 border-orange-200 bg-white">
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800">
                  No donations found
                </h3>
                <p className="text-gray-600">
                  Try switching the filter back to <b>All</b>.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-l-8 border-orange-500 bg-white shadow-md">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{item.title}</CardTitle>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        {normalizeStatus(item.status)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Added on{" "}
                      {new Date(item.created_at)
                        .toISOString()
                        .split("T")[0]}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <b>Category:</b> {item.category}
                    </div>
                    <div>
                      <b>Quantity:</b> {item.quantity} {item.unit}
                    </div>
                    <div>
                      <b>Urgency:</b> {item.urgency}
                    </div>
                    <div>
                      <b>Expiry:</b> {item.expiry_date}
                    </div>
                    <div className="md:col-span-2">
                      <b className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Pickup Address:
                      </b>
                      {item.pickup_address}
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
