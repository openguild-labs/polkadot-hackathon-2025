'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Lock, Moon, Sun, User, Wallet } from 'lucide-react'

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container mx-auto px-4 py-8 bg-background dark:bg-gray-900 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
        
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="profile" className="dark:text-gray-200 dark:data-[state=active]:bg-gray-700"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="security" className="dark:text-gray-200 dark:data-[state=active]:bg-gray-700"><Lock className="mr-2 h-4 w-4" />Security</TabsTrigger>
          <TabsTrigger value="notifications" className="dark:text-gray-200 dark:data-[state=active]:bg-gray-700"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="wallets" className="dark:text-gray-200 dark:data-[state=active]:bg-gray-700"><Wallet className="mr-2 h-4 w-4" />Wallets</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Profile Information</CardTitle>
              <CardDescription className="dark:text-gray-400">Update your account details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="dark:text-gray-200">Username</Label>
                <Input id="username" placeholder="Your username" className="dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                <Input id="email" type="email" placeholder="Your email" className="dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="dark:text-gray-200">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself" className="dark:bg-gray-700 dark:text-white" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Security Settings</CardTitle>
              <CardDescription className="dark:text-gray-400">Manage your account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="dark:text-gray-200">Current Password</Label>
                <Input id="current-password" type="password" className="dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="dark:text-gray-200">New Password</Label>
                <Input id="new-password" type="password" className="dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="dark:text-gray-200">Confirm New Password</Label>
                <Input id="confirm-password" type="password" className="dark:bg-gray-700 dark:text-white" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
              <CardDescription className="dark:text-gray-400">Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="dark:text-gray-200">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications" className="dark:text-gray-200">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Receive push notifications on your devices</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Connected Wallets</CardTitle>
              <CardDescription className="dark:text-gray-400">Manage your connected blockchain wallets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium dark:text-white">Ethereum Wallet</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">0x1234...5678</p>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium dark:text-white">Polygon Wallet</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">0x8765...4321</p>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Connect New Wallet</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}