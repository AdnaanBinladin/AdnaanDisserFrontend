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
import { toast } from "@/hooks/use-toast"





export function AddDonationDialog({
  open,
  onOpenChange,
  donorId,
  onAdded,
  donation,
  isEdit = false,
}: any)
 {
  
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
  const [errors, setErrors] = useState<Record<string, string>>({})


  useEffect(() => {
    if (!open) return
    if (isEdit && donation) {
      setTitle(donation.title)
      setDescription(donation.description || "")
      setCategory(donation.category)
      setQuantity(String(donation.quantity))
      setUnit(donation.unit)
      setExpiryDate(new Date(donation.expiry_date))
      setPickupAddress(donation.pickup_address)
      setPickupInstructions(donation.pickup_instructions || "")
      setUrgency(donation.urgency)
  
      if (donation.pickup_lat && donation.pickup_lng) {
        setPickupLocation({
          lat: donation.pickup_lat,
          lng: donation.pickup_lng,
        })
        setHasMovedPin(true)
      }
    }
  }, [open, isEdit, donation])
  

  // ✅ Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "maps"],
  })

  // 🌍 Reverse Geocoding (to show address)
  const fetchDistrictFromCoords = async (lat: number, lng: number) => {
    setLoadingAddress(true)
  
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
  
      const data = await res.json()
  
      if (data.status === "OK" && Array.isArray(data.results)) {
        for (const result of data.results) {
          const district = result.address_components.find(
            (c: any) =>
              c.types.includes("administrative_area_level_1") &&
              c.long_name.toLowerCase().includes("district")
          )
  
          if (district) {
            setPickupAddress(district.long_name)
  
            // ✅ clear error
            setErrors(prev => ({
              ...prev,
              pickupAddress: ""
            }))
            return
          }
        }
      }
  
      setPickupAddress("Address not found")
    } catch {
      setPickupAddress("Address not found")
    } finally {
      setLoadingAddress(false)
    }
  }
  
  
  

  // 📍 Auto-detect location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser.")
      return
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
  
        setHasMovedPin(true)
        setPickupLocation({ lat, lng })
  
        // ✅ clear map-related errors immediately
        setErrors(prev => ({
          ...prev,
          pickupLocation: "",
          pickupAddress: ""
        }))
  
        // 🌍 fetch district after state update
        fetchDistrictFromCoords(lat, lng)
      },
      () => {
        alert("Unable to fetch your location.")
      }
    )
  }
  

  // 🗺️ Map events
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
  
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
  
    setHasMovedPin(true)
    setPickupLocation({ lat, lng })
  
    // ✅ clear errors immediately
    setErrors(prev => ({
      ...prev,
      pickupLocation: "",
      pickupAddress: ""
    }))
  
    setTimeout(() => fetchDistrictFromCoords(lat, lng), 0)
  }
  
  
  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
  
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
  
    setHasMovedPin(true)
    setPickupLocation({ lat, lng })
  
    // ✅ clear errors immediately
    setErrors(prev => ({
      ...prev,
      pickupLocation: "",
      pickupAddress: ""
    }))
  
    setTimeout(() => fetchDistrictFromCoords(lat, lng), 0)
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
  

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
  
    if (!title.trim()) newErrors.title = "Title is required"
    if (!category) newErrors.category = "Please select a category"
  
    if (!quantity) {
      newErrors.quantity = "Quantity is required"
    } else if (Number(quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than zero"
    }
  
    if (!unit) newErrors.unit = "Please select a unit"
    if (!expiryDate) newErrors.expiryDate = "Expiry date is required"
  
    if (!hasMovedPin) {
      newErrors.pickupLocation = "Please select a pickup location on the map"
    }
  
    if (!pickupAddress || pickupAddress === "Address not found") {
      newErrors.pickupAddress = "Pickup address could not be resolved"
    }
  
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  

  // 💾 Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!validateForm()) return

    if (loadingAddress) {
      setErrors(prev => ({
        ...prev,
        pickupAddress: "Please wait while the address is being resolved"
      }))
      return
    }

    setIsSubmitting(true)
  
    const payload = {
      donor_id: donorId,
      title,
      description,
      category,
      quantity,
      unit,
      expiry_date: expiryDate ? format(expiryDate, "yyyy-MM-dd") : "",
      pickup_lat: pickupLocation.lat,
      pickup_lng: pickupLocation.lng,
      pickup_address: pickupAddress,
      pickup_instructions: pickupInstructions,
      urgency: computeUrgency(),
    }
    
  
    try {
      let res
    
      if (isEdit && donation) {
        // ✏️ EDIT
        res = await fetch(
          `http://localhost:5050/api/donations/${donation.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        )
      } else {
        // ➕ ADD
        res = await addDonation(payload)
      }
    
      const result = res?.json ? await res.json() : res
    
      if (result?.data) {
        onAdded(result.data[0])
        onOpenChange(false)
        resetForm()
        setErrors({})

        toast({
          title: isEdit ? "Donation updated" : "Donation added",
          description: isEdit
            ? "Your donation was updated successfully."
            : "Your donation is now visible to NGOs.",
        })
      }
    } catch {
      toast({
        title: "Action failed",
        description: "Please check your details and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

  useEffect(() => {
    if (open && !isEdit) {
      resetForm()
      setErrors({})
    }
  }, [open, isEdit])
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 via-red-50 to-green-50 border-4 border-orange-300 relative -translate-y-[950px] md:-translate-y-[1000px] rounded-xl shadow-2xl transition-transform duration-300 ease-out scroll-smooth" >
        <Apple className="absolute top-4 right-4 h-24 w-24 text-red-500 opacity-10 rotate-12" />
        <Carrot className="absolute bottom-4 left-4 h-20 w-20 text-orange-500 opacity-10 -rotate-12" />

        <DialogHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-green-500 -mx-6 -mt-6 px-6 py-4 mb-4 rounded-t-lg">
        <DialogTitle className="flex items-center gap-2 text-white text-xl">
  <Package className="h-6 w-6" />
  {isEdit ? "Edit Donation" : "Add New Donation"}
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
              onChange={(e) => {
                setTitle(e.target.value)
                setErrors(prev => ({ ...prev, title: "" }))
              }}
              required
              placeholder="e.g. Fresh Apples"
              className={cn(
                "border-2 bg-white",
                errors.title ? "border-red-500" : "border-orange-300"
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* CATEGORY + URGENCY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-red-700 font-semibold">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => {
                  setCategory(value)
                  setErrors(prev => ({ ...prev, category: "" }))
                }}
              >
                <SelectTrigger className={cn(
                  "border-2 bg-white",
                  errors.category ? "border-red-500" : "border-red-300"
                )}>
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
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
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
  min={1}
  step={1}
  value={quantity}
  onChange={(e) => {
    const val = e.target.value
    setQuantity(val)

    // 🔴 Live validation
    if (!val) {
      setErrors(prev => ({ ...prev, quantity: "Quantity is required" }))
    } else if (Number(val) <= 0) {
      setErrors(prev => ({ ...prev, quantity: "Quantity must be greater than zero" }))
    } else {
      setErrors(prev => ({ ...prev, quantity: "" }))
    }
  }}
  className={cn(
    "border-2 bg-white",
    errors.quantity ? "border-red-500" : "border-teal-300"
  )}
/>

{errors.quantity && (
  <p className="text-sm text-red-600">{errors.quantity}</p>
)}

            </div>
            <div className="space-y-2">
              <Label className="text-emerald-700 font-semibold">Unit</Label>
              <Select 
                value={unit} 
                onValueChange={(value) => {
                  setUnit(value)
                  setErrors(prev => ({ ...prev, unit: "" }))
                }}
              >
                <SelectTrigger className={cn(
                  "border-2 bg-white",
                  errors.unit ? "border-red-500" : "border-emerald-300"
                )}>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-red-600">{errors.unit}</p>
              )}
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
                    "w-full justify-start text-left border-2 bg-white",
                    errors.expiryDate ? "border-red-500" : "border-orange-300",
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
  onSelect={(date) => {
    if (date) {
      setExpiryDate(date)
      setErrors(prev => ({ ...prev, expiryDate: "" }))
    }
  }}
  disabled={(date) => date <= new Date()}
  initialFocus
/>

              </PopoverContent>
            </Popover>
            {errors.expiryDate && (
              <p className="text-sm text-red-600">{errors.expiryDate}</p>
            )}
          </div>

          {/* MAP PICKER */}
<div className="space-y-2">
  <Label className="text-red-700 font-semibold flex items-center gap-1">
    <MapPin className="h-4 w-4" /> Pickup Location
  </Label>

  {isLoaded ? (
    <>
      {/* 🗺️ MAP */}
      <div className="relative border-2 border-red-300 rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "250px", borderRadius: "12px" }}
          center={pickupLocation}
          zoom={14}
          onClick={handleMapClick}
        >
          {/* 📍 MARKER */}
          <Marker
            position={pickupLocation}
            draggable
            onDragEnd={handleDragEnd}
          />
        </GoogleMap>
      </div>

      <p className="text-xs italic">
        {loadingAddress && "Fetching address..."}
        {!loadingAddress && pickupAddress && (
          <span className="text-green-600">
            📍 District: {pickupAddress} | Lat: {pickupLocation.lat.toFixed(6)}, Lng: {pickupLocation.lng.toFixed(6)}
          </span>
        )}
        {!loadingAddress && !pickupAddress && (
          <span>Search or select a location | Lat: {pickupLocation.lat.toFixed(6)}, Lng: {pickupLocation.lng.toFixed(6)}</span>
        )}
      </p>
    </>
  ) : (
    <p>Loading map...</p>
  )}
  {errors.pickupLocation && (
    <p className="text-sm text-red-600">{errors.pickupLocation}</p>
  )}
  {errors.pickupAddress && (
    <p className="text-sm text-red-600">{errors.pickupAddress}</p>
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
  disabled={
    isSubmitting ||
    !title ||
    !category ||
    !unit ||
    !expiryDate ||
    Number(quantity) <= 0 ||
    loadingAddress
  }
>
{isSubmitting
  ? isEdit ? "Saving..." : "Adding..."
  : isEdit ? "Save Changes" : "Add Donation"}

</Button>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
