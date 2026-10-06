import React, { useState } from "react";
import { AppLanguage, Vehicle, Job } from "../types";
import { translations } from "../data/translations";
import { 
  Sparkles, 
  Send, 
  Calculator, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  IndianRupee, 
  Clock, 
  MapPin, 
  Bike, 
  ArrowRight,
  Bot,
  RefreshCw
} from "lucide-react";
import { getApiUrl } from "../lib/api";

interface AIAdvisorProps {
  language: AppLanguage;
  currentCity: string;
  allVehicles: Vehicle[];
  allJobs: Job[];
  onSelectCombo: (job: Job, vehicle: Vehicle) => void;
}

interface AIRecommendation {
  summary: string;
  estimatedDeliveries: number;
  grossDaily: number;
  vehicleRentalDaily: number;
  fuelOrChargingCost: number;
  netDailyProfit: number;
  monthlyPotential: number;
  topPicksExplanation?: string;
  tips: string[];
  bestJobMatches: string[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  language,
  currentCity,
  allVehicles,
  allJobs,
  onSelectCombo,
}) => {
  const t = translations[language];

  // Inputs
  const [city, setCity] = useState(currentCity || "Delhi NCR");
  const [jobCategory, setJobCategory] = useState("Quick 10-Min Grocery (Blinkit / Zepto)");
  const [vehicleType, setVehicleType] = useState("EV Scooter with Battery Swap (Yulu / Bounce)");
  const [dailyHours, setDailyHours] = useState(8);
  const [targetEarning, setTargetEarning] = useState(1400);

  // States
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>({
    summary:
      language === "hinglish"
        ? "Delhi NCR mein 8 ghante Blinkit / Zepto grocery delivery aur Yulu Wynn EV Scooter lene par aapka daily net profit ₹1,040 tak bachega (Mahine ka ₹27,000+)."
        : "Working 8 hours on quick grocery delivery with an EV Scooter in Delhi NCR yields an estimated ₹1,040 daily net profit (₹27,000+ monthly).",
    estimatedDeliveries: 22,
    grossDaily: 1250,
    vehicleRentalDaily: 160,
    fuelOrChargingCost: 50,
    netDailyProfit: 1040,
    monthlyPotential: 27040,
    topPicksExplanation:
      "EV Battery swap eliminates petrol expenses of ₹150/day. High density grocery orders within 2 km reduce fatigue.",
    tips: [
      "Work peak slots (11:30 AM - 3:00 PM and 7:30 PM - 11:30 PM) for 1.4x surge pay.",
      "Take weekly rental pass to save 12% on daily rental cost.",
      "Keep 2 extra swap station locations saved in Zyro live map for instant swaps.",
    ],
    bestJobMatches: [
      "Blinkit 10-Min Quick Grocery Partner",
      "Zomato Peak Dinner Delivery Rider",
      "Zepto Dark Store Express Rider",
    ],
  });

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/ai/advisor"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          preferredJobType: jobCategory,
          preferredVehicle: vehicleType,
          dailyHours,
          targetEarning,
          language: language === "hindi" ? "Hindi" : language === "hinglish" ? "Hinglish (mix of Hindi and English)" : "English",
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error("AI Advisor request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-indigo-500/30 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Earning Planner & Gig Strategist</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          {language === "hinglish"
            ? "Zyro AI Saathi — Earning & Rental Calculator"
            : language === "hindi"
            ? "ज़ायरो एआई साथी — कमाई व वाहन योजना"
            : "Zyro AI Saathi — Earning & Rental Strategist"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          {language === "hinglish"
            ? "Apni city, working hours aur gaadi chunein. Gemini AI aapko exact daily gross pay, rental deduction aur net cash profit calculate karke dega."
            : "Calculate exact net take-home earnings after deducting daily vehicle rental and fuel/charging expenses."}
        </p>
      </div>

      {/* Input Controls Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>Plan Your Earning Shift</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Your City / Hub
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Mumbai MMR">Mumbai MMR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Preferred Job Category
            </label>
            <select
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Quick 10-Min Grocery (Blinkit / Zepto)">Quick Grocery (Blinkit/Zepto)</option>
              <option value="Food Delivery (Zomato / Swiggy)">Food Delivery (Zomato/Swiggy)</option>
              <option value="E-Commerce Packages (Amazon Flex / Delhivery)">Amazon / E-Commerce Flex</option>
              <option value="Logistics & Van (Porter / Goods Courier)">Porter City Logistics</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Vehicle Rental Preference
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="EV Scooter with Battery Swap (Yulu / Bounce)">EV Scooter (Zero Fuel Cost)</option>
              <option value="Petrol Motorcycle (Hero Splendor)">Petrol Bike (65 kmpl)</option>
              <option value="Commercial E-Rickshaw (Mahindra Treo)">E-Rickshaw (High Passenger Fare)</option>
              <option value="Eco Cargo Van (Tata Ace EV)">Eco Cargo Van (Heavy Loads)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Daily Work Hours:
              </label>
              <span className="text-xs font-black text-emerald-600">{dailyHours} hrs</span>
            </div>
            <input
              type="range"
              min={4}
              max={12}
              step={1}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Part-time (4h)</span>
              <span>Full (8h)</span>
              <span>Heavy (12h)</span>
            </div>
          </div>
        </div>

        <button
          id="calculate-ai-plan-btn"
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Gig Economics with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Calculate Daily Profit & AI Strategy</span>
            </>
          )}
        </button>
      </div>

      {/* AI Recommendation Output Card */}
      {recommendation && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <Bot className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">
                AI Recommendation Summary
              </h4>
              <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                {recommendation.summary}
              </p>
              {recommendation.topPicksExplanation && (
                <p className="text-[11px] text-emerald-800 mt-1.5 font-medium">
                  💡 {recommendation.topPicksExplanation}
                </p>
              )}
            </div>
          </div>

          {/* Financial Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Gross Daily Pay
              </div>
              <div className="text-xl font-black text-slate-900 mt-1">
                +₹{recommendation.grossDaily}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                ~{recommendation.estimatedDeliveries} orders
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 text-center">
              <div className="text-[10px] uppercase font-bold text-rose-700">
                Vehicle Rent
              </div>
              <div className="text-xl font-black text-rose-600 mt-1">
                -₹{recommendation.vehicleRentalDaily}
              </div>
              <div className="text-[11px] text-rose-600 mt-0.5">
                Daily plan tariff
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 text-center">
              <div className="text-[10px] uppercase font-bold text-rose-700">
                Fuel / Swap Pass
              </div>
              <div className="text-xl font-black text-rose-600 mt-1">
                -₹{recommendation.fuelOrChargingCost}
              </div>
              <div className="text-[11px] text-rose-600 mt-0.5">
                Zero petrol waste on EV
              </div>
            </div>

            <div className="bg-emerald-950 text-white rounded-2xl p-3.5 text-center shadow-md">
              <div className="text-[10px] uppercase font-bold text-emerald-400">
                Net Profit in Hand
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                ₹{recommendation.netDailyProfit}
              </div>
              <div className="text-[11px] text-amber-300 font-bold mt-0.5">
                ₹{recommendation.monthlyPotential.toLocaleString("en-IN")} / mo
              </div>
            </div>
          </div>

          {/* Actionable Pro Tips */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Zyro Pro Tips to Maximize Earnings:
            </h4>
            <div className="space-y-2">
              {recommendation.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-start gap-2 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 1-Click Activate Recommended Combo */}
          <div className="pt-2">
            <button
              id="ai-quick-combo-btn"
              onClick={() => {
                if (allJobs.length > 0 && allVehicles.length > 0) {
                  onSelectCombo(allJobs[0], allVehicles[0]);
                }
              }}
              disabled={allJobs.length === 0 || allVehicles.length === 0}
              className={`w-full font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg ${
                allJobs.length > 0 && allVehicles.length > 0
                  ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>
                {allJobs.length > 0 && allVehicles.length > 0
                  ? "Instant 1-Click: Book this EV + Start Gig Job"
                  : "No live post available for 1-Click Combo yet"}
              </span>
              {allJobs.length > 0 && allVehicles.length > 0 && (
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
