"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MapPin,
  Calendar,
  Package,
  Clock,
  Filter,
  Grid3X3,
  List,
  Apple,
  Wheat,
  Milk,
  Cookie,
  Soup,
  Leaf,
} from "lucide-react"

interface FoodListing {
  id: string
  name: string
  quantity: string
  expiryDate: string
  donorName: string
  location: string
  dateAdded: string
  category: "fruits" | "vegetables" | "dairy" | "grains" | "prepared" | "canned"
  description?: string
  urgency: "urgent" | "soon" | "good"
}

export function FoodListings() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const [foodListings] = useState<FoodListing[]>([
    {
      id: "1",
      name: "Fresh Apples",
      quantity: "15 kg",
      expiryDate: "2024-01-23",
      donorName: "Green Grocery Store",
      location: "Downtown",
      dateAdded: "2024-01-20",
      category: "fruits",
      description: "Organic red apples, perfect for cooking or eating fresh",
      urgency: "urgent",
    },
    {
      id: "2",
      name: "Whole Wheat Bread",
      quantity: "25 loaves",
      expiryDate: "2024-01-24",
      donorName: "City Bakery",
      location: "Midtown",
      dateAdded: "2024-01-19",
      category: "grains",
      description: "Fresh baked whole wheat bread, great for sandwiches",
      urgency: "soon",
    },
    {
      id: "3",
      name: "Canned Vegetables",
      quantity: "100 cans",
      expiryDate: "2024-08-15",
      donorName: "Food Mart",
      location: "Uptown",
      dateAdded: "2024-01-18",
      category: "canned",
      description: "Mixed vegetables in cans, long shelf life",
      urgency: "good",
    },
    {
      id: "4",
      name: "Fresh Milk",
      quantity: "20 liters",
      expiryDate: "2024-01-25",
      donorName: "Local Dairy Farm",
      location: "Downtown",
      dateAdded: "2024-01-17",
      category: "dairy",
      description: "Fresh whole milk from local farm",
      urgency: "soon",
    },
    {
      id: "5",
      name: "Mixed Vegetables",
      quantity: "30 kg",
      expiryDate: "2024-01-26",
      donorName: "Farmers Market",
      location: "Midtown",
      dateAdded: "2024-01-16",
      category: "vegetables",
      description: "Fresh seasonal vegetables including carrots, broccoli, and peppers",
      urgency: "soon",
    },
    {
      id: "6",
      name: "Prepared Meals",
      quantity: "50 portions",
      expiryDate: "2024-01-22",
      donorName: "Restaurant Chain",
      location: "Uptown",
      dateAdded: "2024-01-15",
      category: "prepared",
      description: "Ready-to-eat meals including pasta and rice dishes",
      urgency: "urgent",
    },
  ])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fruits":
        return <Apple className="h-4 w-4" />
      case "vegetables":
        return <Leaf className="h-4 w-4" />
      case "dairy":
        return <Milk className="h-4 w-4" />
      case "grains":
        return <Wheat className="h-4 w-4" />
      case "prepared":
        return <Soup className="h-4 w-4" />
      case "canned":
        return <Cookie className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-destructive text-destructive-foreground"
      case "soon":
        return "bg-secondary text-secondary-foreground"
      case "good":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getUrgencyDays = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const filteredListings = foodListings
    .filter((listing) => {
      const matchesSearch =
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = locationFilter === "all" || listing.location === locationFilter
      const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter
      const matchesUrgency = urgencyFilter === "all" || listing.urgency === urgencyFilter
      return matchesSearch && matchesLocation && matchesCategory && matchesUrgency
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        case "expiry":
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        case "location":
          return a.location.localeCompare(b.location)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const urgentCount = foodListings.filter((item) => item.urgency === "urgent").length
  const totalListings = foodListings.length
  const locations = Array.from(new Set(foodListings.map((item) => item.location)))

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Food Donations</h1>
          <p className="text-muted-foreground">Browse and search through available food donations from local donors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Available</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalListings}</div>
              <p className="text-xs text-muted-foreground">Food items available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Items</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{urgentCount}</div>
              <p className="text-xs text-muted-foreground">Expiring within 2 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{locations.length}</div>
              <p className="text-xs text-muted-foreground">Areas covered</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="prepared">Prepared</SelectItem>
                  <SelectItem value="canned">Canned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="soon">Expiring Soon</SelectItem>
                  <SelectItem value="good">Good Condition</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="expiry">Expiry Date</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setLocationFilter("all")
                  setCategoryFilter("all")
                  setUrgencyFilter("all")
                  setSortBy("newest")
                }}
              >
                Clear All Filters
              </Button>
              <Badge variant="outline" className="flex items-center gap-1">
                {filteredListings.length} items found
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Food Listings */}
        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No food items found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setLocationFilter("all")
                  setCategoryFilter("all")
                  setUrgencyFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const daysUntilExpiry = getUrgencyDays(listing.expiryDate)
              return (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(listing.category)}
                        <CardTitle className="text-lg">{listing.name}</CardTitle>
                      </div>
                      <Badge className={getUrgencyColor(listing.urgency)}>
                        {daysUntilExpiry <= 0 ? "Expired" : `${daysUntilExpiry}d left`}
                      </Badge>
                    </div>
                    <CardDescription>by {listing.donorName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {listing.description && <p className="text-sm text-muted-foreground">{listing.description}</p>}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Expires: {listing.expiryDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline" className="capitalize">
                        {listing.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Added {listing.dateAdded}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium">Food Item</th>
                      <th className="text-left py-4 px-6 font-medium">Quantity</th>
                      <th className="text-left py-4 px-6 font-medium">Donor</th>
                      <th className="text-left py-4 px-6 font-medium">Location</th>
                      <th className="text-left py-4 px-6 font-medium">Expiry</th>
                      <th className="text-left py-4 px-6 font-medium">Category</th>
                      <th className="text-left py-4 px-6 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((listing) => {
                      const daysUntilExpiry = getUrgencyDays(listing.expiryDate)
                      return (
                        <tr key={listing.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(listing.category)}
                              <div>
                                <div className="font-medium">{listing.name}</div>
                                {listing.description && (
                                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                                    {listing.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">{listing.quantity}</td>
                          <td className="py-4 px-6">{listing.donorName}</td>
                          <td className="py-4 px-6">{listing.location}</td>
                          <td className="py-4 px-6">{listing.expiryDate}</td>
                          <td className="py-4 px-6">
                            <Badge variant="outline" className="capitalize">
                              {listing.category}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getUrgencyColor(listing.urgency)}>
                              {daysUntilExpiry <= 0 ? "Expired" : `${daysUntilExpiry}d left`}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
