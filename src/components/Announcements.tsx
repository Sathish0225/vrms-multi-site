import { useState } from "react";
import { useVRMS } from "@/contexts/VRMSContext";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  CalendarIcon,
  Users,
  AlertTriangle,
  Info,
  Calendar as CalendarIconLucide,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import type { Announcement } from "@/types";

const Announcements = () => {
  const { state, actions } = useVRMS();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [publishDate, setPublishDate] = useState<Date>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "general" as const,
    targetAudience: "all" as const,
    targetUnits: [] as string[],
    isActive: true,
    publishDate: "",
    expiryDate: "",
    createdBy: state.currentUser.id,
  });

  const mockAnnouncements: Announcement[] = [
    {
      id: "ANN001",
      title: "Swimming Pool Maintenance",
      content:
        "The swimming pool will be closed for maintenance from January 20-22, 2024. We apologize for any inconvenience caused.",
      type: "maintenance",
      targetAudience: "all",
      isActive: true,
      publishDate: "2024-01-15T09:00:00Z",
      expiryDate: "2024-01-23T23:59:59Z",
      createdBy: "Admin",
      createdAt: "2024-01-15T09:00:00Z",
    },
    {
      id: "ANN002",
      title: "Chinese New Year Celebration",
      content:
        "Join us for the Chinese New Year celebration on February 10th at the function hall. Free food and entertainment for all residents!",
      type: "event",
      targetAudience: "all",
      isActive: true,
      publishDate: "2024-01-10T08:00:00Z",
      expiryDate: "2024-02-11T23:59:59Z",
      createdBy: "Admin",
      createdAt: "2024-01-10T08:00:00Z",
    },
    {
      id: "ANN003",
      title: "Emergency Fire Drill",
      content:
        "Mandatory fire drill will be conducted on January 25th at 10:00 AM. Please participate for everyone's safety.",
      type: "emergency",
      targetAudience: "all",
      isActive: true,
      publishDate: "2024-01-12T14:00:00Z",
      expiryDate: "2024-01-26T23:59:59Z",
      createdBy: "Security Manager",
      createdAt: "2024-01-12T14:00:00Z",
    },
  ];

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" || announcement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content || !publishDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const announcementData = {
      ...newAnnouncement,
      publishDate: publishDate.toISOString(),
      expiryDate: expiryDate?.toISOString() || "",
    };

    actions.addAnnouncement(announcementData);
    setNewAnnouncement({
      title: "",
      content: "",
      type: "general",
      targetAudience: "all",
      targetUnits: [],
      isActive: true,
      publishDate: "",
      expiryDate: "",
      createdBy: state.currentUser.id,
    });
    setPublishDate(undefined);
    setExpiryDate(undefined);
    setIsCreateDialogOpen(false);
    toast({
      title: "Success",
      description: "Announcement created successfully",
    });
  };

  const getTypeIcon = (type: Announcement["type"]) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />;
      case "event":
        return <CalendarIconLucide className="h-4 w-4" />;
      case "maintenance":
        return <Zap className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTypeVariant = (type: Announcement["type"]) => {
    switch (type) {
      case "emergency":
        return "destructive";
      case "event":
        return "default";
      case "maintenance":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getAudienceIcon = (audience: Announcement["targetAudience"]) => {
    switch (audience) {
      case "all":
        return <Users className="h-4 w-4" />;
      case "residents":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage community announcements
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Create a new announcement for residents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newAnnouncement.type}
                  onValueChange={(value: any) =>
                    setNewAnnouncement({ ...newAnnouncement, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audience" className="text-right">
                  Target Audience
                </Label>
                <Select
                  value={newAnnouncement.targetAudience}
                  onValueChange={(value: any) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      targetAudience: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="residents">Residents Only</SelectItem>
                    <SelectItem value="specific-units">
                      Specific Units
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="col-span-3 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {publishDate ? format(publishDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={publishDate}
                      onSelect={setPublishDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Expiry Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="col-span-3 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right mt-2">
                  Content
                </Label>
                <Textarea
                  id="content"
                  rows={4}
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      content: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateAnnouncement}>
                Create Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockAnnouncements.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                mockAnnouncements.filter(
                  (a) => a.isActive && !isExpired(a.expiryDate)
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockAnnouncements.filter((a) => isExpired(a.expiryDate)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {
                mockAnnouncements.filter(
                  (a) =>
                    new Date(a.createdAt).getMonth() === new Date().getMonth()
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcement Management</CardTitle>
          <CardDescription>
            Create, edit, and manage community announcements
          </CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {announcement.title}
                        </h3>
                        <Badge
                          variant={getTypeVariant(announcement.type)}
                          className="flex items-center gap-1"
                        >
                          {getTypeIcon(announcement.type)}
                          {announcement.type}
                        </Badge>
                        {isExpired(announcement.expiryDate) && (
                          <Badge variant="outline" className="text-red-500">
                            Expired
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getAudienceIcon(announcement.targetAudience)}
                          {announcement.targetAudience === "all"
                            ? "All Users"
                            : announcement.targetAudience === "residents"
                            ? "Residents Only"
                            : "Specific Units"}
                        </div>
                        <div>
                          Published:{" "}
                          {format(new Date(announcement.publishDate), "PPP")}
                        </div>
                        {announcement.expiryDate && (
                          <div>
                            Expires:{" "}
                            {format(new Date(announcement.expiryDate), "PPP")}
                          </div>
                        )}
                        <div>By: {announcement.createdBy}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        {announcement.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;
