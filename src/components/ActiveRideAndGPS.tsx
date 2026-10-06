import React, { useState, useEffect } from "react";
import { RentalBooking, AppLanguage, JobApplication } from "../types";
import { translations } from "../data/translations";
import { 
  Key, 
  Lock, 
  Unlock, 
  BatteryCharging, 
  Zap, 
  Gauge, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  TrendingUp, 
  Bike,
  Play,
  Pause,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Award,
  DollarSign,
  Receipt,
  Calendar,
  AlertCircle
} from "lucide-react";

interface ActiveRideAndGPSProps {
  activeBooking: RentalBooking | null;
  bookingHistory: RentalBooking[];
  activeJobApplication: JobApplication | null;
  language: AppLanguage;
  onToggleLock: (bookingId: string) => void;
  onSimulateDelivery: () => void;
  onEndRide: (bookingId: string) => void;
}

interface DeliveryTrip {
  id: string;
  time: string;
  orderNumber: string;
  merchant: string;
  dropArea: string;
  distanceKm: number;
  deliveryPay: number;
  tip: number;
}

export const ActiveRideAndGPS: React.FC<ActiveRideAndGPSProps> = ({
  activeBooking,
  bookingHistory,
  activeJobApplication,
  language,
  onToggleLock,
  onSimulateDelivery,
  onEndRide,
}) => {
  const t = translations[language];

  // Shift Timer State
  const [shiftActive, setShiftActive] = useState<boolean>(true);
  const [shiftSeconds, setShiftSeconds] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  // Speed and live ride simulation state
  const [speed, setSpeed] = useState<number>(0);

  // Recent Completed Trips in this shift
  const [trips, setTrips] = useState<DeliveryTrip[]>([]);

  // Live stopwatch counter
  useEffect(() => {
    let timer: any = null;
    if (shiftActive && activeBooking) {
      timer = setInterval(() => {
        setShiftSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [shiftActive, activeBooking]);

  // Speed oscillation when vehicle is unlocked
  useEffect(() => {
    if (!activeBooking) return;
    const interval = setInterval(() => {
      if (activeBooking.digitalKeyStatus === "unlocked" && shiftActive) {
        setSpeed((prev) => Math.max(0, Math.min(55, prev + Math.floor((Math.random() - 0.48) * 8))));
      } else {
        setSpeed(0);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeBooking, shiftActive]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  // Format shift seconds into HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };

  const isUnlocked = activeBooking?.digitalKeyStatus === "unlocked";

  // Financial calculations
  const deliveriesCount = activeJobApplication?.deliveriesCompleted || 14;
  const grossEarnings = activeJobApplication?.earningsToday || (deliveriesCount * 55 + 120); // base + tips
  const dailyVehicleRent = activeBooking ? activeBooking.ratePerUnit : 180;
  const estimatedFuelExpense = activeBooking?.vehicleType.includes("electric") ? 50 : 160;
  const netInHandProfit = Math.max(0, grossEarnings - dailyVehicleRent - estimatedFuelExpense);
  const shiftHoursDecimal = Math.max(1, shiftSeconds / 3600);
  const hourlyIncome = Math.round(netInHandProfit / shiftHoursDecimal);

  // Target and Incentive metrics
  const targetOrders = 25;
  const progressPercent = Math.min(100, Math.round((deliveriesCount / targetOrders) * 100));
  const ordersRemainingForBonus = Math.max(0, targetOrders - deliveriesCount);

  // Handle local delivery simulation with extra trip log item
  const handlePerformDelivery = () => {
    onSimulateDelivery();
    const newTrip: DeliveryTrip = {
      id: `trip-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      merchant: activeJobApplication?.company || "Quick Commerce Hub",
      dropArea: "Customer Delivery Point",
      distanceKm: Number((1.5 + Math.random() * 2.5).toFixed(1)),
      deliveryPay: 55,
      tip: Math.random() > 0.4 ? 15 : 0,
    };
    setTrips((prev) => [newTrip, ...prev.slice(0, 5)]);
    showToast("🎉 Order Delivered! +₹55 delivery charge + bonus added to your earnings!");
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {notification && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 z-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-300" />
            <span>{notification}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-mono">Updated</span>
        </div>
      )}

      {/* Active Shift & Vehicle Master Section */}
      {activeBooking ? (
        <div className="space-y-5">
          {/* 1. MASTER SHIFT HEADER WITH LIVE TIMER */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white border border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                    <span>LIVE DUTY SHIFT</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Started at: <strong className="text-slate-200">08:00 AM Today</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeJobApplication?.jobTitle || "Delivery Rider Duty"}
                </h2>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{activeJobApplication?.company || "Partner Hub"}</span>
                  <span>•</span>
                  <span>Vehicle: <strong className="text-amber-300 font-mono">{activeBooking.vehicleName} ({activeBooking.vehiclePlate})</strong></span>
                </div>
              </div>

              {/* Live Clock & Shift Control Buttons */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center gap-3 shrink-0 shadow-inner">
                <div className="text-center sm:text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 justify-center sm:justify-start">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Shift Duration</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300 mt-0.5 tracking-wider">
                    {formatTime(shiftSeconds)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShiftActive(!shiftActive);
                      showToast(shiftActive ? "Shift paused for break ☕" : "Shift resumed! Back on duty 🚀");
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                      shiftActive
                        ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                    }`}
                  >
                    {shiftActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Break</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePerformDelivery}
                    id="rider-simulate-delivery-top-btn"
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>+1 Delivery (+₹55)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Vehicle Digital Key & Telemetry Row */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/70 rounded-2xl p-3 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-400" />
                    <span>Digital Motor Key</span>
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isUnlocked ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-black text-white">
                    {isUnlocked ? "IGNITION ON" : "MOTOR LOCKED"}
                  </span>
                  <button
                    onClick={() => {
                      onToggleLock(activeBooking.id);
                      showToast(
                        !isUnlocked
                          ? "Motor Unlocked! Ready to ride ⚡"
                          : "Motor Locked & Immobilized 🔒"
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      isUnlocked
                        ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                    }`}
                  >
                    {isUnlocked ? "Lock 🔒" : "Unlock ⚡"}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/70 rounded-2xl p-3 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-400" />
                  <span>Battery / Range</span>
                </div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {activeBooking.batteryLevel}%{" "}
                  <span className="text-[11px] font-normal text-slate-400">(~58 km)</span>
                </div>
              </div>

              <div className="bg-slate-900/70 rounded-2xl p-3 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  <span>Live Speed</span>
                </div>
                <div className="text-lg font-black text-white mt-1">
                  {speed} <span className="text-xs font-normal text-slate-400">km/h</span>
                </div>
              </div>

              <div className="bg-slate-900/70 rounded-2xl p-3 border border-slate-800 flex flex-col justify-between">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Support / Return</span>
                </div>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <button
                    onClick={() => showToast("Mechanic & 24x7 Roadside helpline notified!")}
                    className="text-[10px] text-rose-300 bg-rose-950/60 border border-rose-800/50 hover:bg-rose-900/60 px-2 py-1 rounded cursor-pointer font-bold"
                  >
                    SOS Help
                  </button>
                  <button
                    onClick={() => onEndRide(activeBooking.id)}
                    className="text-[10px] text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded cursor-pointer border border-slate-700"
                  >
                    Return
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. REAL-TIME FINANCIAL LEDGER: INCOME vs RENT vs NET PROFIT */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Today's Shift Financial Ledger (Income & Kiraya)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  Live Income & Vehicle Rent Deduction
                </h3>
              </div>
              <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Avg. Hourly Rate: <span className="text-emerald-700 font-extrabold">₹{hourlyIncome} / hr</span>
              </div>
            </div>

            {/* 4-Card Financial Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Gross Earnings */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl p-4 border border-teal-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-teal-800 uppercase flex items-center justify-between">
                  <span>1. Gross Earnings</span>
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-teal-950">
                  +₹{grossEarnings}
                </div>
                <div className="text-[11px] text-teal-700 font-medium pt-1">
                  {deliveriesCount} orders + tips & incentives
                </div>
              </div>

              {/* Card 2: Vehicle Rent */}
              <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl p-4 border border-rose-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-rose-800 uppercase flex items-center justify-between">
                  <span>2. Vehicle Rent</span>
                  <Receipt className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-950">
                  -₹{dailyVehicleRent}
                </div>
                <div className="text-[11px] text-rose-700 font-medium pt-1">
                  Daily tariff for {activeBooking.vehicleName}
                </div>
              </div>

              {/* Card 3: Energy / Fuel Cost */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-4 border border-amber-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-amber-800 uppercase flex items-center justify-between">
                  <span>3. Est. Fuel / EV Charge</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950">
                  -₹{estimatedFuelExpense}
                </div>
                <div className="text-[11px] text-amber-700 font-medium pt-1">
                  Estimated daily power consumption
                </div>
              </div>

              {/* Card 4: In-Hand Net Profit (Highlighted) */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4 border border-emerald-500 shadow-md space-y-1">
                <div className="text-xs font-bold text-emerald-200 uppercase flex items-center justify-between">
                  <span>4. In-Hand Net Profit</span>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ₹{netInHandProfit}
                </div>
                <div className="text-[11px] text-emerald-100 font-medium pt-1">
                  💰 Pure savings in your pocket
                </div>
              </div>
            </div>

            {/* Formula explanation bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Profit Breakdown:</span>
                <span className="font-mono text-[11px] text-slate-600">
                  ₹{grossEarnings} (Earned) - ₹{dailyVehicleRent} (Rent) - ₹{estimatedFuelExpense} (Energy) = <strong className="text-emerald-700">₹{netInHandProfit} In-Hand</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                Deposit Escrow: <strong className="text-emerald-600">₹{activeBooking.depositAmount} (100% Refundable)</strong>
              </span>
            </div>
          </div>

          {/* 3. ORDER MILESTONES & DAILY INCENTIVE PROGRESS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Daily Order Milestones & Target</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {deliveriesCount} of {targetOrders} Deliveries Completed Today
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Milestone Bonus</span>
                  <span className="text-sm font-black text-emerald-600">+₹200 on 25 orders</span>
                </div>
                <button
                  onClick={handlePerformDelivery}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Complete Next Order</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>{progressPercent}% Target Achieved</span>
                {ordersRemainingForBonus > 0 ? (
                  <span className="text-amber-600">
                    🔥 Bas {ordersRemainingForBonus} aur orders door hain ₹200 Super Bonus se!
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Target Achieved! Super Bonus Unlocked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4. TODAY'S SHIFT TRIPS & DELIVERIES LOG */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Today's Shift Trips Log ({trips.length})</span>
              </h3>
              <span className="text-xs text-slate-500">Live updated as you deliver</span>
            </div>

            {trips.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center text-xs space-y-1">
                <Clock className="w-6 h-6 mx-auto text-slate-400" />
                <p className="font-bold text-slate-700">No trips completed yet</p>
                <p className="text-slate-500 text-[11px]">Completed deliveries during your active shift will appear here in real time.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-black flex items-center justify-center shrink-0 text-xs">
                        ✓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{trip.orderNumber}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-700">{trip.merchant}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{trip.dropArea} ({trip.distanceKm} km)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <span className="text-[11px] text-slate-400 font-mono">{trip.time}</span>
                      <div className="text-right">
                        <span className="font-black text-emerald-700 text-sm">+₹{trip.deliveryPay + trip.tip}</span>
                        {trip.tip > 0 && (
                          <span className="text-[10px] text-amber-600 block">incl. ₹{trip.tip} tip</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* No active ride banner */
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Bike className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-xl font-black text-white">
              {language === "hinglish"
                ? "Abhi koi Active Gaadi ya Shift nahi hai"
                : "No Active Rental or Shift Currently"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === "hinglish"
                ? "Gaadi rent karein ya Job + Gaadi Combo pack book karein. Booking hote hi aapka shift timer, real-time income aur digital motor key yahan active ho jayega."
                : "Rent a vehicle or select a Job Combo to start your active duty shift and live earnings ledger."}
            </p>
          </div>
        </div>
      )}

      {/* 5. RENTAL & INVOICE HISTORY */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900">
          {language === "hinglish" ? "Pichla Rental & Escrow Deposit History" : "Rental & Escrow Deposit History"}
        </h3>

        {bookingHistory.length > 0 ? (
          <div className="space-y-3">
            {bookingHistory.map((bk) => (
              <div
                key={bk.id}
                className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={bk.vehicleImage}
                    alt={bk.vehicleName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{bk.vehicleName}</span>
                      <span className="font-mono text-[11px] text-slate-600 bg-white px-1.5 py-0.2 rounded border">
                        {bk.vehiclePlate}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {bk.startDate} • {bk.durationCount} {bk.durationType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div>
                    <div className="font-bold text-slate-900">Rent Paid: ₹{bk.totalRent}</div>
                    <div className="text-emerald-600 font-semibold text-[11px]">
                      Deposit: ₹{bk.depositAmount} ({bk.depositStatus === "refunded" ? "100% Refunded" : "In Escrow"})
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    bk.status === "completed" 
                      ? "bg-slate-200 text-slate-800" 
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {bk.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Aapki sabhi future shift receipts aur refund status yahan record honge.
          </div>
        )}
      </div>
    </div>
  );
};
