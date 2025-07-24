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
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
} from "lucide-react";

interface EForm {
  id: string;
  title: string;
  type:
    | "renovation"
    | "move-in"
    | "move-out"
    | "access-card"
    | "maintenance"
    | "other";
  submittedBy: string;
  residentUnit: string;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
  submissionDate: string;
  approvalDate?: string;
  attachments: string[];
  formData: Record<string, any>;
}

const EForms = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    type: "renovation" as const,
    submittedBy: "",
    residentUnit: "",
    description: "",
  });

  const mockForms: EForm[] = [
    {
      id: "EF001",
      title: "Bathroom Renovation Request",
      type: "renovation",
      submittedBy: "Ahmad Hassan",
      residentUnit: "B-12-03",
      status: "approved",
      submissionDate: "2024-01-10T10:00:00Z",
      approvalDate: "2024-01-12T15:30:00Z",
      attachments: ["renovation_plan.pdf", "contractor_license.pdf"],
      formData: {
        renovationType: "Bathroom",
        startDate: "2024-01-20",
        estimatedDuration: "2 weeks",
        contractor: "ABC Renovation Sdn Bhd",
      },
    },
    {
      id: "EF002",
      title: "New Resident Move-in Form",
      type: "move-in",
      submittedBy: "Li Wei Ming",
      residentUnit: "A-05-08",
      status: "under-review",
      submissionDate: "2024-01-14T09:20:00Z",
      attachments: ["tenancy_agreement.pdf"],
      formData: {
        moveInDate: "2024-01-25",
        familyMembers: 3,
        vehicles: 1,
        emergencyContact: "+60123456789",
      },
    },
    {
      id: "EF003",
      title: "Additional Access Card Request",
      type: "access-card",
      submittedBy: "Siti Nurhaliza",
      residentUnit: "C-08-12",
      status: "submitted",
      submissionDate: "2024-01-15T14:45:00Z",
      attachments: [],
      formData: {
        numberOfCards: 2,
        reason: "For family members",
        urgency: "Normal",
      },
    },
  ];

  const filteredForms = mockForms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.residentUnit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || form.status === statusFilter;
    const matchesType = typeFilter === "all" || form.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateForm = () => {
    if (!newForm.title || !newForm.submittedBy || !newForm.residentUnit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "eForm created successfully",
    });
    setIsCreateDialogOpen(false);
    setNewForm({
      title: "",
      type: "renovation",
      submittedBy: "",
      residentUnit: "",
      description: "",
    });
  };

  const getStatusVariant = (status: EForm["status"]) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "under-review":
        return "outline";
      case "submitted":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeVariant = (type: EForm["type"]) => {
    switch (type) {
      case "renovation":
        return "default";
      case "move-in":
        return "secondary";
      case "move-out":
        return "outline";
      case "access-card":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">eForms</h1>
          <p className="text-muted-foreground mt-2">
            Digital forms for resident processes and requests
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New eForm</DialogTitle>
              <DialogDescription>
                Create a new digital form for resident processes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Form Title
                </Label>
                <Input
                  id="title"
                  value={newForm.title}
                  onChange={(e) =>
                    setNewForm({ ...newForm, title: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g., Renovation Request"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Form Type
                </Label>
                <Select
                  value={newForm.type}
                  onValueChange={(value: any) =>
                    setNewForm({ ...newForm, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="move-in">Move In</SelectItem>
                    <SelectItem value="move-out">Move Out</SelectItem>
                    <SelectItem value="access-card">Access Card</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="submittedBy" className="text-right">
                  Submitted By
                </Label>
                <Input
                  id="submittedBy"
                  value={newForm.submittedBy}
                  onChange={(e) =>
                    setNewForm({ ...newForm, submittedBy: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <Input
                  id="unit"
                  value={newForm.residentUnit}
                  onChange={(e) =>
                    setNewForm({ ...newForm, residentUnit: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g., A-12-03"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={newForm.description}
                  onChange={(e) =>
                    setNewForm({ ...newForm, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Describe the request or process..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateForm}>Create Form</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockForms.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {
                mockForms.filter(
                  (f) => f.status === "under-review" || f.status === "submitted"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockForms.filter((f) => f.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockForms.filter((f) => f.status === "rejected").length}
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
                mockForms.filter(
                  (f) =>
                    new Date(f.submissionDate).getMonth() ===
                    new Date().getMonth()
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Management</CardTitle>
          <CardDescription>
            Manage and process digital forms from residents
          </CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="renovation">Renovation</SelectItem>
                <SelectItem value="move-in">Move In</SelectItem>
                <SelectItem value="move-out">Move Out</SelectItem>
                <SelectItem value="access-card">Access Card</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getTypeVariant(form.type)}
                      className="capitalize"
                    >
                      {form.type.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{form.submittedBy}</TableCell>
                  <TableCell>{form.residentUnit}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(form.status)}
                      className="capitalize"
                    >
                      {form.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(form.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {form.attachments.length}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {form.attachments.length > 0 && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
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

export default EForms;
