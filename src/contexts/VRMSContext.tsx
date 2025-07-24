import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  Visitor,
  Resident,
  Vehicle,
  Facility,
  Feedback,
  Announcement,
} from "@/types";
import {
  generateVisitorId,
  generateQRCode,
  getCurrentDateTime,
  isVisitOverdue,
} from "@/utils/qrcode";

interface VRMSState {
  visitors: Visitor[];
  residents: Resident[];
  vehicles: Vehicle[];
  facilities: Facility[];
  feedback: Feedback[];
  announcements: Announcement[];
  currentUser: any;
  isLoading: boolean;
}

type VRMSAction =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "ADD_VISITOR";
      payload: Omit<
        Visitor,
        "id" | "qrCode" | "status" | "createdAt" | "updatedAt"
      >;
    }
  | {
      type: "UPDATE_VISITOR";
      payload: { id: string; updates: Partial<Visitor> };
    }
  | { type: "CHECK_IN_VISITOR"; payload: { id: string; guardOnDuty: string } }
  | { type: "CHECK_OUT_VISITOR"; payload: { id: string } }
  | { type: "ADD_RESIDENT"; payload: Omit<Resident, "id" | "createdAt"> }
  | {
      type: "UPDATE_RESIDENT";
      payload: { id: string; updates: Partial<Resident> };
    }
  | { type: "ADD_VEHICLE"; payload: Omit<Vehicle, "id" | "createdAt"> }
  | {
      type: "UPDATE_VEHICLE";
      payload: { id: string; updates: Partial<Vehicle> };
    }
  | {
      type: "ADD_FEEDBACK";
      payload: Omit<Feedback, "id" | "createdAt" | "updatedAt">;
    }
  | {
      type: "UPDATE_FEEDBACK";
      payload: { id: string; updates: Partial<Feedback> };
    }
  | {
      type: "ADD_ANNOUNCEMENT";
      payload: Omit<Announcement, "id" | "createdAt">;
    }
  | {
      type: "UPDATE_ANNOUNCEMENT";
      payload: { id: string; updates: Partial<Announcement> };
    }
  | { type: "INIT_DATA"; payload: Partial<VRMSState> };

const initialState: VRMSState = {
  visitors: [],
  residents: [],
  vehicles: [],
  facilities: [],
  feedback: [],
  announcements: [],
  currentUser: {
    id: "admin1",
    name: "Admin Guard",
    role: "admin",
    email: "admin@property.com",
  },
  isLoading: false,
};

// Mock initial data
const mockData: Partial<VRMSState> = {
  residents: [
    {
      id: "RES001",
      name: "Ahmad Hassan",
      unit: "B-12-03",
      contactNumber: "+60123456789",
      email: "ahmad@email.com",
      isActive: true,
      vehicles: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "RES002",
      name: "Li Wei Ming",
      unit: "A-05-08",
      contactNumber: "+60198765432",
      email: "li@email.com",
      isActive: true,
      vehicles: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "RES003",
      name: "Siti Nurhaliza",
      unit: "C-08-12",
      contactNumber: "+60187654321",
      email: "siti@email.com",
      isActive: true,
      vehicles: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
  ],
  facilities: [
    {
      id: "FAC001",
      name: "Function Room A",
      description: "Large function room with projector and sound system",
      capacity: 50,
      hourlyRate: 100,
      isActive: true,
      bookingSlots: [],
    },
    {
      id: "FAC002",
      name: "BBQ Pit Area",
      description: "Outdoor BBQ area with grilling equipment",
      capacity: 20,
      hourlyRate: 50,
      isActive: true,
      bookingSlots: [],
    },
    {
      id: "FAC003",
      name: "Gymnasium",
      description: "Fully equipped gym with cardio and weight equipment",
      capacity: 15,
      hourlyRate: 30,
      isActive: true,
      bookingSlots: [],
    },
  ],
};

const vrmsReducer = (state: VRMSState, action: VRMSAction): VRMSState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "INIT_DATA":
      return { ...state, ...action.payload };

    case "ADD_VISITOR": {
      const id = generateVisitorId();
      const qrCode = generateQRCode(
        id,
        action.payload.visitDate,
        action.payload.visitingUnit
      );
      const currentTime = getCurrentDateTime();

      const newVisitor: Visitor = {
        ...action.payload,
        id,
        qrCode,
        status: "registered",
        createdAt: currentTime,
        updatedAt: currentTime,
        numberOfVisitors: Number(action.payload.numberOfVisitors),
      };

      return {
        ...state,
        visitors: [...state.visitors, newVisitor],
      };
    }

    case "UPDATE_VISITOR": {
      return {
        ...state,
        visitors: state.visitors.map((visitor) =>
          visitor.id === action.payload.id
            ? {
                ...visitor,
                ...action.payload.updates,
                updatedAt: getCurrentDateTime(),
              }
            : visitor
        ),
      };
    }

    case "CHECK_IN_VISITOR": {
      const currentTime = getCurrentDateTime();
      return {
        ...state,
        visitors: state.visitors.map((visitor) =>
          visitor.id === action.payload.id
            ? {
                ...visitor,
                status: "active" as const,
                checkInTime: currentTime,
                guardOnDuty: action.payload.guardOnDuty,
                updatedAt: currentTime,
              }
            : visitor
        ),
      };
    }

    case "CHECK_OUT_VISITOR": {
      const currentTime = getCurrentDateTime();
      return {
        ...state,
        visitors: state.visitors.map((visitor) =>
          visitor.id === action.payload.id
            ? {
                ...visitor,
                status: "completed" as const,
                checkOutTime: currentTime,
                updatedAt: currentTime,
              }
            : visitor
        ),
      };
    }

    case "ADD_RESIDENT": {
      const newResident: Resident = {
        ...action.payload,
        id: `RES${Date.now()}`,
        createdAt: getCurrentDateTime(),
      };
      return {
        ...state,
        residents: [...state.residents, newResident],
      };
    }

    case "UPDATE_RESIDENT": {
      return {
        ...state,
        residents: state.residents.map((resident) =>
          resident.id === action.payload.id
            ? { ...resident, ...action.payload.updates }
            : resident
        ),
      };
    }

    case "ADD_VEHICLE": {
      const newVehicle: Vehicle = {
        ...action.payload,
        id: `VEH${Date.now()}`,
        createdAt: getCurrentDateTime(),
      };
      return {
        ...state,
        vehicles: [...state.vehicles, newVehicle],
      };
    }

    case "UPDATE_VEHICLE": {
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id
            ? { ...vehicle, ...action.payload.updates }
            : vehicle
        ),
      };
    }

    case "ADD_FEEDBACK": {
      const newFeedback: Feedback = {
        ...action.payload,
        id: `FB${Date.now()}`,
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
      };
      return {
        ...state,
        feedback: [...state.feedback, newFeedback],
      };
    }

    case "UPDATE_FEEDBACK": {
      return {
        ...state,
        feedback: state.feedback.map((fb) =>
          fb.id === action.payload.id
            ? {
                ...fb,
                ...action.payload.updates,
                updatedAt: getCurrentDateTime(),
              }
            : fb
        ),
      };
    }

    case "ADD_ANNOUNCEMENT": {
      const newAnnouncement: Announcement = {
        ...action.payload,
        id: `ANN${Date.now()}`,
        createdAt: getCurrentDateTime(),
      };
      return {
        ...state,
        announcements: [...state.announcements, newAnnouncement],
      };
    }

    case "UPDATE_ANNOUNCEMENT": {
      return {
        ...state,
        announcements: state.announcements.map((ann) =>
          ann.id === action.payload.id
            ? { ...ann, ...action.payload.updates }
            : ann
        ),
      };
    }

    default:
      return state;
  }
};

const VRMSContext = createContext<{
  state: VRMSState;
  dispatch: React.Dispatch<VRMSAction>;
  actions: {
    addVisitor: (
      visitor: Omit<
        Visitor,
        "id" | "qrCode" | "status" | "createdAt" | "updatedAt"
      >
    ) => void;
    checkInVisitor: (id: string, guardOnDuty: string) => void;
    checkOutVisitor: (id: string) => void;
    addResident: (resident: Omit<Resident, "id" | "createdAt">) => void;
    addVehicle: (vehicle: Omit<Vehicle, "id" | "createdAt">) => void;
    addFeedback: (
      feedback: Omit<Feedback, "id" | "createdAt" | "updatedAt">
    ) => void;
    addAnnouncement: (
      announcement: Omit<Announcement, "id" | "createdAt">
    ) => void;
    updateVisitorStatus: () => void;
  };
} | null>(null);

export const VRMSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(vrmsReducer, initialState);

  // Initialize with mock data
  useEffect(() => {
    dispatch({ type: "INIT_DATA", payload: mockData });
  }, []);

  // Update visitor statuses based on time
  useEffect(() => {
    const interval = setInterval(() => {
      state.visitors.forEach((visitor) => {
        if (
          visitor.status === "active" &&
          visitor.visitDate &&
          visitor.visitTime
        ) {
          if (isVisitOverdue(visitor.visitDate, visitor.visitTime)) {
            dispatch({
              type: "UPDATE_VISITOR",
              payload: { id: visitor.id, updates: { status: "overdue" } },
            });
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.visitors]);

  const actions = {
    addVisitor: (
      visitor: Omit<
        Visitor,
        "id" | "qrCode" | "status" | "createdAt" | "updatedAt"
      >
    ) => {
      dispatch({ type: "ADD_VISITOR", payload: visitor });
    },
    checkInVisitor: (id: string, guardOnDuty: string) => {
      dispatch({ type: "CHECK_IN_VISITOR", payload: { id, guardOnDuty } });
    },
    checkOutVisitor: (id: string) => {
      dispatch({ type: "CHECK_OUT_VISITOR", payload: { id } });
    },
    addResident: (resident: Omit<Resident, "id" | "createdAt">) => {
      dispatch({ type: "ADD_RESIDENT", payload: resident });
    },
    addVehicle: (vehicle: Omit<Vehicle, "id" | "createdAt">) => {
      dispatch({ type: "ADD_VEHICLE", payload: vehicle });
    },
    addFeedback: (
      feedback: Omit<Feedback, "id" | "createdAt" | "updatedAt">
    ) => {
      dispatch({ type: "ADD_FEEDBACK", payload: feedback });
    },
    addAnnouncement: (announcement: Omit<Announcement, "id" | "createdAt">) => {
      dispatch({ type: "ADD_ANNOUNCEMENT", payload: announcement });
    },
    updateVisitorStatus: () => {
      // Force update of visitor statuses
      state.visitors.forEach((visitor) => {
        if (
          visitor.status === "active" &&
          visitor.visitDate &&
          visitor.visitTime
        ) {
          if (isVisitOverdue(visitor.visitDate, visitor.visitTime)) {
            dispatch({
              type: "UPDATE_VISITOR",
              payload: { id: visitor.id, updates: { status: "overdue" } },
            });
          }
        }
      });
    },
  };

  return (
    <VRMSContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </VRMSContext.Provider>
  );
};

export const useVRMS = () => {
  const context = useContext(VRMSContext);
  if (!context) {
    throw new Error("useVRMS must be used within a VRMSProvider");
  }
  return context;
};
