import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useVRMS } from "@/contexts/VRMSContext";
import { formatDateTime } from "@/utils/qrcode";
import { useToast } from "@/hooks/use-toast";

const VisitorLogs = () => {
  const { state, actions } = useVRMS();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      case "registered":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Registered
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredLogs = state.visitors.filter((visitor) => {
    const matchesSearch =
      visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.visitingUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.residentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCheckIn = (visitorId: string) => {
    actions.checkInVisitor(visitorId, state.currentUser.name);
    toast({
      title: "Visitor Checked In",
      description: "Visitor has been successfully checked in.",
    });
  };

  const handleCheckOut = (visitorId: string) => {
    actions.checkOutVisitor(visitorId);
    toast({
      title: "Visitor Checked Out",
      description: "Visitor has been successfully checked out.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Visitor Logs
              </h1>
              <p className="text-muted-foreground">
                Track and manage visitor check-ins and check-outs
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Visitors
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      state.visitors.filter(
                        (visitor) => visitor.status === "active"
                      ).length
                    }
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Today's Visits
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      state.visitors.filter((visitor) => {
                        const today = new Date().toISOString().split("T")[0];
                        return visitor.visitDate === today;
                      }).length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Overdue Checkouts
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      state.visitors.filter(
                        (visitor) => visitor.status === "overdue"
                      ).length
                    }
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Logs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {state.visitors.length}
                  </p>
                </div>
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
            <CardDescription>Find specific visitor records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by visitor name, unit, or resident..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Visitor Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Records</CardTitle>
            <CardDescription>
              Complete log of all visitor activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor ID</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.visitorName}</TableCell>
                      <TableCell>{log.contactNumber}</TableCell>
                      <TableCell>{log.visitingUnit}</TableCell>
                      <TableCell>{log.residentName}</TableCell>
                      <TableCell>
                        {log.checkInTime ? (
                          <div className="text-sm">
                            <div>{formatDateTime(log.checkInTime)}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.checkOutTime ? (
                          <div className="text-sm">
                            <div>{formatDateTime(log.checkOutTime)}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{log.purposeOfVisit}</TableCell>
                      <TableCell>{log.vehicleNumber || "-"}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        {log.status === "registered" && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(log.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Check In
                          </Button>
                        )}
                        {log.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(log.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorLogs;
