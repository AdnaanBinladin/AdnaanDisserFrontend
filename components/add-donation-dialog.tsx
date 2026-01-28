"use client"

import { useState } from "react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  CalendarIcon,
  Package,
  Apple,
  Carrot,
  MapPin,
  LocateFixed,
  Sparkles,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { addDonation } from "@/lib/donations"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

export function AddDonationDialog({ open, onOpenChange, donorId, onAdded }: any) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [expiryDate, setExpiryDate] = useState<Date>()
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number }>({
    lat: -20.1609,
    lng: 57.5012,
  })
  const [pickupAddress, setPickupAddress] = useState("")
  const [hasMovedPin, setHasMovedPin] = useState(false)
  const [pickupInstructions, setPickupInstructions] = useState("")
  const [urgency, setUrgency] = useState("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  // ✅ Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  // 🌍 Reverse Geocoding (to show address)
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    setLoadingAddress(true)
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        setPickupAddress(data.results[0].formatted_address)
      } else {
        setPickupAddress("Address not found")
      }
    } catch (err) {
      setPickupAddress("Error fetching address")
    } finally {
      setLoadingAddress(false)
    }
  }

  // 📍 Auto-detect location
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setPickupLocation({ lat, lng })
          setHasMovedPin(true)
          fetchAddressFromCoords(lat, lng)
        },
        () => alert("Unable to fetch your location.")
      )
    } else {
      alert("Geolocation not supported by this browser.")
    }
  }

  // 🗺️ Map events
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setPickupLocation({ lat, lng })
    setHasMovedPin(true)
    fetchAddressFromCoords(lat, lng)
  }

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setPickupLocation({ lat, lng })
    setHasMovedPin(true)
    fetchAddressFromCoords(lat, lng)
  }

  // ✨ AI Suggest Description
  const handleSuggestDescription = async () => {
    if (!title || !category || !quantity) {
      alert("Please fill in title, category, and quantity first.")
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch("http://192.168.56.1:5050/api/ai/suggest-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, quantity }),
      })
      const data = await res.json()
      if (data.suggestion) {
        setDescription(data.suggestion)
      } else {
        alert("AI could not generate a description.")
      }
    } catch (err) {
      console.error("AI Suggestion Error:", err)
      alert("AI service is unavailable at the moment.")
    } finally {
      setAiLoading(false)
    }
  }

  const computeUrgency = () => {
    if (!expiryDate) return "medium";
  
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
    const perishable = ["meat", "fish", "dairy", "vegetables", "fruits", "prepared_food"];
  
    if (perishable.includes(category.toLowerCase()) && daysLeft <= 5) {
      return "high";
    }
    if (daysLeft <= 10) {
      return "medium";
    }
    return "low";
  };
  
  // 🧠 Auto-update UI urgency when values change
  useEffect(() => {
    setUrgency(computeUrgency());
  }, [category, expiryDate]);
  

  // 💾 Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!title || !category || !quantity || !unit || !expiryDate) return
    if (!hasMovedPin) {
      alert("Please select a pickup location by clicking or moving the pin on the map.")
      return
    }

    setIsSubmitting(true)
    const donation = {
      donor_id: donorId,
      title,
      description,
      category,
      quantity,
      unit,
      expiry_date: format(expiryDate, "yyyy-MM-dd"),
      pickup_lat: pickupLocation.lat,
      pickup_lng: pickupLocation.lng,
      pickup_address: pickupAddress,
      pickup_instructions: pickupInstructions,
      urgency: computeUrgency(),

    }

    const res = await addDonation(donation)
    setIsSubmitting(false)
    if (res.data) {
      onAdded(res.data[0])
      onOpenChange(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCategory("")
    setQuantity("")
    setUnit("")
    setExpiryDate(undefined)
    setPickupLocation({ lat: -20.1609, lng: 57.5012 })
    setPickupAddress("")
    setHasMovedPin(false)
    setPickupInstructions("")
    setUrgency("medium")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 via-red-50 to-green-50 border-4 border-orange-300 relative -translate-y-[950px] md:-translate-y-[1000px] rounded-xl shadow-2xl transition-transform duration-300 ease-out scroll-smooth" >
        <Apple className="absolute top-4 right-4 h-24 w-24 text-red-500 opacity-10 rotate-12" />
        <Carrot className="absolute bottom-4 left-4 h-20 w-20 text-orange-500 opacity-10 -rotate-12" />

        <DialogHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-green-500 -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-lg">
          <DialogTitle className="flex items-center gap-2 text-white text-xl">
            <Package className="h-6 w-6" /> Add New Donation
          </DialogTitle>
          <DialogDescription className="text-white/90">
            Provide complete details for your donation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* TITLE */}
          <div className="space-y-2">
            <Label className="text-orange-700 font-semibold">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Fresh Apples"
              className="border-2 border-orange-300 focus:border-orange-500 bg-white"
            />
          </div>

          {/* CATEGORY + URGENCY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-red-700 font-semibold">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-2 border-red-300 bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="prepared_food">Prepared Food</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            

            <div className="space-y-2">
              <Label className="text-green-700 font-semibold">Urgency</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="border-2 border-green-300 bg-white">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* QUANTITY + UNIT */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-teal-700 font-semibold">Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="border-2 border-teal-300 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-700 font-semibold">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="border-2 border-emerald-300 bg-white">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* EXPIRY DATE */}
          <div className="space-y-2">
            <Label className="text-orange-700 font-semibold">Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left border-2 border-orange-300 bg-white",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-orange-600" />
                  {expiryDate ? format(expiryDate, "PPP") : "Pick expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* MAP PICKER */}
          <div className="space-y-2">
            <Label className="text-red-700 font-semibold flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Pickup Location
            </Label>

            {isLoaded ? (
              <>
                <div className="relative border-2 border-red-300 rounded-lg overflow-hidden">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "200px", borderRadius: "12px" }}
                    center={pickupLocation}
                    zoom={13}
                    onClick={handleMapClick}
                  >
                    <Marker position={pickupLocation} draggable onDragEnd={handleDragEnd} />
                  </GoogleMap>
                </div>

                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <p>
                    Lat: {pickupLocation.lat.toFixed(5)}, Lng: {pickupLocation.lng.toFixed(5)}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseMyLocation}
                    className="flex items-center gap-1 text-blue-600 border-blue-300"
                  >
                    <LocateFixed className="h-4 w-4" /> Use My Location
                  </Button>
                </div>

                <p className="text-xs text-gray-600 italic">
                  {loadingAddress
                    ? "Fetching address..."
                    : pickupAddress
                    ? `📍 ${pickupAddress}`
                    : hasMovedPin
                    ? "No address found"
                    : "Select a location on the map"}
                </p>
              </>
            ) : (
              <p>Loading map...</p>
            )}
          </div>

          {/* PICKUP INSTRUCTIONS */}
          <div className="space-y-2">
            <Label className="text-green-700 font-semibold">Pickup Instructions (optional)</Label>
            <Textarea
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              className="border-2 border-green-300 bg-white"
            />
          </div>

          {/* DESCRIPTION + AI BUTTON */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-teal-700 font-semibold">Description (optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSuggestDescription}
                disabled={aiLoading}
                className="flex items-center gap-1 text-indigo-600 border-indigo-300"
              >
                <Sparkles className="h-4 w-4" />
                {aiLoading ? "Thinking..." : "✨ Suggest"}
              </Button>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe your donation..."
              className="border-2 border-teal-300 bg-white"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-t from-orange-50 via-red-50 to-green-50 pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-2 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-green-500 text-white font-semibold shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Donation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
