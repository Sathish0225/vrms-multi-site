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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Clock, QrCode, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVRMS } from "@/contexts/VRMSContext";
import { formatDateTime } from "@/utils/qrcode";

const VisitorRegistration = () => {
  const { toast } = useToast();
  const { state, actions } = useVRMS();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRegistered, setLastRegistered] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    visitorName: "",
    contactNumber: "",
    email: "",
    visitingUnit: "",
    residentName: "",
    visitDate: "",
    visitTime: "",
    purposeOfVisit: "",
    vehicleNumber: "",
    numberOfVisitors: "1",
    identificationNumber: "",
    identificationType: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add visitor to state
      actions.addVisitor({
        visitorName: formData.visitorName,
        contactNumber: formData.contactNumber,
        email: formData.email || undefined,
        visitingUnit: formData.visitingUnit,
        residentName: formData.residentName,
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        purposeOfVisit: formData.purposeOfVisit,
        vehicleNumber: formData.vehicleNumber || undefined,
        numberOfVisitors: parseInt(formData.numberOfVisitors),
        identificationNumber: formData.identificationNumber,
        identificationType: formData.identificationType,
      });

      // Get the newly added visitor ID (it would be the most recent one)
      const newVisitorId = `VIS${Date.now().toString(36)}${Math.random()
        .toString(36)
        .substr(2, 5)}`.toUpperCase();
      setLastRegistered(newVisitorId);

      toast({
        title: "Visitor Registered Successfully",
        description: `${formData.visitorName} has been registered for Unit ${formData.visitingUnit}. QR code generated.`,
      });

      // Reset form
      setFormData({
        visitorName: "",
        contactNumber: "",
        email: "",
        visitingUnit: "",
        residentName: "",
        visitDate: "",
        visitTime: "",
        purposeOfVisit: "",
        vehicleNumber: "",
        numberOfVisitors: "1",
        identificationNumber: "",
        identificationType: "",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact system administrator.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Visitor Registration
              </h1>
              <p className="text-muted-foreground">
                Register new visitors for property access
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Visitor Information
                </CardTitle>
                <CardDescription>
                  Please fill in all required fields to register a new visitor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitorName">Visitor Name *</Label>
                      <Input
                        id="visitorName"
                        value={formData.visitorName}
                        onChange={(e) =>
                          handleInputChange("visitorName", e.target.value)
                        }
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number *</Label>
                      <Input
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={(e) =>
                          handleInputChange("contactNumber", e.target.value)
                        }
                        placeholder="+60123456789"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="visitor@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfVisitors">
                        Number of Visitors
                      </Label>
                      <Select
                        value={formData.numberOfVisitors}
                        onValueChange={(value) =>
                          handleInputChange("numberOfVisitors", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Identification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="identificationType">ID Type *</Label>
                      <Select
                        value={formData.identificationType}
                        onValueChange={(value) =>
                          handleInputChange("identificationType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nric">NRIC</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="driving-license">
                            Driving License
                          </SelectItem>
                          <SelectItem value="work-permit">
                            Work Permit
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="identificationNumber">ID Number *</Label>
                      <Input
                        id="identificationNumber"
                        value={formData.identificationNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "identificationNumber",
                            e.target.value
                          )
                        }
                        placeholder="Enter ID number"
                        required
                      />
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Visit Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="visitingUnit">Visiting Unit *</Label>
                        <Input
                          id="visitingUnit"
                          value={formData.visitingUnit}
                          onChange={(e) =>
                            handleInputChange("visitingUnit", e.target.value)
                          }
                          placeholder="e.g., B-12-03"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="residentName">Resident Name *</Label>
                        <Input
                          id="residentName"
                          value={formData.residentName}
                          onChange={(e) =>
                            handleInputChange("residentName", e.target.value)
                          }
                          placeholder="Name of resident to visit"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="visitDate">Visit Date *</Label>
                        <Input
                          id="visitDate"
                          type="date"
                          value={formData.visitDate}
                          onChange={(e) =>
                            handleInputChange("visitDate", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visitTime">Visit Time *</Label>
                        <Input
                          id="visitTime"
                          type="time"
                          value={formData.visitTime}
                          onChange={(e) =>
                            handleInputChange("visitTime", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="purposeOfVisit">
                          Purpose of Visit *
                        </Label>
                        <Textarea
                          id="purposeOfVisit"
                          value={formData.purposeOfVisit}
                          onChange={(e) =>
                            handleInputChange("purposeOfVisit", e.target.value)
                          }
                          placeholder="Brief description of visit purpose"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleNumber">
                          Vehicle Number (Optional)
                        </Label>
                        <Input
                          id="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={(e) =>
                            handleInputChange("vehicleNumber", e.target.value)
                          }
                          placeholder="e.g., KL1234A"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Registering..." : "Register Visitor"}
                    </Button>
                    <Button type="button" variant="outline">
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* QR Code Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  QR code will be generated after registration
                </p>
              </CardContent>
            </Card>

            {/* Recent Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {state.visitors
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .slice(0, 5)
                    .map((visitor) => (
                      <div
                        key={visitor.id}
                        className="flex items-center space-x-3 p-2 border rounded"
                      >
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {visitor.visitorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Unit {visitor.visitingUnit}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(visitor.createdAt)}
                        </span>
                      </div>
                    ))}
                  {state.visitors.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        No registrations yet
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorRegistration;
