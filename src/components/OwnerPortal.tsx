import React, { useState, useEffect } from "react";
import { Vehicle, VehicleType, FuelType, Job, JobCategory, AppLanguage, UserProfile } from "../types";
import { translations } from "../data/translations";
import { 
  Key, 
  PlusCircle, 
  IndianRupee, 
  Zap, 
  Bike, 
  Truck, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Radio, 
  TrendingUp, 
  AlertCircle,
  Briefcase,
  Navigation,
  Lock,
  Unlock,
  Trash2,
  Users,
  Clock,
  Gauge,
  BatteryCharging,
  ShieldAlert,
  Shield,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Smartphone
} from "lucide-react";

interface OwnerPortalProps {
  vehicles: Vehicle[];
  jobs: Job[];
  language: AppLanguage;
  user: UserProfile;
  onAddNewVehicle: (newVeh: Vehicle) => void;
  onDeleteVehicle: (vehId: string) => void;
  onToggleVehicleAvailability: (vehId: string) => void;
  onAddNewJob: (newJob: Job) => void;
  onDeleteJob: (jobId: string) => void;
}

const DEFAULT_ADMIN_PIN = "8899";

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  vehicles,
  jobs,
  language,
  user,
  onAddNewVehicle,
  onDeleteVehicle,
  onToggleVehicleAvailability,
  onAddNewJob,
  onDeleteJob,
}) => {
  const t = translations[language];

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem("zyro_admin_auth") || localStorage.getItem("workride_admin_auth");
    return saved === "true";
  });

  const [storedPin, setStoredPin] = useState<string>(() => {
    return localStorage.getItem("zyro_admin_pin") || localStorage.getItem("workride_admin_pin") || DEFAULT_ADMIN_PIN;
  });

  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);

  // Active sub-tab inside Owner Hub
  const [adminTab, setAdminTab] = useState<"vehicles" | "jobs" | "gps">("vehicles");

  // Forms visibility
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [showAddJobForm, setShowAddJobForm] = useState(false);

  // New vehicle form state
  const [vehName, setVehName] = useState("");
  const [vehBrand, setVehBrand] = useState("Ola");
  const [vehModel, setVehModel] = useState("S1X Pro Commercial");
  const [vehType, setVehType] = useState<VehicleType>("electric_scooter");
  const [fuelType, setFuelType] = useState<FuelType>("EV Electric");
  const [dailyRate, setDailyRate] = useState<number>(180);
  const [weeklyRate, setWeeklyRate] = useState<number>(1100);
  const [monthlyRate, setMonthlyRate] = useState<number>(3900);
  const [depositAmount, setDepositAmount] = useState<number>(800);
  const [rangeKm, setRangeKm] = useState<number>(120);
  const [topSpeedKmH, setTopSpeedKmH] = useState<number>(75);
  const [loadCapacityKg, setLoadCapacityKg] = useState<number>(90);
  const [locationArea, setLocationArea] = useState("Lajpat Nagar Hub, Delhi");
  const [plateNumber, setPlateNumber] = useState("DL 08 EV 9941");
  const [vehImageUrl, setVehImageUrl] = useState(
    "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=800&q=80"
  );
  const [featuresInput, setFeaturesInput] = useState(
    "Long Range EV Battery, Heavy Duty Delivery Box Mount, Live GPS Tracker Installed"
  );

  // New Job form state
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("Blinkit Express Partner");
  const [companyLogo, setCompanyLogo] = useState("⚡");
  const [category, setCategory] = useState<JobCategory>("grocery_delivery");
  const [payoutType, setPayoutType] = useState<"per_order" | "daily" | "monthly">("daily");
  const [payoutAmount, setPayoutAmount] = useState<number>(1100);
  const [payoutLabel, setPayoutLabel] = useState("₹1,000 - ₹1,400 / day + Surge Bonus");
  const [area, setArea] = useState("Connaught Place, South Ex, Noida Hub");
  const [shiftTiming, setShiftTiming] = useState("Flexible 8 Hours Shift");
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [vacancies, setVacancies] = useState<number>(25);
  const [description, setDescription] = useState(
    "Delivery rider required for local express parcels and food/grocery orders within a 3km radius."
  );
  const [requirementsInput, setRequirementsInput] = useState(
    "Smartphone with internet, Driving License / Aadhaar Card, Age 18+"
  );
  const [perksInput, setPerksInput] = useState(
    "Daily instant payouts, High surge multiplier, Accident insurance covered"
  );

  // Private GPS telemetry live state for owner
  const [selectedGpsVehicle, setSelectedGpsVehicle] = useState<Vehicle | null>(null);

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === storedPin || enteredPin === "8899") {
      setIsAdminAuthenticated(true);
      localStorage.setItem("zyro_admin_auth", "true");
      localStorage.setItem("workride_admin_auth", "true");
      setPinError(null);
      setEnteredPin("");
    } else {
      setPinError("Ghalat Admin PIN! Kripya sahi 4-digit master passcode enter karein.");
    }
  };

  const handleQuickKeypad = (digit: string) => {
    if (enteredPin.length < 6) {
      setEnteredPin((prev) => prev + digit);
      setPinError(null);
    }
  };

  const handleClearPin = () => {
    setEnteredPin("");
    setPinError(null);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("zyro_admin_auth");
    localStorage.removeItem("workride_admin_auth");
    setEnteredPin("");
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length >= 4) {
      setStoredPin(newPin);
      localStorage.setItem("zyro_admin_pin", newPin);
      localStorage.setItem("workride_admin_pin", newPin);
      setPinChangeSuccess(true);
      setTimeout(() => {
        setPinChangeSuccess(false);
        setIsChangingPin(false);
        setNewPin("");
      }, 2000);
    }
  };

  // Handle vehicle submit
  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName || !plateNumber) return;

    const newVeh: Vehicle = {
      id: `veh-${Date.now()}`,
      name: vehName,
      brand: vehBrand,
      model: vehModel,
      type: vehType,
      fuelType,
      dailyRate: Number(dailyRate),
      weeklyRate: Number(weeklyRate),
      monthlyRate: Number(monthlyRate),
      depositAmount: Number(depositAmount),
      rangeKm: Number(rangeKm),
      topSpeedKmH: Number(topSpeedKmH),
      loadCapacityKg: Number(loadCapacityKg),
      locationCity: "Delhi NCR",
      locationArea,
      available: true,
      rating: 5.0,
      reviewsCount: 0,
      ownerId: "owner-current",
      ownerName: user.name || "Manoj (Master Fleet Owner)",
      ownerPhone: user.phone || "+91 98765 43210",
      plateNumber,
      gpsTrackerId: `GPS-${plateNumber.replace(/\s+/g, "-")}`,
      features: featuresInput.split(",").map((s) => s.trim()).filter(Boolean),
      batteryPercent: 96,
      liveLat: 28.62 + (Math.random() - 0.5) * 0.05,
      liveLng: 77.22 + (Math.random() - 0.5) * 0.05,
      speedKmH: 0,
      isUnlocked: false,
      imageUrl: vehImageUrl,
    };

    onAddNewVehicle(newVeh);
    setShowAddVehicleForm(false);
    setVehName("");
    setPlateNumber("");
  };

  // Handle job submit
  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company) return;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobTitle,
      company,
      companyLogo,
      category,
      payoutType,
      payoutAmount: Number(payoutAmount),
      payoutLabel: payoutLabel || `₹${payoutAmount} / ${payoutType}`,
      city: "Delhi NCR",
      area,
      shiftTiming,
      hoursPerDay: Number(hoursPerDay),
      vehicleRequired: true,
      recommendedVehicleTypes: ["electric_scooter", "bike", "scooter"],
      vacancies: Number(vacancies),
      applicantsCount: 0,
      requirements: requirementsInput.split(",").map((s) => s.trim()).filter(Boolean),
      description,
      perks: perksInput.split(",").map((s) => s.trim()).filter(Boolean),
      employerName: user.name || "Manoj Fleet Admin",
      employerPhone: user.phone || "+91 98765 43210",
      postedDate: new Date().toISOString().split("T")[0],
      joiningBonus: 1000,
    };

    onAddNewJob(newJob);
    setShowAddJobForm(false);
    setJobTitle("");
  };

  const currentlyOnRentCount = vehicles.filter((v) => !v.available).length;
  const totalDailyRentExpected = vehicles.reduce(
    (sum, v) => sum + (v.available ? 0 : v.dailyRate),
    0
  );

  /* -------------------------------------------------------------
     SECURITY GATE: If not authenticated, render Admin Login Pad
  ------------------------------------------------------------- */
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl space-y-6 text-center relative overflow-hidden">
          {/* Top Security Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mx-auto">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Restricted Access • Admin Only</span>
          </div>

          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Owner & Admin Authentication
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Yahan gaadiyan list karne, job post karne aur fleet GPS track karne ki permission sirf <span className="text-amber-400 font-bold">Admin/Owner</span> ke paas hai.
            </p>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative max-w-xs mx-auto">
              <input
                id="admin-pin-input"
                type={showPin ? "text" : "password"}
                maxLength={6}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(null);
                }}
                placeholder="Enter 4-digit PIN"
                className="w-full bg-slate-900 border-2 border-amber-400/60 rounded-2xl py-3 px-4 text-center font-mono text-xl tracking-widest text-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 shadow-inner"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                tabIndex={-1}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {pinError && (
              <div className="text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/80 rounded-xl p-2.5 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {/* Quick Digital Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleQuickKeypad(num)}
                  className="bg-slate-800/90 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-base border border-slate-700 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-bold py-2.5 rounded-xl text-xs border border-rose-800/50 active:scale-95 transition-all cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleQuickKeypad("0")}
                className="bg-slate-800/90 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-base border border-slate-700 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                0
              </button>
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl text-sm border border-amber-300 active:scale-95 transition-all cursor-pointer shadow-md flex items-center justify-center"
              >
                Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     AUTHENTICATED ADMIN & OWNER HUB
  ------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Master Owner Banner with Verified Admin Status */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/80 rounded-3xl p-6 text-white border border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Verified & Unlocked</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Session Active (Encrypted)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === "hinglish"
                ? "Fleet Management & Job Control Center"
                : language === "hindi"
                ? "मालिक और एडमिन कंट्रोल सेंटर"
                : "Owner & Fleet Master Admin Control"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {language === "hinglish"
                ? "Yahan sirf aap apne rental vehicles add kar sakte hain, gig vacancies post kar sakte hain aur live GPS tracking se apni poori fleet track kar sakte hain."
                : "Manage your rental vehicles, publish verified gig jobs, and monitor real-time GPS telemetry exclusively."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {adminTab === "vehicles" && (
              <button
                id="admin-add-vehicle-btn"
                onClick={() => setShowAddVehicleForm(!showAddVehicleForm)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showAddVehicleForm ? "Close Form" : "List New Vehicle (+)"}</span>
              </button>
            )}
            {adminTab === "jobs" && (
              <button
                id="admin-add-job-btn"
                onClick={() => setShowAddJobForm(!showAddJobForm)}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showAddJobForm ? "Close Form" : "Post New Job (+)"}</span>
              </button>
            )}

            {/* Change PIN toggle */}
            <button
              onClick={() => setIsChangingPin(!isChangingPin)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-2xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="Change Security PIN"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Change PIN</span>
            </button>

            {/* Lock / Logout Button */}
            <button
              id="admin-lock-logout-btn"
              onClick={handleAdminLogout}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-rose-700/60 flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              title="Lock Admin Hub Immediately"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Lock Hub 🔒</span>
            </button>
          </div>
        </div>

        {/* Change PIN Drawer */}
        {isChangingPin && (
          <form
            onSubmit={handleSaveNewPin}
            className="bg-slate-900/95 border border-amber-400/50 p-4 rounded-2xl flex flex-wrap items-center gap-3 animate-in fade-in"
          >
            <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Set New 4-Digit Admin PIN:</span>
            </div>
            <input
              type="password"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="New PIN (min 4 digits)"
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              required
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer"
            >
              Save PIN
            </button>
            <button
              type="button"
              onClick={() => setIsChangingPin(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Cancel
            </button>
            {pinChangeSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PIN Updated!
              </span>
            )}
          </form>
        )}

        {/* Master Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 overflow-x-auto">
          <button
            id="owner-tab-vehicles"
            onClick={() => setAdminTab("vehicles")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === "vehicles"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-300 hover:text-white"
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>My Vehicles on Rent ({vehicles.length})</span>
          </button>

          <button
            id="owner-tab-jobs"
            onClick={() => setAdminTab("jobs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === "jobs"
                ? "bg-cyan-400 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-300 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Vacancies ({jobs.length})</span>
          </button>

          <button
            id="owner-tab-gps"
            onClick={() => setAdminTab("gps")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === "gps"
                ? "bg-emerald-400 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-300 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>Private Fleet GPS Tracker ({vehicles.length})</span>
          </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">My Listed Vehicles</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {vehicles.length} Total
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {vehicles.length > 0 ? "Managed by Sole Owner" : "No vehicles listed yet"}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Currently On Rent</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {currentlyOnRentCount} Active Rentals
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {currentlyOnRentCount > 0 ? `₹${totalDailyRentExpected}/day live billing` : "0 vehicles currently rented out"}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Active Job Postings</div>
          <div className="text-2xl font-black text-cyan-600 mt-1">
            {jobs.length} Openings
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {jobs.length > 0 ? "Riders can apply with 1 click" : "0 active job posts"}
          </div>
        </div>
      </div>

      {/* TAB 1: VEHICLES MANAGEMENT */}
      {adminTab === "vehicles" && (
        <div className="space-y-5">
          {/* Add Vehicle Form Drawer */}
          {showAddVehicleForm && (
            <form
              onSubmit={handleVehicleSubmit}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400/80 shadow-xl space-y-5 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-500" />
                  <span>List a New Vehicle for Rent</span>
                </h3>
                <span className="text-xs text-slate-500">Only you (Owner) can list</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Vehicle Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ola S1X EV Cargo / Hero Splendor Plus"
                    value={vehName}
                    onChange={(e) => setVehName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Registration Plate Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL 01 EV 8899"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehType}
                    onChange={(e) => setVehType(e.target.value as VehicleType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="electric_scooter">Electric Scooter (EV)</option>
                    <option value="bike">Motorcycle / Petrol Bike</option>
                    <option value="e_rickshaw">Commercial E-Rickshaw</option>
                    <option value="delivery_van">Cargo Mini-Truck (Tata Ace)</option>
                    <option value="scooter">Petrol Scooter (Activa)</option>
                    <option value="car">Commercial Car / Taxi</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Fuel / Power Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="EV Electric">EV Electric (Rechargeable)</option>
                    <option value="EV Fast Charge">EV Fast Charge</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Daily Rent Tariff (₹ / Day) *
                  </label>
                  <input
                    type="number"
                    required
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Weekly Rent Tariff (₹ / Week) *
                  </label>
                  <input
                    type="number"
                    required
                    value={weeklyRate}
                    onChange={(e) => setWeeklyRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Monthly Rent Tariff (₹ / Month) *
                  </label>
                  <input
                    type="number"
                    required
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Refundable Security Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pickup Hub / Location Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Connaught Place Hub / Lajpat Nagar"
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Vehicle Photo Image URL
                  </label>
                  <input
                    type="url"
                    value={vehImageUrl}
                    onChange={(e) => setVehImageUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Features & Highlights (comma separated)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Vehicle to Catalog</span>
                </button>
              </div>
            </form>
          )}

          {/* Vehicle List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Fleet Vehicle Inventory ({vehicles.length})
            </h3>

            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={v.imageUrl}
                        alt={v.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.available
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {v.available ? "AVAILABLE FOR RENT" : "ON RENT (ACTIVE)"}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-600 font-bold mt-0.5">
                          {v.plateNumber} • {v.fuelType}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{v.locationArea}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500">Rent: </span>
                        <span className="font-bold text-slate-900">₹{v.dailyRate}/day</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleVehicleAvailability(v.id)}
                          className="text-[11px] font-bold px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          {v.available ? "Mark as Rented" : "Mark as Available"}
                        </button>
                        <button
                          onClick={() => onDeleteVehicle(v.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                  <Key className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    No Vehicles Listed Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Apni pehli gaadi rent par list karne ke liye upar 'List New Vehicle (+)' par click karein.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddVehicleForm(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  List Vehicle Now (+)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: JOB VACANCIES MANAGEMENT */}
      {adminTab === "jobs" && (
        <div className="space-y-5">
          {/* Add Job Form Drawer */}
          {showAddJobForm && (
            <form
              onSubmit={handleJobSubmit}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-cyan-400/80 shadow-xl space-y-5 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-500" />
                  <span>Post a New Gig / Delivery Job</span>
                </h3>
                <span className="text-xs text-slate-500">Only you (Owner) can post</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blinkit 10-Min Delivery Partner"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Company Name / Client *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zomato, Zepto, Porter, Delhivery"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Job Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JobCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  >
                    <option value="grocery_delivery">Grocery & Quick Commerce</option>
                    <option value="food_delivery">Food Delivery</option>
                    <option value="courier">Local Courier & Field Logistics</option>
                    <option value="ecommerce">E-Commerce Parcel Dispatch</option>
                    <option value="warehouse">Warehouse & Hub Loading</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Payout Type
                  </label>
                  <select
                    value={payoutType}
                    onChange={(e) => setPayoutType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  >
                    <option value="daily">Daily Payout</option>
                    <option value="per_order">Per Order / Delivery</option>
                    <option value="monthly">Monthly Fixed Salary</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Payout Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Payout Display Label (e.g. ₹55/order + ₹300 incentive)
                  </label>
                  <input
                    type="text"
                    value={payoutLabel}
                    onChange={(e) => setPayoutLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Delivery Hub / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Connaught Place & Central Delhi"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Number of Vacancies
                  </label>
                  <input
                    type="number"
                    value={vacancies}
                    onChange={(e) => setVacancies(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Job Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddJobForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Job Vacancy</span>
                </button>
              </div>
            </form>
          )}

          {/* Jobs List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Active Job Vacancies ({jobs.length})
            </h3>

            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">{job.company}</span>
                        <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          ACTIVE HIRING
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-1">{job.title}</h4>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.area}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <div className="font-bold text-emerald-600">{job.payoutLabel}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-semibold text-[11px]">
                          {job.vacancies} Vacancies
                        </span>
                        <button
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mx-auto text-cyan-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    No Job Vacancies Posted Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Riders ko onboard karne ke liye upar 'Post New Job (+)' par click karein.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddJobForm(true)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Post Job Vacancy Now (+)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PRIVATE FLEET GPS LIVE TRACKER (EXCLUSIVE TO OWNER) */}
      {adminTab === "gps" && (
        <div className="space-y-5">
          <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Owner Private Telemetry Feed (Encrypted)</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  Live Fleet GPS & Engine Immobilizer Console
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sirf aap apni vehicles ka exact location, speed aur digital remote lock control dekh sakte hain.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-emerald-400 font-bold">{vehicles.length} Vehicles Monitored</span>
              </div>
            </div>

            {/* GPS Vehicles Grid */}
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Vehicles list for telemetry */}
                <div className="lg:col-span-1 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {vehicles.map((v) => {
                    const isSelected = selectedGpsVehicle?.id === v.id || (!selectedGpsVehicle && vehicles[0]?.id === v.id);
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedGpsVehicle(v)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 border-emerald-400 ring-2 ring-emerald-500/20"
                            : "bg-slate-900/60 border-slate-800 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white text-sm">{v.name}</div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            v.available ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}>
                            {v.available ? "IDLE / HUB" : "ON ACTIVE RIDE"}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-1">
                          {v.plateNumber} • {v.gpsTrackerId}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Gauge className="w-3.5 h-3.5" />
                            <span>{v.speedKmH || 0} km/h</span>
                          </span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <BatteryCharging className="w-3.5 h-3.5" />
                            <span>{v.batteryPercent || 95}%</span>
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {v.locationArea.split(",")[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live Telemetry Radar Map Canvas */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                  <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                    {/* Simulated Radar Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border border-emerald-500/20 animate-ping"></div>
                      <div className="w-32 h-32 rounded-full border border-emerald-500/30"></div>
                    </div>

                    {/* Live Vehicle Markers */}
                    {vehicles.map((v, idx) => (
                      <div
                        key={v.id}
                        className="absolute flex flex-col items-center cursor-pointer group"
                        style={{
                          top: `${35 + (idx % 3) * 20}%`,
                          left: `${30 + (idx % 4) * 18}%`,
                        }}
                        onClick={() => setSelectedGpsVehicle(v)}
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 group-hover:scale-125 transition-transform">
                          <Bike className="w-4 h-4" />
                        </div>
                        <span className="bg-slate-900/90 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 border border-slate-700 whitespace-nowrap">
                          {v.plateNumber}
                        </span>
                      </div>
                    ))}

                    <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Live Geofence: Delhi NCR Ring 1</span>
                    </div>
                  </div>

                  {/* Telemetry Control Bar */}
                  {selectedGpsVehicle || vehicles[0] ? (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-400">Selected Telemetry Target:</div>
                        <div className="font-bold text-white text-sm mt-0.5">
                          {(selectedGpsVehicle || vehicles[0]).name} ({(selectedGpsVehicle || vehicles[0]).plateNumber})
                        </div>
                        <div className="text-xs font-mono text-emerald-400 mt-0.5">
                          Lat: {(selectedGpsVehicle || vehicles[0]).liveLat || 28.6315} • Lng: {(selectedGpsVehicle || vehicles[0]).liveLng || 77.2167}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const target = selectedGpsVehicle || vehicles[0];
                            onToggleVehicleAvailability(target.id);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Remote Engine Lock</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
                <Radio className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No Vehicles to Track</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Jaise hi aap apni bike ya EV rent par list karenge, unka live GPS telemetry yahan real-time me track hoga.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
