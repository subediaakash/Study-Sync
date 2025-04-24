import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Settings, Info, Lock, Timer, Users } from "lucide-react";
import BasicInfo from "./BasicInfo";
import Privacy from "./Privacy";
import TimerSettings from "./TimerSettings";
import Participants from "./Participants";
import { cn } from "@/lib/utils";

export type TabType = "basic" | "privacy" | "timer" | "participants";

const RoomSettings = () => {
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  const tabs = [
    { id: "basic" as TabType, label: "Basic Info", icon: Info },
    { id: "privacy" as TabType, label: "Privacy", icon: Lock },
    { id: "timer" as TabType, label: "Timer", icon: Timer },
    { id: "participants" as TabType, label: "Participants", icon: Users },
  ];

  return (
    <div className="container mx-auto p-4 lg:p-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 p-2 bg-white shadow-lg border-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-secondary hover:text-primary"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        <Card className="flex-1 p-6 bg-white shadow-lg border-0">
          <div className="max-w-4xl mx-auto">
            {activeTab === "basic" && <BasicInfo />}
            {activeTab === "privacy" && <Privacy />}
            {activeTab === "timer" && <TimerSettings />}
            {activeTab === "participants" && <Participants />}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoomSettings;
