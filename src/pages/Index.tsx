import { useState } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import VisitorRegistration from "@/components/VisitorRegistration";
import VisitorLogs from "@/components/VisitorLogs";
import ResidentManagement from "@/components/ResidentManagement";
import VehicleManagement from "@/components/VehicleManagement";
import FacilityBooking from "@/components/FacilityBooking";
import FeedbackSystem from "@/components/FeedbackSystem";
import EForms from "@/components/EForms";
import Announcements from "@/components/Announcements";
import Settings from "@/components/Settings";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "visitor-registration":
        return <VisitorRegistration />;
      case "visitor-logs":
        return <VisitorLogs />;
      case "residents":
        return <ResidentManagement />;
      case "vehicles":
        return <VehicleManagement />;
      case "facilities":
        return <FacilityBooking />;
      case "feedback":
        return <FeedbackSystem />;
      case "eforms":
        return <EForms />;
      case "announcements":
        return <Announcements />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 lg:ml-0">{renderCurrentPage()}</div>
    </div>
  );
};

export default Index;
