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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
} from "lucide-react";
import type { Feedback } from "@/types";

const FeedbackSystem = () => {
  const { state, actions } = useVRMS();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    residentId: "",
    category: "complaint" as const,
    subject: "",
    description: "",
    status: "open" as const,
    priority: "medium" as const,
  });

  const mockFeedback: Feedback[] = [
    {
      id: "FB001",
      residentId: "RES001",
      category: "maintenance",
      subject: "Elevator Not Working",
      description:
        "The elevator in Tower A has been out of service for 3 days. Please fix urgently.",
      status: "in-progress",
      priority: "high",
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-11T15:30:00Z",
      adminReply:
        "Maintenance team has been notified. Expected fix by tomorrow.",
    },
    {
      id: "FB002",
      residentId: "RES002",
      category: "suggestion",
      subject: "More Parking Spaces",
      description:
        "Suggest converting the unused area near the gym into additional parking spaces.",
      status: "open",
      priority: "low",
      createdAt: "2024-01-12T14:20:00Z",
      updatedAt: "2024-01-12T14:20:00Z",
    },
    {
      id: "FB003",
      residentId: "RES003",
      category: "security",
      subject: "Broken Security Camera",
      description:
        "The security camera at the main entrance is not working properly.",
      status: "resolved",
      priority: "medium",
      createdAt: "2024-01-08T09:15:00Z",
      updatedAt: "2024-01-09T16:45:00Z",
      adminReply: "Camera has been repaired and is now functioning normally.",
    },
  ];

  const filteredFeedback = mockFeedback.filter((feedback) => {
    const matchesSearch =
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || feedback.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || feedback.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddFeedback = () => {
    if (
      !newFeedback.residentId ||
      !newFeedback.subject ||
      !newFeedback.description
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    actions.addFeedback(newFeedback);
    setNewFeedback({
      residentId: "",
      category: "complaint",
      subject: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Feedback submitted successfully",
    });
  };

  const getResidentName = (residentId: string) => {
    const resident = state.residents.find((r) => r.id === residentId);
    return resident ? `${resident.name} (${resident.unit})` : "Unknown";
  };

  const getStatusIcon = (status: Feedback["status"]) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: Feedback["status"]) => {
    switch (status) {
      case "resolved":
        return "default";
      case "closed":
        return "secondary";
      case "in-progress":
        return "outline";
      default:
        return "destructive";
    }
  };

  const getPriorityVariant = (priority: Feedback["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Feedback System
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage resident feedback, complaints, and suggestions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit New Feedback</DialogTitle>
              <DialogDescription>
                Submit feedback, complaints, or suggestions on behalf of
                residents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resident" className="text-right">
                  Resident
                </Label>
                <Select
                  value={newFeedback.residentId}
                  onValueChange={(value) =>
                    setNewFeedback({ ...newFeedback, residentId: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select resident" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.residents.map((resident) => (
                      <SelectItem key={resident.id} value={resident.id}>
                        {resident.name} ({resident.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newFeedback.category}
                  onValueChange={(value: any) =>
                    setNewFeedback({ ...newFeedback, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={newFeedback.priority}
                  onValueChange={(value: any) =>
                    setNewFeedback({ ...newFeedback, priority: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newFeedback.subject}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, subject: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={newFeedback.description}
                  onChange={(e) =>
                    setNewFeedback({
                      ...newFeedback,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddFeedback}>Submit Feedback</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockFeedback.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockFeedback.filter((f) => f.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockFeedback.filter((f) => f.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockFeedback.filter((f) => f.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>
            Track and respond to resident feedback and complaints
          </CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">
                    {feedback.subject}
                  </TableCell>
                  <TableCell>{getResidentName(feedback.residentId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {feedback.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getPriorityVariant(feedback.priority)}
                      className="capitalize"
                    >
                      {feedback.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(feedback.status)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getStatusIcon(feedback.status)}
                      {feedback.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSystem;
