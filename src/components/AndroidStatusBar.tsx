import React, { useState, useEffect } from "react";
import { Wifi, BatteryMedium, Sparkles } from "lucide-react";

interface AndroidStatusBarProps {
  theme?: "dark" | "emerald" | "light";
  batteryLevel?: number;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  theme = "emerald",
  batteryLevel = 94,
}) => {
  const [time, setTime] = useState<string>("09:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const bgClasses = 
    theme === "emerald" 
      ? "bg-[#00B074] text-white" 
      : theme === "light" 
      ? "bg-slate-100 text-slate-800" 
      : "bg-slate-950 text-white";

  return (
    <div className={`w-full px-5 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold select-none z-50 relative ${bgClasses}`}>
      {/* Left: Clock Time */}
      <div className="flex items-center gap-1.5">
        <span className="font-bold tracking-tight text-[13px]">{time}</span>
        <span className="text-[10px] opacity-80 font-normal">Zyro</span>
      </div>

      {/* Center: Subtle Android Punch Hole / Speaker Notch */}
      <div className="flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-black/60 border border-white/20 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900/80"></div>
        </div>
      </div>

      {/* Right: Status Icons (5G, VoLTE, WiFi, Battery) */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black tracking-wider uppercase opacity-90">5G</span>
        <Wifi className="w-3.5 h-3.5 opacity-90 stroke-[2.5]" />
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono font-bold">{batteryLevel}%</span>
          <BatteryMedium className="w-4 h-4 opacity-95 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
