"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Award, Package } from "lucide-react"

interface DonorProfileCardProps {
  name: string
  email: string
  totalDonations: number
  verified?: boolean
}

export function DonorProfileCard({ name, email, totalDonations, verified }: DonorProfileCardProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-md border-2 border-orange-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <User className="h-5 w-5 text-orange-500" /> Donor Profile
        </CardTitle>
        {verified && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center gap-1">
            <Award className="h-4 w-4" /> Verified Hero
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-orange-500" /> {email}
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-green-600" /> Total Donations:{" "}
          <span className="font-semibold">{totalDonations}</span>
        </div>
        <CardDescription className="text-gray-500">
          {verified
            ? "Thank you for your continued contribution to reducing food waste."
            : "Complete 3 or more verified donations to earn a Verified Hero badge!"}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
