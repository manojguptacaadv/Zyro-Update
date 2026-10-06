import React, { useState } from "react";
import { Vehicle, AppLanguage, UserProfile, GPSStation } from "../types";
import { translations } from "../data/translations";
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  Key, 
  FileText, 
  Calendar, 
  IndianRupee, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  initialDuration: "daily" | "weekly" | "monthly";
  language: AppLanguage;
  user: UserProfile;
  pickupStations: GPSStation[];
  onConfirmBooking: (
    vehicle: Vehicle,
    duration: "daily" | "weekly" | "monthly",
    durationCount: number,
    pickupLocation: string
  ) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  initialDuration,
  language,
  user,
  pickupStations,
  onConfirmBooking,
}) => {
  if (!isOpen || !vehicle) return null;

  const t = translations[language];

  const [durationType, setDurationType] = useState<"daily" | "weekly" | "monthly">(initialDuration);
  const [durationCount, setDurationCount] = useState<number>(1);
  const [selectedPickupHub, setSelectedPickupHub] = useState<string>(
    pickupStations[0]?.name || vehicle.locationArea
  );
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  // Price calculations
  const ratePerUnit = durationType === "daily" 
    ? vehicle.dailyRate 
    : durationType === "weekly" 
    ? vehicle.weeklyRate 
    : vehicle.monthlyRate;

  const totalRent = ratePerUnit * durationCount;
  const deposit = vehicle.depositAmount;
  const grandTotal = totalRent + deposit;

  const handleBooking = () => {
    onConfirmBooking(vehicle, durationType, durationCount, selectedPickupHub);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                {vehicle.fuelType}
              </span>
              <h3 className="text-xl font-black text-white mt-1">{vehicle.name}</h3>
              <div className="text-xs text-slate-300">
                Plate: <span className="font-mono font-bold text-amber-300">{vehicle.plateNumber}</span> • {vehicle.brand}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Plan Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">
              Select Rental Plan:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDurationType("daily")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  durationType === "daily"
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Daily (₹{vehicle.dailyRate}/d)
              </button>
              <button
                type="button"
                onClick={() => setDurationType("weekly")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  durationType === "weekly"
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Weekly (₹{vehicle.weeklyRate}/w)
              </button>
              <button
                type="button"
                onClick={() => setDurationType("monthly")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  durationType === "monthly"
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Monthly (₹{vehicle.monthlyRate}/m)
              </button>
            </div>
          </div>

          {/* Duration Quantity */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Rental Duration Units:
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDurationCount(Math.max(1, durationCount - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="font-extrabold text-sm text-slate-900 min-w-12 text-center">
                {durationCount} {durationType === "daily" ? "Day(s)" : durationType === "weekly" ? "Week(s)" : "Month(s)"}
              </span>
              <button
                type="button"
                onClick={() => setDurationCount(durationCount + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Pickup Station Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Choose Pickup Hub / Station:</span>
            </label>
            <select
              value={selectedPickupHub}
              onChange={(e) => setSelectedPickupHub(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {pickupStations.map((station) => (
                <option key={station.id} value={station.name}>
                  {station.name} ({station.distanceKm} km away • {station.operatingHours})
                </option>
              ))}
              <option value={vehicle.locationArea}>
                {vehicle.locationArea} (Vehicle Base Location)
              </option>
            </select>
          </div>

          {/* KYC Status Indicator */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-slate-900">
                  Worker KYC Status: Verified (Aadhaar & DL)
                </div>
                <div className="text-[11px] text-slate-500">
                  Instant paperless digital authorization
                </div>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-300 pb-1 border-b border-slate-800">
              Payment & Security Escrow Summary
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Rental Charge ({durationCount} {durationType}):</span>
              <span className="font-bold text-white">₹{totalRent}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <span>Refundable Security Deposit:</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1 rounded">100% Escrow</span>
              </span>
              <span className="font-bold text-amber-300">₹{deposit}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm">
              <span className="font-bold text-white">Total Amount:</span>
              <span className="text-xl font-black text-emerald-400">₹{grandTotal}</span>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
            />
            <span>
              I agree to the Zyro Commercial Rental terms. The security deposit will be 100% refunded to my wallet immediately upon vehicle return.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="confirm-booking-btn"
            onClick={handleBooking}
            disabled={!agreeToTerms}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Unlock Vehicle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
