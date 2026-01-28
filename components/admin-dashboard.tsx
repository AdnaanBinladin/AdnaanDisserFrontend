"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "donor" | "ngo" | "admin"
  status: "active" | "suspended" | "pending"
  joinDate: string
  lastActive: string
  donationsCount?: number
  claimsCount?: number
}

interface NGOApplication {
  id: string
  organizationName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  registrationNumber: string
  status: "pending" | "approved" | "rejected"
  applicationDate: string
  documents: string[]
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@greengrocer.com",
      role: "donor",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-21",
      donationsCount: 12,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@citybakery.com",
      role: "donor",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-20",
      donationsCount: 8,
    },
    {
      id: "3",
      name: "Community Kitchen",
      email: "info@communitykitchen.org",
      role: "ngo",
      status: "active",
      joinDate: "2024-01-05",
      lastActive: "2024-01-21",
      claimsCount: 15,
    },
    {
      id: "4",
      name: "Food Bank Central",
      email: "contact@foodbankcentral.org",
      role: "ngo",
      status: "pending",
      joinDate: "2024-01-18",
      lastActive: "2024-01-19",
      claimsCount: 0,
    },
    {
      id: "5",
      name: "Mike Wilson",
      email: "mike@restaurant.com",
      role: "donor",
      status: "suspended",
      joinDate: "2024-01-12",
      lastActive: "2024-01-16",
      donationsCount: 3,
    },
  ])

  const [ngoApplications, setNgoApplications] = useState<NGOApplication[]>([
    {
      id: "1",
      organizationName: "Hope Foundation",
      contactPerson: "Emily Davis",
      email: "emily@hopefoundation.org",
      phone: "+1-555-0123",
      address: "123 Main St, Downtown",
      registrationNumber: "NGO-2024-001",
      status: "pending",
      applicationDate: "2024-01-20",
      documents: ["registration.pdf", "tax-exempt.pdf"],
    },
    {
      id: "2",
      organizationName: "Meals on Wheels",
      contactPerson: "Robert Chen",
      email: "robert@mealsonwheels.org",
      phone: "+1-555-0124",
      address: "456 Oak Ave, Midtown",
      registrationNumber: "NGO-2024-002",
      status: "pending",
      applicationDate: "2024-01-19",
      documents: ["registration.pdf", "insurance.pdf", "references.pdf"],
    },
  ])

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user,
      ),
    )
  }

  const approveNGO = (applicationId: string) => {
    setNgoApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: "approved" } : app)))
    // Also add to users list
    const application = ngoApplications.find((app) => app.id === applicationId)
    if (application) {
      const newUser: User = {
        id: `ngo-${applicationId}`,
        name: application.organizationName,
        email: application.email,
        role: "ngo",
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
        claimsCount: 0,
      }
      setUsers((prev) => [...prev, newUser])
    }
  }

  const rejectNGO = (applicationId: string) => {
    setNgoApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: "rejected" } : app)))
  }

  const generateReport = (type: string) => {
    // Simulate report generation
    console.log(`Generating ${type} report...`)
    // In a real app, this would trigger a download
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
        return "bg-primary text-primary-foreground"
      case "suspended":
        return "bg-destructive text-destructive-foreground"
      case "pending":
        return "bg-secondary text-secondary-foreground"
      case "approved":
        return "bg-primary text-primary-foreground"
      case "rejected":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const pendingNGOs = ngoApplications.filter((app) => app.status === "pending").length
  const totalDonations = users.reduce((sum, user) => sum + (user.donationsCount || 0), 0)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, approve NGOs, and generate system reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending NGOs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{pendingNGOs}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{totalDonations}</div>
              <p className="text-xs text-muted-foreground">Food items donated</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="ngos" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Approve NGOs
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Reports
            </TabsTrigger>
          </TabsList>

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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
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
                      {filteredUsers.map((user) => (
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
                              {user.donationsCount && <div>Donations: {user.donationsCount}</div>}
                              {user.claimsCount !== undefined && <div>Claims: {user.claimsCount}</div>}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ngos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NGO Applications</CardTitle>
                <CardDescription>Review and approve NGO registration applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ngoApplications.filter((app) => app.status === "pending").length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pending applications</h3>
                      <p className="text-muted-foreground">All NGO applications have been processed</p>
                    </div>
                  ) : (
                    ngoApplications
                      .filter((app) => app.status === "pending")
                      .map((application) => (
                        <Card key={application.id} className="border-l-4 border-l-secondary">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{application.organizationName}</CardTitle>
                                <CardDescription>Applied on {application.applicationDate}</CardDescription>
                              </div>
                              <Badge className={getStatusColor(application.status)}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">Contact Person:</span>
                                <p>{application.contactPerson}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Email:</span>
                                <p>{application.email}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Phone:</span>
                                <p>{application.phone}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Registration #:</span>
                                <p>{application.registrationNumber}</p>
                              </div>
                              <div className="md:col-span-2">
                                <span className="font-medium text-muted-foreground">Address:</span>
                                <p>{application.address}</p>
                              </div>
                              <div className="md:col-span-2">
                                <span className="font-medium text-muted-foreground">Documents:</span>
                                <div className="flex gap-2 mt-1">
                                  {application.documents.map((doc, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                              <Button onClick={() => approveNGO(application.id)} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => rejectNGO(application.id)}
                                className="flex items-center gap-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    User Reports
                  </CardTitle>
                  <CardDescription>Generate comprehensive user activity reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => generateReport("user-activity")} className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download User Activity Report
                  </Button>
                  <Button
                    onClick={() => generateReport("user-registrations")}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Registration Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Donation Reports
                  </CardTitle>
                  <CardDescription>Track donation patterns and impact metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => generateReport("donation-summary")} className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Donation Summary
                  </Button>
                  <Button
                    onClick={() => generateReport("impact-report")}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Impact Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    NGO Reports
                  </CardTitle>
                  <CardDescription>Monitor NGO performance and engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => generateReport("ngo-activity")} className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download NGO Activity Report
                  </Button>
                  <Button
                    onClick={() => generateReport("ngo-approvals")}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Approval History
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Reports
                  </CardTitle>
                  <CardDescription>Overall system health and usage statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => generateReport("system-overview")} className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download System Overview
                  </Button>
                  <Button
                    onClick={() => generateReport("monthly-summary")}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Monthly Summary
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
