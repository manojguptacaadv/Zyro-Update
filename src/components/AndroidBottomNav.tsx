import React from "react";
import { 
  Layers, 
  Sparkles, 
  Bike, 
  Briefcase, 
  Navigation, 
  Clock
} from "lucide-react";

export type NavTabType = "offerings" | "combo" | "vehicles" | "jobs" | "gps" | "advisor";

interface AndroidBottomNavProps {
  activeTab: NavTabType;
  onChangeTab: (tab: NavTabType) => void;
  activeBooking: boolean;
  vehicleCount: number;
  jobCount: number;
  language: string;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onChangeTab,
  activeBooking,
  vehicleCount,
  jobCount,
  language,
}) => {
  const tabs = [
    {
      id: "offerings" as NavTabType,
      label: language === "hindi" ? "सेवाएं" : language === "hinglish" ? "Services" : "Offerings",
      icon: Layers,
      badge: "NEW",
    },
    {
      id: "combo" as NavTabType,
      label: language === "hindi" ? "कॉम्बो पैक" : language === "hinglish" ? "Combo Pack" : "Combo",
      icon: Sparkles,
      badge: "HOT",
    },
    {
      id: "vehicles" as NavTabType,
      label: language === "hindi" ? "गाड़ी" : language === "hinglish" ? "Gaadi" : "Vehicles",
      icon: Bike,
      count: vehicleCount,
    },
    {
      id: "jobs" as NavTabType,
      label: language === "hindi" ? "नौकरी" : language === "hinglish" ? "Jobs" : "Jobs",
      icon: Briefcase,
      count: jobCount,
    },
    {
      id: "gps" as NavTabType,
      label: language === "hindi" ? "लाइव शिफ्ट" : language === "hinglish" ? "Live Shift" : "Live GPS",
      icon: Clock,
      hasPulse: activeBooking,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl safe-bottom max-w-lg mx-auto">
      {/* 5 Primary Navigation Actions */}
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`android-nav-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full relative transition-all active:scale-90 cursor-pointer ${
                isActive ? "text-[#00B074]" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {/* Active Indicator Background Pill */}
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${
                  isActive ? "bg-emerald-500/20 text-[#00B074]" : "bg-transparent"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                  {tab.hasPulse && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                  )}
                </div>
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? "font-black text-[#00B074]" : "font-semibold"}`}>
                {tab.label}
              </span>

              {/* Badge if any */}
              {tab.badge && (
                <span className="absolute top-1 right-2 bg-amber-400 text-slate-950 text-[8px] font-black px-1 rounded-full scale-90 shadow-sm">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Android System Gesture Navigation Pill Bar */}
      <div className="w-full pb-1 pt-0.5 flex items-center justify-center">
        <div className="w-32 h-1 bg-slate-600/70 rounded-full"></div>
      </div>
    </div>
  );
};
