import React from "react";
import { UserRole, AppLanguage, UserProfile } from "../types";
import { translations } from "../data/translations";
import { ZyroLogo } from "./ZyroLogo";
import { 
  Zap, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  User, 
  LogIn, 
  Crown, 
  Bike,
  Key,
  Globe,
  ChevronDown,
  LogOut
} from "lucide-react";

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  user: UserProfile;
  activeBookingCount: number;
  activeJobCount: number;
  isMobileFrame?: boolean;
  setIsMobileFrame?: (val: boolean) => void;
  onOpenWallet?: () => void;
  onOpenAdvisor: () => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onLogout?: () => void;
  currentCity: string;
  setCurrentCity: (city: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  setUserRole,
  language,
  setLanguage,
  user,
  onOpenWallet,
  onOpenAdvisor,
  onOpenLogin,
  onOpenProfile,
  onLogout,
  currentCity,
  setCurrentCity,
}) => {
  const t = translations[language];

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 sticky top-0 z-30 shadow-md safe-top">
      {/* 1. Top Offer Announcement Pill (Compact Mobile Bar) */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-[#00B074] px-3 py-1 text-[11px] text-white flex items-center justify-between font-semibold">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <span className="bg-black/20 text-white px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
            COMBO
          </span>
          <span className="truncate">
            🎉 ₹500 Zero-Deposit Waiver on Job + Gaadi
          </span>
        </div>

        <button
          id="header-ai-saathi-pill"
          onClick={onOpenAdvisor}
          className="flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] hover:bg-amber-300 active:scale-95 transition-all shadow-sm shrink-0"
        >
          <Sparkles className="w-3 h-3 fill-slate-950" />
          <span>AI Saathi</span>
        </button>
      </div>

      {/* 2. Main Mobile App Bar */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Brand & City Selector */}
        <div className="flex items-center gap-2 min-w-0">
          <ZyroLogo size="sm" variant="solid" />

          <div className="min-w-0">
            <div className="flex items-center gap-1 leading-none">
              <span className="text-base font-black tracking-tight text-white">
                Zy<span className="text-[#00B074]">ro</span>
              </span>
            </div>

            {/* City Dropdown Selector Pill */}
            <div className="flex items-center gap-0.5 text-slate-400 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#00B074] shrink-0" />
              <select
                id="city-selector-mobile"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-300 focus:outline-none cursor-pointer py-0 pr-1 truncate max-w-[85px]"
              >
                <option value="Delhi NCR" className="bg-slate-900 text-white">Delhi NCR</option>
                <option value="Mumbai MMR" className="bg-slate-900 text-white">Mumbai</option>
                <option value="Bengaluru" className="bg-slate-900 text-white">Bengaluru</option>
                <option value="Hyderabad" className="bg-slate-900 text-white">Hyderabad</option>
                <option value="Pune" className="bg-slate-900 text-white">Pune</option>
              </select>
            </div>
          </div>
        </div>

        {/* Center/Right: Role Switcher & Action Chips */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Role Status Badge or Switcher */}
          {user.registrationType === "driver_and_truck_owner" ? (
            <div className="bg-slate-800/90 p-0.5 rounded-xl border border-indigo-500/40 flex items-center">
              <button
                id="header-role-driver-btn"
                onClick={() => setUserRole("driver_and_truck_owner")}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  userRole === "driver_and_truck_owner" || userRole === "driver"
                    ? "bg-indigo-500 text-white shadow-sm font-black"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Dual Persona (Driver + Truck Owner)"
              >
                <Bike className="w-3 h-3" />
                <span>Dual Role</span>
              </button>
            </div>
          ) : user.registrationType === "driver" || userRole === "driver" ? (
            <div className="bg-emerald-950/80 border border-emerald-500/40 px-2 py-1 rounded-xl text-[10px] font-black text-emerald-300 flex items-center gap-1">
              <Bike className="w-3 h-3 text-emerald-400" />
              <span>Driver</span>
            </div>
          ) : user.registrationType === "truck_owner" || userRole === "truck_owner" || userRole === "owner_admin" ? (
            <div className="bg-amber-950/80 border border-amber-500/40 px-2 py-1 rounded-xl text-[10px] font-black text-amber-300 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Truck Owner</span>
            </div>
          ) : (
            <div className="bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 flex items-center">
              <button
                id="role-worker-btn"
                onClick={() => setUserRole("rent_and_drive")}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  userRole === "rent_and_drive" || userRole === "gig_worker"
                    ? "bg-[#00B074] text-slate-950 shadow-sm font-black"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Rent & Drive"
              >
                <Bike className="w-3 h-3" />
                <span>Rent & Drive</span>
              </button>
            </div>
          )}

          {/* Language Switch Pills */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl p-0.5 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setLanguage("hindi")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                language === "hindi" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
              }`}
              title="हिंदी में देखें"
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hinglish")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                language === "hinglish" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
              }`}
              title="Hinglish"
            >
              Hinglish
            </button>
            <button
              type="button"
              onClick={() => setLanguage("english")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                language === "english" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* User Profile / Login / Logout */}
          {user.isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                id="header-user-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 p-1 rounded-xl cursor-pointer active:scale-95 transition-all"
                title="Aapka Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-[#00B074] text-slate-950 flex items-center justify-center font-black text-[11px]">
                  {user.role === "owner_admin" ? (
                    <Crown className="w-3.5 h-3.5" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </button>

              {onLogout && (
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  className="flex items-center gap-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 px-2 py-1 rounded-xl text-[11px] font-black cursor-pointer active:scale-95 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="text-[10px]">Logout</span>
                </button>
              )}
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenLogin}
              className="flex items-center gap-1 bg-[#00B074] hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
            >
              <LogIn className="w-3 h-3" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
