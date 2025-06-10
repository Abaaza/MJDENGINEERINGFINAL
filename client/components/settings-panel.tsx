"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, Palette, Key, Save } from "lucide-react"
import { useApiKeys } from "@/contexts/api-keys-context"

export function SettingsPanel() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  })
  const { openaiKey, cohereKey, geminiKey, setKeys } = useApiKeys()

  return (
    <div className="max-w-4xl">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass-effect border-white/10 mb-8">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
          >
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="apikeys"
            className="data-[state=active]:bg-[#00D4FF]/20 data-[state=active]:text-[#00D4FF]"
          >
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue="John"
                    className="bg-white/5 border-white/10 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue="Engineer"
                    className="bg-white/5 border-white/10 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.engineer@company.com"
                  className="bg-white/5 border-white/10 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">
                  Role
                </Label>
                <Select defaultValue="senior">
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-white/10">
                    <SelectItem value="senior">Senior Engineer</SelectItem>
                    <SelectItem value="lead">Lead Engineer</SelectItem>
                    <SelectItem value="manager">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-[#00D4FF] to-[#00FF88] hover:from-[#00D4FF]/80 hover:to-[#00FF88]/80 text-black font-semibold ripple">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Receive push notifications in browser</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">SMS Notifications</Label>
                  <p className="text-sm text-gray-400">Receive important updates via SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-white">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="bg-white/5 border-white/10 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="bg-white/5 border-white/10 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-white/5 border-white/10 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20"
                />
              </div>
              <Button className="bg-gradient-to-r from-[#00D4FF] to-[#00FF88] hover:from-[#00D4FF]/80 hover:to-[#00FF88]/80 text-black font-semibold ripple">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-white/10">
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Accent Color</Label>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#00D4FF] cursor-pointer border-2 border-white/20"></div>
                  <div className="w-8 h-8 rounded-full bg-[#00FF88] cursor-pointer border-2 border-transparent"></div>
                  <div className="w-8 h-8 rounded-full bg-[#FF6B35] cursor-pointer border-2 border-transparent"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apikeys" className="space-y-6">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">API Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai" className="text-white">OpenAI Key</Label>
                <Input id="openai" value={openaiKey} onChange={e=>setKeys({openaiKey:e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cohere" className="text-white">Cohere Key</Label>
                <Input id="cohere" value={cohereKey} onChange={e=>setKeys({cohereKey:e.target.value})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gemini" className="text-white">Gemini Key</Label>
                <Input id="gemini" value={geminiKey} onChange={e=>setKeys({geminiKey:e.target.value})} className="bg-white/5 border-white/10" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
