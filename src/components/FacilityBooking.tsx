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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import type { Facility, BookingSlot } from "@/types";

const FacilityBooking = () => {
  const { state } = useVRMS();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedFacility, setSelectedFacility] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [duration, setDuration] = useState("1");

  const mockBookings: BookingSlot[] = [
    {
      id: "BK001",
      facilityId: "FAC001",
      residentId: "RES001",
      startTime: "2024-01-15T14:00:00Z",
      endTime: "2024-01-15T16:00:00Z",
      status: "approved",
      totalCost: 200,
      createdAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "BK002",
      facilityId: "FAC002",
      residentId: "RES002",
      startTime: "2024-01-16T18:00:00Z",
      endTime: "2024-01-16T21:00:00Z",
      status: "pending",
      totalCost: 150,
      createdAt: "2024-01-12T09:00:00Z",
    },
  ];

  const handleBooking = () => {
    if (!selectedFacility || !selectedDate || !bookingTime) {
      toast({
        title: "Error",
        description: "Please fill in all booking details",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Facility booking request submitted for approval",
    });
  };

  const getFacilityName = (facilityId: string) => {
    const facility = state.facilities.find((f) => f.id === facilityId);
    return facility ? facility.name : "Unknown";
  };

  const getResidentName = (residentId: string) => {
    const resident = state.residents.find((r) => r.id === residentId);
    return resident ? `${resident.name} (${resident.unit})` : "Unknown";
  };

  const getStatusVariant = (status: BookingSlot["status"]) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Facility Booking</h1>
        <p className="text-muted-foreground mt-2">
          Book shared facilities and manage reservations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Facilities</CardTitle>
              <CardDescription>
                Browse and book available facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {state.facilities.map((facility) => (
                  <Card key={facility.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{facility.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {facility.description}
                          </p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Up to {facility.capacity} people
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              RM{facility.hourlyRate}/hour
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={facility.isActive ? "default" : "secondary"}
                        >
                          {facility.isActive ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                View all facility bookings and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {getFacilityName(booking.facilityId)}
                      </TableCell>
                      <TableCell>
                        {getResidentName(booking.residentId)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>
                            {format(new Date(booking.startTime), "PPP")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(booking.startTime), "HH:mm")} -{" "}
                            {format(new Date(booking.endTime), "HH:mm")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Math.round(
                          (new Date(booking.endTime).getTime() -
                            new Date(booking.startTime).getTime()) /
                            (1000 * 60 * 60)
                        )}
                        h
                      </TableCell>
                      <TableCell>RM{booking.totalCost}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Facility</CardTitle>
              <CardDescription>Make a new facility reservation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facility">Select Facility</Label>
                <Select
                  value={selectedFacility}
                  onValueChange={setSelectedFacility}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.facilities
                      .filter((f) => f.isActive)
                      .map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name} - RM{facility.hourlyRate}/hr
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <Select value={bookingTime} onValueChange={setBookingTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((hours) => (
                      <SelectItem key={hours} value={hours.toString()}>
                        {hours} hour{hours > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFacility && duration && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Booking Summary</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total Cost: RM
                    {(state.facilities.find((f) => f.id === selectedFacility)
                      ?.hourlyRate || 0) * parseInt(duration)}
                  </div>
                </div>
              )}

              <Button
                onClick={handleBooking}
                className="w-full gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Booking
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Bookings</span>
                <span className="font-semibold">{mockBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Approval</span>
                <span className="font-semibold text-yellow-600">
                  {mockBookings.filter((b) => b.status === "pending").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">This Month Revenue</span>
                <span className="font-semibold text-green-600">
                  RM{mockBookings.reduce((acc, b) => acc + b.totalCost, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacilityBooking;
