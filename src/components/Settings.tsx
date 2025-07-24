import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  Save,
  Users,
  Shield,
  Bell,
  Database,
  Palette,
  Clock,
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Site Settings
    siteName: "Residential Complex VRMS",
    address: "123 Main Street, City",
    timezone: "Asia/Kuala_Lumpur",

    // Visitor Management
    requireApproval: true,
    enableQRCode: true,
    maxVisitDuration: 24,
    workingHoursStart: "08:00",
    workingHoursEnd: "18:00",

    // Security
    sessionTimeout: 30,
    passwordExpiry: 90,
    enableTwoFactor: false,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Integration
    enableANPR: true,
    enableIntercom: false,
    enableCCTV: true,

    // Appearance
    theme: "light",
    primaryColor: "#3b82f6",
    language: "en",
  });

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure system settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} className="gradient-primary">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>
                Basic site information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => updateSetting("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kuala_Lumpur">
                        Asia/Kuala Lumpur
                      </SelectItem>
                      <SelectItem value="Asia/Singapore">
                        Asia/Singapore
                      </SelectItem>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok</SelectItem>
                      <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateSetting("address", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Visitor Management Settings
              </CardTitle>
              <CardDescription>
                Configure visitor registration and access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Visitors require approval before access is granted
                  </p>
                </div>
                <Switch
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) =>
                    updateSetting("requireApproval", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable QR Code</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate QR codes for visitor access
                  </p>
                </div>
                <Switch
                  checked={settings.enableQRCode}
                  onCheckedChange={(checked) =>
                    updateSetting("enableQRCode", checked)
                  }
                />
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">
                    Max Visit Duration (hours)
                  </Label>
                  <Input
                    id="maxDuration"
                    type="number"
                    value={settings.maxVisitDuration}
                    onChange={(e) =>
                      updateSetting(
                        "maxVisitDuration",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workStart">Working Hours Start</Label>
                  <Input
                    id="workStart"
                    type="time"
                    value={settings.workingHoursStart}
                    onChange={(e) =>
                      updateSetting("workingHoursStart", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workEnd">Working Hours End</Label>
                  <Input
                    id="workEnd"
                    type="time"
                    value={settings.workingHoursEnd}
                    onChange={(e) =>
                      updateSetting("workingHoursEnd", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      updateSetting("sessionTimeout", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) =>
                      updateSetting("passwordExpiry", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) =>
                    updateSetting("enableTwoFactor", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences and channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("emailNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("smsNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send push notifications to mobile apps
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("pushNotifications", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Integrations
              </CardTitle>
              <CardDescription>
                Configure third-party system integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">ANPR System</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatic Number Plate Recognition integration
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={settings.enableANPR ? "default" : "secondary"}
                  >
                    {settings.enableANPR ? "Connected" : "Disconnected"}
                  </Badge>
                  <Switch
                    checked={settings.enableANPR}
                    onCheckedChange={(checked) =>
                      updateSetting("enableANPR", checked)
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Intercom System</Label>
                  <p className="text-sm text-muted-foreground">
                    Video intercom integration for visitor communication
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={settings.enableIntercom ? "default" : "secondary"}
                  >
                    {settings.enableIntercom ? "Connected" : "Disconnected"}
                  </Badge>
                  <Switch
                    checked={settings.enableIntercom}
                    onCheckedChange={(checked) =>
                      updateSetting("enableIntercom", checked)
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">CCTV System</Label>
                  <p className="text-sm text-muted-foreground">
                    Security camera system integration
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={settings.enableCCTV ? "default" : "secondary"}
                  >
                    {settings.enableCCTV ? "Connected" : "Disconnected"}
                  </Badge>
                  <Switch
                    checked={settings.enableCCTV}
                    onCheckedChange={(checked) =>
                      updateSetting("enableCCTV", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSetting("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) =>
                      updateSetting("primaryColor", e.target.value)
                    }
                    className="w-20"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) =>
                      updateSetting("primaryColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
