import React, { useState } from "react";
import { Job, JobCategory, Vehicle, AppLanguage } from "../types";
import { translations } from "../data/translations";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Users, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Bike, 
  Truck, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Award
} from "lucide-react";

interface JobMarketplaceProps {
  jobs: Job[];
  vehicles: Vehicle[];
  language: AppLanguage;
  onApplyJob: (job: Job) => void;
  onSelectComboForJob: (job: Job) => void;
}

export const JobMarketplace: React.FC<JobMarketplaceProps> = ({
  jobs,
  vehicles,
  language,
  onApplyJob,
  onSelectComboForJob,
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPayout, setSelectedPayout] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory !== "all" && job.category !== selectedCategory) return false;
    if (selectedPayout !== "all" && job.payoutType !== selectedPayout) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchArea = job.area.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchArea) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner / Value Proposition */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 fill-amber-300" />
              <span>Instant Hiring • Daily Payouts • No Vehicle? No Problem!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === "hinglish"
                ? "Daily Gig Jobs & Delivery Opportunities"
                : language === "hindi"
                ? "दैनिक गिग नौकरियां व डिलीवरी अवसर"
                : "Daily Gig Work & Delivery Job Opportunities"}
            </h2>
            <p className="text-sm text-slate-300">
              {language === "hinglish"
                ? "Zomato, Blinkit, Zepto, Amazon Flex, Porter aur Delhivery mein kaam karein. Agar gaadi nahi hai, to Zyro se gaadi rent karke turant join karein!"
                : language === "hindi"
                ? "ज़ोमैटो, ब्लिंकिट, अमेज़न, पोर्टर और डेल्हीवरी में काम करें। वाहन नहीं है तो ज़ायरो से तुरंत किराए पर लें।"
                : "Start working for top delivery and logistics brands today. Bundle with a Zyro rental vehicle if you don't have one."}
            </p>
          </div>

          {/* Earning Guarantee Badge */}
          <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl space-y-1 shrink-0 text-left">
            <div className="text-xs text-slate-400 font-medium">Potential Earnings:</div>
            <div className="text-xl font-black text-emerald-400">₹800 - ₹2,500 / Day</div>
            <div className="text-[11px] text-slate-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Bank / UPI Transfer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="job-search-input"
              type="text"
              placeholder={
                language === "hinglish"
                  ? "Search job (Blinkit, Zomato, Porter, Amazon, Grocery, Courier)..."
                  : "Search jobs by company, role or area..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              id="payout-type-filter"
              value={selectedPayout}
              onChange={(e) => setSelectedPayout(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Payout Models</option>
              <option value="per_order">Per Delivery Order (₹45-₹80)</option>
              <option value="daily">Daily Guarantee (₹900-₹1800)</option>
              <option value="monthly">Monthly Fixed Salary (₹20,000+)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer transition-all ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories ({jobs.length})
          </button>
          <button
            onClick={() => setSelectedCategory("grocery_delivery")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedCategory === "grocery_delivery"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            10-Min Quick Grocery
          </button>
          <button
            onClick={() => setSelectedCategory("food_delivery")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedCategory === "food_delivery"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>🍔 Food Delivery</span>
          </button>
          <button
            onClick={() => setSelectedCategory("ecommerce")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedCategory === "ecommerce"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            E-Commerce & Logistics
          </button>
          <button
            onClick={() => setSelectedCategory("ride_hailing")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedCategory === "ride_hailing"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <span>🛺 E-Rickshaw & Metro Shuttle</span>
          </button>
          <button
            onClick={() => setSelectedCategory("courier")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedCategory === "courier"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>📦 Courier & Parcel</span>
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => {
          return (
            <div
              key={job.id}
              id={`job-card-${job.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 relative"
            >
              <div>
                {/* Header: Company & Vacancies */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-inner shrink-0 overflow-hidden">
                      {job.companyLogo && job.companyLogo.startsWith("http") ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {job.company}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  {/* Vacancy Badge */}
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{job.vacancies} Openings</span>
                  </div>
                </div>

                {/* Payout & Earnings Highlight */}
                <div className="mt-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Earning Payout:
                    </div>
                    <div className="text-base font-extrabold text-emerald-950">
                      {job.payoutLabel}
                    </div>
                  </div>
                  {job.joiningBonus && (
                    <div className="text-right">
                      <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded shadow-sm">
                        +₹{job.joiningBonus} Joining Bonus
                      </span>
                    </div>
                  )}
                </div>

                {/* Location & Shift Details */}
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700">{job.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {job.shiftTiming} • <span className="font-semibold">{job.hoursPerDay} hrs/day</span>
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                  {job.description}
                </p>

                {/* Perks Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.perks.slice(0, 2).map((perk, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {perk}
                    </span>
                  ))}
                </div>

                {/* Vehicle Requirement Note */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Bike className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recommended Vehicle:</span>
                  </div>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {job.recommendedVehicleTypes.includes("electric_scooter") ? "EV Scooter / Bike" : "Van / Bike"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Flagship Combo Button: "Don't have vehicle? Rent + Work in 1-Click" */}
                <button
                  id={`job-combo-btn-${job.id}`}
                  onClick={() => onSelectComboForJob(job)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {language === "hinglish"
                      ? "Gaadi nahi hai? Job + Gaadi Rent karein (1-Click)"
                      : language === "hindi"
                      ? "वाहन नहीं है? नौकरी + वाहन किराया एक साथ लें"
                      : "No Vehicle? Bundle Job + Rent Vehicle (1-Click)"}
                  </span>
                </button>

                {/* Regular Apply Button (if user already has vehicle or rental) */}
                <button
                  id={`job-apply-btn-${job.id}`}
                  onClick={() => onApplyJob(job)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {language === "hinglish"
                      ? "Mere paas gaadi hai (Direct Apply)"
                      : "I have a vehicle (Direct Apply)"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-14 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">
              {jobs.length === 0
                ? language === "hinglish"
                  ? "Abhi koi Job Post published nahi hai"
                  : language === "hindi"
                  ? "अभी कोई जॉब पोस्ट उपलब्ध नहीं है"
                  : "No Gig Jobs Posted Yet"
                : "No jobs match your filter"}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {jobs.length === 0
                ? language === "hinglish"
                  ? "Employers 'Employer Mode' mein ja kar delivery, courier aur logistics jobs post kar sakte hain."
                  : language === "hindi"
                  ? "नियोक्ता 'एंप्लॉयर मोड' में जाकर डिलीवरी और लॉजिस्टिक्स नौकरियां जोड़ सकते हैं।"
                  : "Employers can post quick commerce, food delivery, and courier jobs in the Employer Portal."
                : "Try adjusting your search query or payout filter."}
            </p>
          </div>
          {jobs.length > 0 ? (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedPayout("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
