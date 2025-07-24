export interface Visitor {
  id: string;
  visitorName: string;
  contactNumber: string;
  email?: string;
  visitingUnit: string;
  residentName: string;
  visitDate: string;
  visitTime: string;
  purposeOfVisit: string;
  vehicleNumber?: string;
  numberOfVisitors: number;
  identificationNumber: string;
  identificationType: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "registered" | "active" | "completed" | "overdue";
  qrCode: string;
  guardOnDuty?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resident {
  id: string;
  name: string;
  unit: string;
  contactNumber: string;
  email: string;
  isActive: boolean;
  vehicles: Vehicle[];
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  color: string;
  status: "whitelist" | "blacklist" | "pending";
  residentId: string;
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  hourlyRate: number;
  isActive: boolean;
  bookingSlots: BookingSlot[];
}

export interface BookingSlot {
  id: string;
  facilityId: string;
  residentId: string;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected" | "completed";
  totalCost: number;
  createdAt: string;
}

export interface Feedback {
  id: string;
  residentId: string;
  category: "complaint" | "suggestion" | "maintenance" | "security" | "other";
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  attachments?: string[];
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "maintenance" | "emergency" | "event";
  targetAudience: "all" | "residents" | "specific-units";
  targetUnits?: string[];
  isActive: boolean;
  publishDate: string;
  expiryDate?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "guard" | "resident";
  siteAccess: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  settings: SiteSettings;
  createdAt: string;
}

export interface SiteSettings {
  visitorRegistrationFields: CustomField[];
  maxVisitDuration: number; // in hours
  requireApproval: boolean;
  enableQRCode: boolean;
  enableVehicleTracking: boolean;
  workingHours: {
    start: string;
    end: string;
  };
}

export interface CustomField {
  id: string;
  name: string;
  type:
    | "text"
    | "number"
    | "email"
    | "phone"
    | "select"
    | "textarea"
    | "date"
    | "time";
  label: string;
  required: boolean;
  options?: string[]; // for select type
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}
