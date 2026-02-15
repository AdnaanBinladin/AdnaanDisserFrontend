"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Users,
  Building2,
  FileText,
  Search,
  Download,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { getPendingNGOs, approveNGO, rejectNGO, getAllUsers, getAdminStats, type PendingNGO } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "donor" | "ngo" | "admin"
  status: "active" | "suspended" | "pending" | "rejected"
  joinDate: string
  lastActive: string
  donationsCount?: number
  claimsCount?: number
}

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("ngos")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [isRejecting, setIsRejecting] = useState<string | null>(null)
  const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingNGOs: 0,
    totalDonations: 0,
  })
  
  // Rejection dialog state
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectingNGO, setRejectingNGO] = useState<PendingNGO | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const { toast } = useToast()

  // Fetch data on component mount
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null
    if (role !== "admin") {
      toast({
        title: "Access denied",
        description: "Please sign in with an admin account.",
        variant: "destructive",
      })
      router.push("/")
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [ngosRes, usersRes, statsRes] = await Promise.allSettled([
        getPendingNGOs(),
        getAllUsers(),
        getAdminStats(),
      ])

      const ngosData = ngosRes.status === "fulfilled" ? ngosRes.value : []
      const usersData = usersRes.status === "fulfilled" ? usersRes.value : { users: [] }
      const statsData = statsRes.status === "fulfilled" ? statsRes.value : null

      setPendingNGOs(Array.isArray(ngosData) ? ngosData : [])
      
      // Transform users data if needed
      if (usersData.users) {
        setUsers(usersData.users.map((u: { id: string; full_name: string; email: string; role: string; status: string; created_at: string; last_active: string; donations_count?: number; claims_count?: number }) => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: u.role as "donor" | "ngo" | "admin",
          status: u.status as "active" | "suspended" | "pending" | "rejected",
          joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A",
          lastActive: u.last_active ? new Date(u.last_active).toLocaleDateString() : "N/A",
          donationsCount: u.donations_count || 0,
          claimsCount: u.claims_count || 0,
        })))
      }

      if (statsData) {
        setStats({
          totalUsers: statsData.total_users || users.length,
          activeUsers: statsData.active_users || users.filter(u => u.status === "active").length,
          pendingNGOs: statsData.pending_ngos ?? (Array.isArray(ngosData) ? ngosData.length : 0),
          totalDonations: statsData.total_donations || 0,
        })
      } else {
        setStats(prev => ({
          ...prev,
          pendingNGOs: Array.isArray(ngosData) ? ngosData.length : 0,
        }))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPendingNGOs = async () => {
    try {
      const ngosData = await getPendingNGOs()
      const pending = Array.isArray(ngosData) ? ngosData : []
      setPendingNGOs(pending)
      setStats((prev) => ({
        ...prev,
        pendingNGOs: pending.length,
      }))
    } catch (error) {
      console.error("Error refreshing pending NGOs:", error)
    }
  }

  const handleApproveNGO = async (ngo: PendingNGO) => {
    setIsApproving(ngo.user_id)
    try {
      const result = await approveNGO(ngo.user_id)
      if (result.success) {
        toast({
          title: "NGO Approved",
          description: `${ngo.full_name} has been approved. An email notification has been sent.`,
        })
        // Remove from pending list
        setPendingNGOs(prev => prev.filter(
          (n) => n.user_id !== ngo.user_id && n.org_id !== ngo.org_id
        ))
        setUsers((prev) =>
          prev.map((u) => (u.id === ngo.user_id ? { ...u, status: "active" } : u))
        )
        setStats(prev => ({
          ...prev,
          pendingNGOs: Math.max(prev.pendingNGOs - 1, 0),
          activeUsers: prev.activeUsers + 1,
        }))
        await refreshPendingNGOs()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve NGO",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error approving NGO:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsApproving(null)
    }
  }

  const openRejectDialog = (ngo: PendingNGO) => {
    setRejectingNGO(ngo)
    setRejectionReason("")
    setShowRejectDialog(true)
  }

  const handleRejectNGO = async () => {
    if (!rejectingNGO) return
    
    setIsRejecting(rejectingNGO.user_id)
    try {
      const result = await rejectNGO(rejectingNGO.user_id, rejectionReason)
      if (result.success) {
        toast({
          title: "NGO Rejected",
          description: `${rejectingNGO.full_name} has been rejected.`,
        })
        // Remove from pending list
        setPendingNGOs(prev => prev.filter(
          (n) => n.user_id !== rejectingNGO.user_id && n.org_id !== rejectingNGO.org_id
        ))
        setUsers((prev) =>
          prev.map((u) => (u.id === rejectingNGO.user_id ? { ...u, status: "rejected" } : u))
        )
        setStats(prev => ({
          ...prev,
          pendingNGOs: Math.max(prev.pendingNGOs - 1, 0),
          activeUsers: Math.max(prev.activeUsers - 1, 0),
        }))
        setShowRejectDialog(false)
        setRejectingNGO(null)
        await refreshPendingNGOs()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject NGO",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error rejecting NGO:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(null)
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user,
      ),
    )
  }

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report...`)
    toast({
      title: "Generating Report",
      description: `${type} report is being generated...`,
    })
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white"
      case "suspended":
        return "bg-red-500 text-white"
      case "pending":
        return "bg-amber-500 text-white"
      case "approved":
        return "bg-green-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, approve NGOs, and generate system reports</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchData} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending NGOs</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pendingNGOs}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonations}</div>
              <p className="text-xs text-muted-foreground">Food items donated</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="ngos" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Approve NGOs
              {stats.pendingNGOs > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white">{stats.pendingNGOs}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Reports
            </TabsTrigger>
          </TabsList>

          {/* NGO Approvals Tab */}
          <TabsContent value="ngos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending NGO Applications</CardTitle>
                <CardDescription>Review and approve NGO registration applications. Approved NGOs will receive an email notification.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : pendingNGOs.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No pending applications</h3>
                    <p className="text-muted-foreground">All NGO applications have been processed</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingNGOs.map((ngo) => (
                      <Card key={ngo.user_id} className="border-l-4 border-l-amber-500">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-amber-600" />
                                {ngo.full_name}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                Applied on {formatDate(ngo.created_at)}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(ngo.status || "pending")}>
                              {(ngo.status || "pending").charAt(0).toUpperCase() + (ngo.status || "pending").slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Email:</span>
                              <span className="text-muted-foreground">{ngo.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Phone:</span>
                              <span className="text-muted-foreground">{ngo.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-start gap-2 md:col-span-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="font-medium">Address:</span>
                              <span className="text-muted-foreground">{ngo.address || "N/A"}</span>
                            </div>
                            {ngo.description && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Description:</span>
                                <p className="text-muted-foreground mt-1">{ngo.description}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-3 pt-4 border-t">
                            <Button 
                              onClick={() => handleApproveNGO(ngo)} 
                              disabled={isApproving === ngo.user_id}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                            >
                              {isApproving === ngo.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Approve & Send Email
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => openRejectDialog(ngo)}
                              disabled={isRejecting === ngo.user_id}
                              className="flex items-center gap-2"
                            >
                              {isRejecting === ngo.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Search and filter users, manage their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="donor">Donors</SelectItem>
                      <SelectItem value="ngo">NGOs</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setRoleFilter("all")
                      setStatusFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left py-4 px-6 font-medium">Name</th>
                          <th className="text-left py-4 px-6 font-medium">Email</th>
                          <th className="text-left py-4 px-6 font-medium">Role</th>
                          <th className="text-left py-4 px-6 font-medium">Status</th>
                          <th className="text-left py-4 px-6 font-medium">Activity</th>
                          <th className="text-left py-4 px-6 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-4 px-6 font-medium">{user.name}</td>
                              <td className="py-4 px-6 text-muted-foreground">{user.email}</td>
                              <td className="py-4 px-6">
                                <Badge variant="outline" className="capitalize">
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="py-4 px-6">
                                <Badge className={getStatusColor(user.status)}>
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="py-4 px-6 text-sm text-muted-foreground">
                                <div>
                                  <div>Joined: {user.joinDate}</div>
                                  <div>Last active: {user.lastActive}</div>
                                  {user.donationsCount !== undefined && user.donationsCount > 0 && (
                                    <div>Donations: {user.donationsCount}</div>
                                  )}
                                  {user.claimsCount !== undefined && user.claimsCount > 0 && (
                                    <div>Claims: {user.claimsCount}</div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={user.status === "active"}
                                    onCheckedChange={() => toggleUserStatus(user.id)}
                                    disabled={user.status === "pending"}
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {user.status === "active" ? "Active" : "Suspended"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    User Reports
                  </CardTitle>
                  <CardDescription>Generate reports about user activity and registrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => generateReport("User Activity")} className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    User Activity Report
                  </Button>
                  <Button onClick={() => generateReport("New Registrations")} className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    New Registrations Report
                  </Button>
                  <Button onClick={() => generateReport("User Roles")} className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    User Roles Distribution
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Donation Reports
                  </CardTitle>
                  <CardDescription>Generate reports about donations and claims</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => generateReport("Donation Summary")} className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Donation Summary Report
                  </Button>
                  <Button onClick={() => generateReport("Claims Report")} className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Claims Report
                  </Button>
                  <Button onClick={() => generateReport("Impact Report")} className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Impact Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Rejection Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject NGO Application</DialogTitle>
              <DialogDescription>
                You are about to reject the application from <strong>{rejectingNGO?.full_name}</strong>. 
                Optionally provide a reason for rejection.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Rejection (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for rejecting this application..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectNGO}
                disabled={isRejecting !== null}
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
