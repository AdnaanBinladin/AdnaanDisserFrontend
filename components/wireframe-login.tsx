"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WireframeLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-gray-400">
          <CardHeader className="border-b-2 border-gray-400 p-6">
            <CardTitle className="text-xl font-normal text-center border border-gray-300 p-2">
              [LOGO] Food Waste Reduction System
            </CardTitle>
            <div className="text-center text-sm text-gray-600 mt-2">Login or Register to Continue</div>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-400">
                <TabsTrigger value="login" className="border-r border-gray-400 data-[state=active]:bg-gray-200">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-gray-200">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="[Email Input Field]"
                      className="border-2 border-gray-400 bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Password</Label>
                    <Input
                      type="password"
                      placeholder="[Password Input Field]"
                      className="border-2 border-gray-400 bg-white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">User Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="border-2 border-gray-400 bg-white">
                        <SelectValue placeholder="[Select Role Dropdown]" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-400">
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full border-2 border-gray-400 bg-white text-gray-700 hover:bg-gray-100">
                    [LOGIN BUTTON]
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="[Email Input Field]"
                      className="border-2 border-gray-400 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Password</Label>
                    <Input
                      type="password"
                      placeholder="[Password Input Field]"
                      className="border-2 border-gray-400 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="[Confirm Password Field]"
                      className="border-2 border-gray-400 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">User Role</Label>
                    <Select>
                      <SelectTrigger className="border-2 border-gray-400 bg-white">
                        <SelectValue placeholder="[Select Role Dropdown]" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-400">
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full border-2 border-gray-400 bg-white text-gray-700 hover:bg-gray-100">
                    [REGISTER BUTTON]
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
