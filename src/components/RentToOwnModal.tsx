import React, { useState } from "react";
import { 
  X, 
  Key, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Award, 
  TrendingUp, 
  Calendar, 
  FileText,
  Clock,
  Phone,
  User,
  ArrowRight
} from "lucide-react";
import { RentToOwnModel, UserProfile } from "../types";
import { INITIAL_RENT_TO_OWN_MODELS } from "../data/mockData";

interface RentToOwnModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSuccessApplication: (modelName: string, emi: number) => void;
}

export const RentToOwnModal: React.FC<RentToOwnModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccessApplication,
}) => {
  const [models] = useState<RentToOwnModel[]>(INITIAL_RENT_TO_OWN_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || "");
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form fields
  const [applicantName, setApplicantName] = useState(user.name || "Manoj Kumar");
  const [applicantPhone, setApplicantPhone] = useState(user.phone || "+91 98765 43210");
  const [aadhaarNumber, setAadhaarNumber] = useState(user.aadhaarNumber || "XXXX-XXXX-7812");
  const [deliveryWorkPlatform, setDeliveryWorkPlatform] = useState("Blinkit & Zomato");

  if (!isOpen) return null;

  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Dynamic EMI Calculation based on tenure
  const tenureMultiplier = tenureMonths === 6 ? 1.85 : tenureMonths === 18 ? 0.75 : 1.0;
  const calculatedDailyEMI = Math.round(currentModel.dailyEMI * tenureMultiplier);
  const calculatedMonthlyEMI = Math.round(currentModel.monthlyEMI * tenureMultiplier);
  const totalFuelSavedYearly = currentModel.monthlyFuelSavings * 12;

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccessApplication(currentModel.name, calculatedDailyEMI);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-5 sm:p-6 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Key className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  12-Month Ownership Plan
                </span>
                <span className="text-xs text-blue-200">Zero Down Payment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Rent To Own & Buy Vehicle
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">
                Financing Pre-Approved! 🎉
              </h3>
              <p className="text-sm text-slate-300">
                Aapka <span className="font-bold text-amber-300">{currentModel.name}</span> ke liye Rent-To-Own token confirm ho gaya hai.
              </p>
              <div className="bg-slate-800 rounded-2xl p-4 text-xs space-y-2 border border-slate-700 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Micro-EMI:</span>
                  <span className="font-bold text-emerald-400">₹{calculatedDailyEMI} / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenure:</span>
                  <span className="font-bold text-white">{tenureMonths} Months (100% RC Transfer)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hub Pickup Location:</span>
                  <span className="font-bold text-cyan-300">Central Delhi EV Mega Hub</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Application ID:</span>
                  <span className="font-mono text-amber-300 font-bold">RTO-2026-DL-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Humare executive aapke phone number <span className="font-semibold text-white">{applicantPhone}</span> par 30 minutes mein KYC verification ke liye call karenge.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl cursor-pointer"
              >
                Close & View Active Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Model Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Select Commercial Vehicle Model</span>
                  <span className="text-amber-400 font-semibold">{models.length} Models Available</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {models.map((model) => {
                    const isSelected = model.id === selectedModelId;
                    return (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative ${
                          isSelected
                            ? "bg-blue-950/70 border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50"
                            : "bg-slate-800/80 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <img
                          src={model.imageUrl}
                          alt={model.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="truncate flex-1 space-y-0.5">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                            {model.brand}
                          </span>
                          <h4 className="font-bold text-sm text-white truncate">{model.name}</h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-extrabold text-amber-300">
                              ₹{model.dailyEMI}/day
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({model.rangeKm} km Range)
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Tenure Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>2. Choose Ownership Lease Tenure</span>
                  <span className="text-cyan-400 font-semibold">{tenureMonths} Months Tenure</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {[6, 12, 18].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setTenureMonths(months)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        tenureMonths === months
                          ? "bg-blue-600 text-white border-blue-400 font-black shadow-md"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      <div className="text-sm font-black">{months} Months</div>
                      <div className="text-[11px] opacity-80">
                        {months === 12 ? "⭐ Recommended" : months === 6 ? "Fast Own" : "Lowest EMI"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div>
                    <h4 className="font-extrabold text-base text-white">{currentModel.name}</h4>
                    <span className="text-xs text-slate-400">100% Commercial RTO Registration & RC Ownership Transfer</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Market Price:</span>
                    <div className="text-sm font-mono line-through text-slate-500">₹{currentModel.marketPrice.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Down Payment</span>
                    <div className="text-sm font-black text-cyan-400">₹{currentModel.downPayment}</div>
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Daily Micro-EMI</span>
                    <div className="text-base font-black text-amber-300">₹{calculatedDailyEMI}/day</div>
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Monthly EMI</span>
                    <div className="text-sm font-black text-white">₹{calculatedMonthlyEMI}/mo</div>
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Est. Fuel Bachat</span>
                    <div className="text-sm font-black text-emerald-400">+₹{currentModel.monthlyFuelSavings}/mo</div>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-1.5 pt-2 text-xs">
                  {currentModel.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Instant Financing Pre-Approval Form */}
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>3. Instant Paperless Approval Form</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Full Legal Name</label>
                    <div className="relative mt-1">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Manoj Kumar"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Mobile Number (Aadhaar Linked)</label>
                    <div className="relative mt-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Aadhaar Card Number / Last 4 Digits</label>
                    <div className="relative mt-1">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="XXXX-XXXX-7812"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Current Gig Delivery Work</label>
                    <select
                      value={deliveryWorkPlatform}
                      onChange={(e) => setDeliveryWorkPlatform(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                    >
                      <option value="Blinkit & Zomato">Blinkit & Zomato Rider</option>
                      <option value="Zepto & Swiggy">Zepto & Swiggy Instamart</option>
                      <option value="Amazon & Flipkart">Amazon Flex / Flipkart Logistics</option>
                      <option value="Porter 3W Cargo">Porter / Heavy Logistics Cargo</option>
                      <option value="New Rider">New Rider (Joining First Time)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying CIBIL & Generating Approval...</span>
                  ) : (
                    <>
                      <span>Apply for Rent-To-Own (₹{calculatedDailyEMI}/day)</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
