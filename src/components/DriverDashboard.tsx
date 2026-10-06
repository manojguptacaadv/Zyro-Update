import React, { useState } from "react";
import { 
  UserProfile, 
  Job, 
  Vehicle, 
  AppLanguage, 
  JobApplication, 
  RentalBooking 
} from "../types";
import { 
  Bike, 
  Briefcase, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Calendar, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  Search, 
  Car, 
  TrendingUp, 
  ChevronRight, 
  Zap, 
  UserCheck, 
  Wallet,
  FileCheck,
  Check,
  Building2,
  Navigation
} from "lucide-react";
import { translations } from "../data/translations";

interface DriverDashboardProps {
  user: UserProfile;
  jobs: Job[];
  vehicles: Vehicle[];
  language: AppLanguage;
  onApplyJob: (job: Job) => void;
  onSelectComboForJob?: (job: Job) => void;
  activeJobApplication?: JobApplication | null;
  activeBooking?: RentalBooking | null;
  onOpenWallet?: () => void;
  onOpenProfile?: () => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  user,
  jobs,
  vehicles,
  language,
  onApplyJob,
  onSelectComboForJob,
  activeJobApplication,
  activeBooking,
  onOpenWallet,
  onOpenProfile,
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("all");

  const driverDetails = user.driverDetails || {
    experienceYears: "3",
    licenceNumber: user.licenseNumber || "DL-042021008942",
    licenceExpiryDate: "2031-12-31",
    licenceType: "LMV-TR (Commercial Transport)",
    preferredLocation: user.city || "Delhi NCR",
    workHistory: "Experienced commercial & e-commerce delivery driver",
  };

  // STRICT REQUIREMENT: Driver must ONLY see jobs where requiredRole is "driver" or category is appropriate for drivers (grocery, food, courier, ecommerce, ride_hailing)
  // NEVER show truck_owner contracts
  const driverJobs = jobs.filter((job) => {
    // If job has requiredRole, must be "driver" or "all" or "rent_and_drive"
    if (job.requiredRole && job.requiredRole === "truck_owner") {
      return false;
    }
    if (job.category === "truck_freight" || job.category === "load_contract") {
      return false;
    }
    
    // Category filter
    if (selectedCategory !== "all" && job.category !== selectedCategory) {
      return false;
    }

    // City filter
    if (selectedCityFilter !== "all" && !job.city.toLowerCase().includes(selectedCityFilter.toLowerCase())) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.area.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-12">
      {/* 1. DRIVER PROFILE & LICENCE BADGE BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">{user.name}</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t.verifiedDriver}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{driverDetails.preferredLocation || user.city}</span>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block">{t.experienceYears}</span>
            <span className="text-xs font-black text-amber-300">
              {driverDetails.experienceYears} Years
            </span>
          </div>
        </div>

        {/* Driver Licence & Credentials Info Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">{t.licenceNumber}:</span>
            <span className="font-mono font-bold text-white tracking-wide">
              {driverDetails.licenceNumber}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">{t.licenceType}:</span>
            <span className="font-bold text-emerald-300 truncate block">
              {driverDetails.licenceType}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-medium">Valid:</span>
            <span className="font-mono font-bold text-slate-200">
              {driverDetails.licenceExpiryDate}
            </span>
          </div>
        </div>

        {driverDetails.workHistory && (
          <div className="mt-2 text-[11px] text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate"><strong>History:</strong> {driverDetails.workHistory}</span>
          </div>
        )}
      </div>

      {/* 2. ACTIVE DRIVER SHIFT (IF ANY) */}
      {activeJobApplication && (
        <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-4 shadow-lg text-white space-y-2.5 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                {t.activeShift}
              </span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live On-Duty
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">{activeJobApplication.jobTitle}</h3>
              <p className="text-xs text-slate-300 font-semibold">{activeJobApplication.company}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Today's Earnings</span>
              <span className="text-sm font-black text-emerald-400">
                ₹{activeJobApplication.earningsToday}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-800/50 text-slate-300">
            <span>Deliveries Done: <strong>{activeJobApplication.deliveriesCompleted}</strong></span>
            {activeBooking && (
              <span className="text-emerald-300 font-mono text-[11px]">
                🚗 Vehicle: {activeBooking.vehiclePlate}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. QUICK STATS BAR */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-sm">
          <span className="text-[10px] text-slate-400 block font-medium">Total Earned</span>
          <span className="text-xs font-black text-emerald-400">₹{user.totalEarned || 0}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-sm">
          <span className="text-[10px] text-slate-400 block font-medium">Available Shifts</span>
          <span className="text-xs font-black text-white">{driverJobs.length} Openings</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-sm">
          <span className="text-[10px] text-slate-400 block font-medium">Verification</span>
          <span className="text-xs font-black text-emerald-300 flex items-center justify-center gap-0.5">
            <ShieldCheck className="w-3 h-3" />
            <span>Active</span>
          </span>
        </div>
      </div>

      {/* 4. DRIVER JOBS MARKETPLACE HEADER & FILTERS */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Driver Work & Job Openings</h2>
              <p className="text-[10px] text-slate-400">
                Verified high-paying delivery shifts in {user.city}
              </p>
            </div>
          </div>
          <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
            {driverJobs.length} Jobs
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search driver jobs, companies, or areas..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            All Driver Jobs ({jobs.filter(j => j.requiredRole !== "truck_owner" && j.category !== "truck_freight").length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("grocery_delivery")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "grocery_delivery"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            Grocery / Blinkit / Zepto
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("food_delivery")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "food_delivery"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            Food Delivery / Zomato
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("ecommerce")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "ecommerce"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            E-Commerce Vans & 3W
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("ride_hailing")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "ride_hailing"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            Passenger E-Rickshaw Pilot
          </button>
        </div>
      </div>

      {/* 5. DRIVER JOB CARDS LIST */}
      <div className="space-y-3">
        {driverJobs.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
            <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-300">No driver jobs found matching criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-emerald-400 text-xs font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          driverJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-md transition-all relative overflow-hidden"
            >
              {/* Job Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 inline-block mb-1">
                      {job.category.replace("_", " ")}
                    </span>
                    <h3 className="text-xs font-black text-white leading-snug">{job.title}</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">{job.company}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-400 block">
                    {job.payoutLabel}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {job.vacancies} vacancies
                  </span>
                </div>
              </div>

              {/* Shift info chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.area}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.shiftTiming}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                {job.description}
              </p>

              {/* Perks */}
              {job.perks && job.perks.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {job.perks.slice(0, 2).map((perk, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{perk}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                {onSelectComboForJob && (
                  <button
                    type="button"
                    onClick={() => onSelectComboForJob(job)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Rent Vehicle + Apply</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-all cursor-pointer active:scale-95"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Start Driver Shift</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
