"use client";

import { claimDonation } from "@/lib/donations";
import { MessageCircle } from "lucide-react";

import TopRightMenu from "@/components/TopRightMenu";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Search,
  Package,
  CheckCircle,
  Filter,
  Apple,
  Carrot,
  Leaf,
} from "lucide-react";


// ---------------------------
// Donation Interface
// ---------------------------
interface Donation {
  id: string;
  itemName: string;
  quantity: string;
  unit: "kg" | "pieces" | "liters" | "boxes";
  donorName: string;
  donorPhone?: string;
  location: string;
  expiryDate: string;
  category?: string;
  status?: string;
  claimedDate?: string;
}

const openWhatsApp = (phone?: string, donorName?: string) => {
  if (!phone) {
    alert("Donor phone number not available");
    return;
  }

  const cleanPhone = phone.replace(/\D/g, "");

  const message = encodeURIComponent(
    `Hello ${donorName || ""}, this is an NGO contacting you regarding a food donation we claimed.`
  );

  window.open(
    `https://wa.me/${cleanPhone}?text=${message}`,
    "_blank"
  );
};


const getUnitIcon = (unit: Donation["unit"]) => {
  switch (unit) {
    case "kg":
      return "⚖️";
    case "pieces":
      return "🔢";
    case "liters":
      return "🧴";
    case "boxes":
      return "📦";
    default:
      return "📦";
  }
};


// ---------------------------
// MAIN COMPONENT
// ---------------------------
export function NgoDashboard() {
  // Stats
  const [availableCount, setAvailableCount] = useState(0);
  const [claimedCount, setClaimedCount] = useState(0);
  const [urgentCount, setUrgentCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
const [cancelledCount, setCancelledCount] = useState(0);


  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [itemFilter, setItemFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");


  // Lists
  const [rawAvailable, setRawAvailable] = useState<Donation[]>([]);
  const [filteredAvailableDonations, setFilteredAvailableDonations] = useState<
    Donation[]
  >([]);
  const [claimedDonations, setClaimedDonations] = useState<Donation[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const filterClass = "h-11 w-full border-2 bg-white";


  // ---------------------------
  // Fetch Dashboard Data
  // ---------------------------
  useEffect(() => {
    fetchNgoDashboard();
  }, []);

  const fetchNgoDashboard = async () => {
    try {
      setLoading(true);
  
      const ngoId = localStorage.getItem("ngoId");
  
      if (!ngoId) {
        setError("NGO not logged in");
        return;
      }
  
      const res = await fetch(
        `http://localhost:5050/api/ngo-dashboard/?ngoId=${ngoId}`,
        {
          method: "GET",
        }
      );
  
      if (!res.ok) throw new Error("Failed to load dashboard data");
  
      const data = await res.json();
  
      const mappedAvailable = data.available.map((d: any) => ({
        id: d.id,
        itemName: d.title,
        quantity: d.quantity,
unit: d.unit,

        expiryDate: d.expiry_date,
        donorName: "Unknown Donor",
        location: d.pickup_address || "Address not found",
        category: d.category,
        status: d.status,
      }));
  
      const mappedClaimed =
        data.claimed?.map((d: any) => ({
          id: d.id,
          itemName: d.title,
          quantity: d.quantity,
unit: d.unit,

          expiryDate: d.expiry_date,
          donorName: d.donor_name || "Donor not found",
          donorPhone: d.donor_phone || "Phone not found",
          location: d.pickup_address || "Address not found",
          claimedDate: d.claimed_date,
        })) || [];
  
      setRawAvailable(mappedAvailable);
      setFilteredAvailableDonations(mappedAvailable);
      setClaimedDonations(mappedClaimed);

      setCompletedCount(data.completed?.length || 0);
      setCancelledCount(data.cancelled?.length || 0);

      
  
      setAvailableCount(mappedAvailable.length);
      setClaimedCount(mappedClaimed.length);
      setUrgentCount(data.urgent?.length || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  // ---------------------------
  // CATEGORY SLUG
  // ---------------------------
  const deriveCategory = (d: Donation): string => {
    if (d.category && d.category.trim() !== "") {
      return d.category.toLowerCase();
    }

    const t = d.itemName.toLowerCase();

    if (["apple", "banana", "mango", "pear"].some((x) => t.includes(x))) return "fruits";
    if (["carrot", "spinach", "veg"].some((x) => t.includes(x))) return "vegetables";
    if (["milk", "yoghurt"].some((x) => t.includes(x))) return "dairy";
    if (["rice", "pasta"].some((x) => t.includes(x))) return "grains";

    return "other";
  };


  // ---------------------------
  // FILTER LOGIC
  // ---------------------------
  useEffect(() => {
    applyFilters();
  }, [searchTerm, expiryFilter, itemFilter, districtFilter, rawAvailable]);

  const applyFilters = () => {
    let list = [...rawAvailable];

    // Search
    if (searchTerm.trim() !== "") {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (d) =>
          d.itemName.toLowerCase().includes(s) ||
          d.donorName.toLowerCase().includes(s)
      );
    }

    // Category
    if (itemFilter !== "all") {
      list = list.filter((d) => deriveCategory(d) === itemFilter);
    }

    // District filter
    if (districtFilter !== "all") {
      const cleanDistrict = districtFilter
        .replace(" District", "")
        .toLowerCase();
    
      list = list.filter((d) =>
        d.location.toLowerCase().includes(cleanDistrict)
      );
    }
    


    // Expiry
    if (expiryFilter !== "all") {
      const now = new Date();
      list = list.filter((d) => {
        const exp = new Date(d.expiryDate + "T23:59:59");

        const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        if (expiryFilter === "urgent") {
          return diff >= 0 && diff <= 2;
        }
        
        if (expiryFilter === "week") return diff <= 7;
        if (expiryFilter === "month") return diff <= 30;

        return true;
      });
    }

    setFilteredAvailableDonations(list);
  };


  // ---------------------------
  // Expiry Badge
  // ---------------------------
  const getExpiryUrgency = (dateString: string) => {
    const exp = new Date(dateString);
    const now = new Date();
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diff <= 2) return { label: "Urgent" };
    if (diff <= 7) return { label: "Soon" };
    return { label: "Normal" };
  };


  // ---------------------------
  // Claim 
  // ---------------------------
  const handleClaimDonation = async (id: string) => {
    try {
      setClaimingId(id);
  
      const ngoId = localStorage.getItem("ngoId");
  
      if (!ngoId) {
        alert("You must be logged in as an NGO to claim a donation.");
        return;
      }
  
      await claimDonation(id, ngoId);
      await fetchNgoDashboard();
    } catch (err: any) {
      alert(err.message || "Failed to claim donation");
    } finally {
      setClaimingId(null);
    }
  };
  


  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-green-50 p-4 md:p-6 relative overflow-hidden">

      {/* Decorative icons */}
      <Apple className="absolute top-20 left-10 w-32 h-32 text-orange-500 opacity-10 rotate-12" />
      <Carrot className="absolute top-40 right-20 w-24 h-24 text-red-500 opacity-10 -rotate-12" />
      <Leaf className="absolute bottom-20 left-1/4 w-28 h-28 text-green-500 opacity-10 rotate-45" />

      <div className="max-w-7xl mx-auto relative z-10">

      {/* HEADER */}
      <div className="mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-green-500 rounded-2xl p-8 shadow-lg">
  <div className="flex justify-between items-center">
    {/* LEFT */}
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Package className="w-8 h-8" />
        NGO Dashboard
      </h1>
      <p className="text-white/90">
        Browse and claim food donations
      </p>
    </div>

    {/* RIGHT ACTIONS */}
    <div className="flex gap-3">
      {/* MY CLAIMS */}
      <Button
        variant="secondary"
        className="bg-white/90 text-orange-600 hover:bg-white"
        onClick={() => window.location.href = "/ngo/dashboard/claims"}
      >
        📦 My Claims
      </Button>

      {/* IMPACT */}
      <Button
        variant="outline"
        className="border-white text-white hover:bg-white/10"
        onClick={() => {
          document.getElementById("impact-section")?.scrollIntoView({
            behavior: "smooth",
          })
        }}
      >
        📊 Impact
      </Button>
    </div>

    <TopRightMenu />
  </div>
</div>




        {/* STATS */}
        {/* STATS */}
<div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

{/* AVAILABLE */}
<Card className="border-2 border-orange-500 bg-orange-50">
  <CardHeader>
    <CardTitle className="text-orange-700">Available</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-orange-600">
      {availableCount}
    </div>
  </CardContent>
</Card>

{/* CLAIMED */}
<Card className="border-2 border-green-500 bg-green-50">
  <CardHeader>
    <CardTitle className="text-green-700">Claimed</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-green-600">
      {claimedCount}
    </div>
  </CardContent>
</Card>

{/* COMPLETED */}
<Card className="border-2 border-emerald-500 bg-emerald-50">
  <CardHeader>
    <CardTitle className="text-emerald-700">Completed</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-emerald-600">
      {completedCount}
    </div>
  </CardContent>
</Card>

{/* CANCELLED */}
<Card className="border-2 border-slate-500 bg-slate-50">
  <CardHeader>
    <CardTitle className="text-slate-700">Cancelled</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-slate-600">
      {cancelledCount}
    </div>
  </CardContent>
</Card>

{/* URGENT */}
<Card className="border-2 border-red-500 bg-red-50">
  <CardHeader>
    <CardTitle className="text-red-700">Urgent</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-red-600">
      {urgentCount}
    </div>
  </CardContent>
</Card>

</div>



        {/* TABS */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="bg-white border-2 border-orange-200">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="claimed">Claimed</TabsTrigger>
          </TabsList>


          {/* AVAILABLE TAB */}
          <TabsContent value="available" className="space-y-6">

            {/* FILTER PANEL */}
            <Card className="border-2 border-teal-500 bg-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-700">
                  <Filter className="h-5 w-5" /> Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">


                  {/* SEARCH */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                    <Input
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className={`${filterClass} pl-10 border-orange-300`}
/>

                  </div>

                  {/* CATEGORY */}
                  <Select value={itemFilter} onValueChange={setItemFilter}>
                  <SelectTrigger className={`${filterClass} border-purple-300`}>
                      <SelectValue placeholder="Item type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="prepared_food">Prepared Food</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* DISTRICT FILTER */}
<Select value={districtFilter} onValueChange={setDistrictFilter}>
<SelectTrigger className={`${filterClass} border-blue-300`}>
    <SelectValue placeholder="District" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Districts</SelectItem>
    <SelectItem value="Black River District">Black River</SelectItem>
    <SelectItem value="Flacq District">Flacq</SelectItem>
    <SelectItem value="Grand Port District">Grand Port</SelectItem>
    <SelectItem value="Moka District">Moka</SelectItem>
    <SelectItem value="Pamplemousses District">Pamplemousses</SelectItem>
    <SelectItem value="Plaines Wilhems District">Plaines Wilhems</SelectItem>
    <SelectItem value="Port Louis District">Port Louis</SelectItem>
    <SelectItem value="Rivière du Rempart District">Rivière du Rempart</SelectItem>
    <SelectItem value="Savanne District">Savanne</SelectItem>
  </SelectContent>
</Select>


                  {/* EXPIRY FILTER */}
                  <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                  <SelectTrigger className={`${filterClass} border-green-300`}>
                      <SelectValue placeholder="Expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="urgent">Urgent (2 days)</SelectItem>
                      <SelectItem value="week">Within 1 Week</SelectItem>
                      <SelectItem value="month">Within 1 Month</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* CLEAR */}
                  <Button
  variant="ghost"
  size="sm"
  onClick={() => {
    setSearchTerm("");
    setItemFilter("all");
    setDistrictFilter("all");
    setExpiryFilter("all");
  }}
  className="h-10 text-teal-700 hover:bg-teal-100"
>
  Clear
</Button>


                </div>
              </CardContent>
            </Card>



            {/* LOADING / ERROR */}
            {loading && (
              <p className="text-center text-orange-600">Loading...</p>
            )}
            {error && <p className="text-center text-red-600">{error}</p>}



            {/* AVAILABLE DONATION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableDonations.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Package className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-orange-700">
                    No donations found
                  </h3>
                </div>
              ) : (
                filteredAvailableDonations.map((donation) => {
                  const urgency = getExpiryUrgency(donation.expiryDate);

                  return (
                    <Card
                      key={donation.id}
                      className="border-2 border-orange-400 bg-white shadow-lg"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          {/* Title */}
                          <CardTitle className="text-lg">
                            {donation.itemName}
                          </CardTitle>
                  
                          {/* RIGHT SIDE: stacked badges */}
                          <div className="flex flex-col items-end gap-1">
                            {/* Urgency badge */}
                            <Badge
                              className={
                                urgency.label === "Urgent"
                                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                                  : urgency.label === "Soon"
                                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              }
                            >
                              {urgency.label}
                            </Badge>
                  
                            {/* Category badge (UNDER Normal) */}
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-300 text-gray-700 bg-gray-50"
                            >
                              {(donation.category ?? deriveCategory(donation))
                                .replace("_", " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Badge>
                          </div>
                        </div>
                  
                        {/* District badge (unchanged position) */}
                        <CardDescription className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                            {donation.location.replace(" District", "")}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                  
                      <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
  <span>{getUnitIcon(donation.unit)}</span>
  <span>
    {donation.quantity}{" "}
    {donation.unit.charAt(0).toUpperCase() + donation.unit.slice(1)}
  </span>
</div>

                        <p>Expires: {donation.expiryDate}</p>
                  
                        <Button
                          onClick={() => handleClaimDonation(donation.id)}
                          disabled={claimingId === donation.id}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
                        >
                          {claimingId === donation.id ? "Claiming..." : "Claim Donation"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                  
                })
              )}
            </div>
          </TabsContent>



{/* CLAIMED TAB */}
<TabsContent value="claimed">
  <Card className="border-2 border-green-500 bg-green-50">
    <CardHeader>
      <CardTitle className="text-green-700">
        Claimed Donations
      </CardTitle>
      <CardDescription>
        Donations successfully claimed by your organization
      </CardDescription>
    </CardHeader>

    <CardContent>
      {claimedDonations.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            You haven’t claimed any donations yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claimedDonations.map((donation) => (
            <div
              key={donation.id}
              className="p-4 border-l-4 border-green-500 bg-white rounded-md shadow-sm space-y-2"
            >
              {/* TITLE */}
              <h4 className="font-semibold text-lg text-green-700">
                {donation.itemName}
              </h4>

              {/* QUANTITY */}
              <p className="text-sm">
                Quantity: <span className="font-medium">{donation.quantity}</span>
              </p>

              {/* PICKUP ADDRESS */}
              <p className="text-sm text-gray-700">
                📍 Pickup Address:
                <br />
                <span className="font-medium">
                  {donation.location || "Address not provided"}
                </span>
              </p>

              {/* CLAIM DATE */}
              {donation.claimedDate && (
                <p className="text-xs text-gray-500">
                  Claimed on:{" "}
                  {new Date(donation.claimedDate).toLocaleDateString()}
                </p>
              )}

              {/* ACTIONS */}
              <div className="pt-2">
              <Button
  variant="outline"
  size="sm"
  className="border-green-500 text-green-700 hover:bg-green-100 flex items-center gap-2"
  onClick={() =>
    openWhatsApp(donation.donorPhone, donation.donorName)
  }
  disabled={!donation.donorPhone}
>
  <MessageCircle className="h-4 w-4" />
  Contact Donor via WhatsApp
</Button>

              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
