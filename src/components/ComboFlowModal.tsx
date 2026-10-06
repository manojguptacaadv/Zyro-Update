import React, { useState } from "react";
import { Job, Vehicle, AppLanguage, UserProfile } from "../types";
import { translations } from "../data/translations";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Bike, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  IndianRupee, 
  Calculator, 
  MapPin, 
  Clock, 
  Key, 
  AlertCircle 
} from "lucide-react";

interface ComboFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: Job | null;
  selectedVehicle: Vehicle | null;
  allJobs: Job[];
  allVehicles: Vehicle[];
  language: AppLanguage;
  user: UserProfile;
  onConfirmCombo: (job: Job, vehicle: Vehicle, duration: "daily" | "weekly" | "monthly") => void;
}

export const ComboFlowModal: React.FC<ComboFlowModalProps> = ({
  isOpen,
  onClose,
  selectedJob,
  selectedVehicle,
  allJobs,
  allVehicles,
  language,
  user,
  onConfirmCombo,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const hasItems = allJobs.length > 0 && allVehicles.length > 0;

  // Selected state
  const [currentJob, setCurrentJob] = useState<Job | null>(
    selectedJob || (allJobs.length > 0 ? allJobs[0] : null)
  );
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(
    selectedVehicle ||
      (currentJob ? allVehicles.find((v) => currentJob.recommendedVehicleTypes?.includes(v.type)) : null) ||
      (allVehicles.length > 0 ? allVehicles[0] : null)
  );
  const [duration, setDuration] = useState<"daily" | "weekly" | "monthly">("daily");

  if (!hasItems || !currentJob || !currentVehicle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-600">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {language === "hinglish"
                ? "Abhi Combo ke liye Listings available nahi hain"
                : "No Listings Available for Combo Yet"}
            </h3>
            <p className="text-xs text-slate-500">
              {language === "hinglish"
                ? "Job + Gaadi Combo ke liye pehle rental vehicle aur gig job post hona zaroori hai."
                : "Please list a vehicle or post a gig job first to create bundled combos."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Financial calculations
  const estDeliveries = currentJob.payoutType === "per_order" ? 24 : 20;
  const grossDaily = currentJob.payoutType === "per_order" 
    ? estDeliveries * currentJob.payoutAmount + 250 // daily incentive
    : currentJob.payoutType === "daily" 
    ? currentJob.payoutAmount 
    : Math.round(currentJob.payoutAmount / 26);

  const vehicleDailyRent = duration === "daily" 
    ? currentVehicle.dailyRate 
    : duration === "weekly" 
    ? Math.round(currentVehicle.weeklyRate / 7) 
    : Math.round(currentVehicle.monthlyRate / 30);

  const isEV = currentVehicle.fuelType.includes("EV");
  const fuelOrEnergyCost = isEV ? 50 : 160;

  const netDailyProfit = grossDaily - vehicleDailyRent - fuelOrEnergyCost;
  const monthlyProfitEstimate = netDailyProfit * 26;

  // Deposit with Combo waiver promo
  const standardDeposit = currentVehicle.depositAmount;
  const comboDiscount = Math.min(300, standardDeposit);
  const finalDepositToEscrow = standardDeposit - comboDiscount;

  const handleConfirm = () => {
    if (currentJob && currentVehicle) {
      onConfirmCombo(currentJob, currentVehicle, duration);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 relative">
          <button
            id="close-combo-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zyro Instant Combo Pack</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {language === "hinglish"
              ? "Job Lo + Gaadi Rent Karo (1-Click Start)"
              : language === "hindi"
              ? "नौकरी व वाहन किराया एक साथ लें"
              : "Job & Vehicle Rental All-In-One Pack"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === "hinglish"
              ? "Gaadi nahi hone ki tension khatam! Instant rental gaadi ke saath delivery shuru karein."
              : "No vehicle needed. Get matched vehicle on rent, start working today and take home maximum profit."}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1 & 2: Selected Job & Selected Vehicle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Selection Box */}
            <div className="border-2 border-emerald-500/50 bg-emerald-50/40 rounded-2xl p-4 relative">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded absolute -top-2.5 left-3">
                Step 1: Selected Job
              </span>
              
              <div className="flex items-center gap-2 mt-1">
                {currentJob.companyLogo && currentJob.companyLogo.startsWith("http") ? (
                  <img
                    src={currentJob.companyLogo}
                    alt={currentJob.company}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-200 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                    <Briefcase className="w-5 h-5" />
                  </div>
                )}
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-500">{currentJob.company}</div>
                  <h4 className="font-bold text-slate-900 text-sm truncate">{currentJob.title}</h4>
                </div>
              </div>

              <div className="mt-2 text-xs text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                Payout: {currentJob.payoutLabel}
              </div>

              <div className="mt-3">
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Change Job:
                </label>
                <select
                  value={currentJob.id}
                  onChange={(e) => {
                    const found = allJobs.find((j) => j.id === e.target.value);
                    if (found) setCurrentJob(found);
                  }}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {allJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.company} - {j.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehicle Selection Box */}
            <div className="border-2 border-teal-500/50 bg-teal-50/40 rounded-2xl p-4 relative">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded absolute -top-2.5 left-3">
                Step 2: Matched Rental Vehicle
              </span>

              <div className="flex items-center gap-2 mt-1">
                <img
                  src={currentVehicle.imageUrl}
                  alt={currentVehicle.name}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-500">{currentVehicle.brand}</div>
                  <h4 className="font-bold text-slate-900 text-sm truncate">{currentVehicle.name}</h4>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs bg-teal-100/80 px-2.5 py-1 rounded-lg">
                <span className="text-teal-900 font-bold">₹{currentVehicle.dailyRate}/day</span>
                <span className="text-[10px] font-semibold text-teal-800 bg-teal-200/80 px-1.5 py-0.2 rounded">
                  {currentVehicle.fuelType}
                </span>
              </div>

              <div className="mt-3">
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Change Vehicle:
                </label>
                <select
                  value={currentVehicle.id}
                  onChange={(e) => {
                    const found = allVehicles.find((v) => v.id === e.target.value);
                    if (found) setCurrentVehicle(found);
                  }}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  {allVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (₹{v.dailyRate}/day - {v.fuelType})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rental Duration Selector */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700">
              Select Rental Billing Cycle:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDuration("daily")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  duration === "daily"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Daily (₹{currentVehicle.dailyRate}/day)
              </button>
              <button
                onClick={() => setDuration("weekly")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  duration === "weekly"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Weekly (₹{currentVehicle.weeklyRate}/wk)
              </button>
              <button
                onClick={() => setDuration("monthly")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  duration === "monthly"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Monthly (₹{currentVehicle.monthlyRate}/mo)
              </button>
            </div>
          </div>

          {/* Net Profit & Daily Earning Breakdown Calculator */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4.5 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Calculator className="w-4 h-4" />
                <span>Daily Profit & Loss Transparency</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Based on ~{currentJob.hoursPerDay} hrs work shift
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Estimated Gross Job Earnings:</span>
                <span className="font-bold text-emerald-400">+₹{grossDaily} / day</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Vehicle Rent ({currentVehicle.name}):</span>
                <span className="font-bold text-rose-400">-₹{vehicleDailyRent} / day</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>{isEV ? "Battery Swap & Charging:" : "Petrol / Fuel cost:"}</span>
                <span className="font-bold text-rose-400">-₹{fuelOrEnergyCost} / day</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Net Cash Profit in Hand
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  ₹{netDailyProfit} <span className="text-xs font-semibold text-slate-300">/ day</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Monthly Potential
                </div>
                <div className="text-lg font-black text-amber-400">
                  ₹{monthlyProfitEstimate.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-300">/ mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Deposit & Escrow Guarantee Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-900">
                Combo Security Deposit: ₹{finalDepositToEscrow}{" "}
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded ml-1">
                  100% Refundable
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Deposit is held safely in Zyro Escrow. Whenever you complete or cancel your rental, the full amount is instantly released back to your UPI or Bank.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            <span className="font-semibold text-slate-900">Immediate Start:</span> Pickup OTP & Digital Key will be activated upon confirmation.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-combo-activate-btn"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-2.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Start Working</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
