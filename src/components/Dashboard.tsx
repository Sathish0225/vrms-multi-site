import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Clock, Shield, Car, Calendar } from "lucide-react";
import { useVRMS } from "@/contexts/VRMSContext";
import { formatDateTime } from "@/utils/qrcode";

const Dashboard = () => {
  const { state } = useVRMS();

  // Calculate real-time statistics
  const activeVisitors = state.visitors.filter(
    (v) => v.status === "active"
  ).length;
  const todayVisits = state.visitors.filter((v) => {
    const today = new Date().toISOString().split("T")[0];
    return v.visitDate === today;
  }).length;
  const pendingApprovals = state.visitors.filter(
    (v) => v.status === "registered"
  ).length;
  const overdueVisitors = state.visitors.filter(
    (v) => v.status === "overdue"
  ).length;

  const stats = [
    {
      title: "Active Visitors",
      value: activeVisitors.toString(),
      description: "Currently checked in",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Today's Check-ins",
      value: todayVisits.toString(),
      description: "Visitors processed today",
      icon: UserCheck,
      color: "text-success",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      description: "Awaiting authorization",
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Security Alerts",
      value: overdueVisitors.toString(),
      description:
        overdueVisitors > 0 ? "Overdue visitors" : "No active alerts",
      icon: Shield,
      color: overdueVisitors > 0 ? "text-destructive" : "text-muted-foreground",
    },
  ];

  const quickActions = [
    {
      title: "Register Visitor",
      description: "Add new visitor entry",
      icon: Users,
      action: "register",
    },
    {
      title: "Vehicle Management",
      description: "Manage vehicle access",
      icon: Car,
      action: "vehicles",
    },
    {
      title: "Facility Booking",
      description: "Reserve facilities",
      icon: Calendar,
      action: "facilities",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                VRMS Dashboard
              </h1>
              <p className="text-muted-foreground">
                Visitor & Resident Management System
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">View Reports</Button>
              <Button>Emergency Mode</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common management tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.action}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <action.icon className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest visitor check-ins and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.visitors
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                  )
                  .slice(0, 5)
                  .map((visitor) => (
                    <div
                      key={visitor.id}
                      className="flex items-center space-x-4 p-3 border rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          visitor.status === "active"
                            ? "bg-success"
                            : visitor.status === "completed"
                            ? "bg-muted-foreground"
                            : visitor.status === "overdue"
                            ? "bg-destructive"
                            : "bg-warning"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {visitor.visitorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Unit {visitor.visitingUnit} •{" "}
                          {visitor.checkInTime
                            ? `Checked in ${formatDateTime(
                                visitor.checkInTime
                              )}`
                            : visitor.checkOutTime
                            ? `Checked out ${formatDateTime(
                                visitor.checkOutTime
                              )}`
                            : `Registered ${formatDateTime(visitor.createdAt)}`}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          visitor.status === "active"
                            ? "bg-success/10 text-success"
                            : visitor.status === "completed"
                            ? "bg-muted text-muted-foreground"
                            : visitor.status === "overdue"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {visitor.status}
                      </span>
                    </div>
                  ))}
                {state.visitors.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No recent visitor activity
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
