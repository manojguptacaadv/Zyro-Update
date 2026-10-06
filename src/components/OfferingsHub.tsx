import React from "react";
import { 
  Bike, 
  Truck, 
  Car,
  Key, 
  CreditCard, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  TrendingUp,
  Award,
  ChevronRight,
  Gauge,
  Briefcase,
  Globe,
  LogOut,
  UserCheck
} from "lucide-react";
import { OfferingKey, AppLanguage } from "../types";

interface OfferingsHubProps {
  onSelectOffering: (offering: OfferingKey) => void;
  language?: AppLanguage;
  userName?: string;
  onLogout?: () => void;
  onLanguageToggle?: () => void;
}

export const OfferingsHub: React.FC<OfferingsHubProps> = ({
  onSelectOffering,
  language = "hinglish",
  userName = "Partner",
  onLogout,
  onLanguageToggle,
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start font-sans antialiased overflow-x-hidden">
      {/* Mobile Android Container */}
      <div className="w-full sm:max-w-[440px] min-h-screen flex flex-col bg-slate-900 sm:border-x sm:border-slate-800/80 shadow-2xl pb-16 touch-scroll overflow-y-auto overflow-x-hidden">
        
        {/* Top Emerald Header */}
        <div className="bg-[#00B074] text-white px-5 pt-[max(env(safe-area-inset-top,0px),1.25rem)] pb-6 rounded-b-[28px] shadow-lg relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar with User greeting & controls */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-[#00B074] flex items-center justify-center font-black shadow-md">
                <Zap className="w-5 h-5 fill-[#00B074]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  Zy<span className="text-slate-950">ro</span>
                </span>
                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">
                  EV & Gig Mobility Network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onLanguageToggle && (
                <button
                  type="button"
                  onClick={onLanguageToggle}
                  className="bg-black/20 hover:bg-black/30 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 transition-all cursor-pointer"
                >
                  <Globe className="w-3 h-3" />
                  <span>{language === "hinglish" ? "Hinglish" : language === "hindi" ? "हिंदी" : "EN"}</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  id="offerings-top-logout-btn"
                  onClick={onLogout}
                  title="Logout and return to sign in"
                  className="bg-black/25 hover:bg-rose-600/80 text-rose-100 hover:text-white px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Headline */}
          <div className="mt-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-100 mb-1">
              <UserCheck className="w-3 h-3 text-emerald-300" />
              <span>Welcome, {userName}!</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
              {language === "hindi" ? "अपनी सर्विस चुनें" : "Select Our Offerings"}
            </h1>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">
              {language === "hindi" 
                ? "आगे बढ़ने और ऐप अनलॉक करने के लिए कोई भी प्लान चुनें" 
                : "Choose any offering below to unlock your full Zyro experience"}
            </p>
          </div>
        </div>

        {/* Live Hubs Subtitle Banner */}
        <div className="flex items-center justify-between px-5 pt-3.5 pb-1 text-xs">
          <span className="font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Rent & Drive Solutions</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Delhi NCR Live Hubs</span>
          </span>
        </div>

        {/* 4 PRIMARY OFFERING CARDS (RENT & DRIVE) */}
        <div className="px-4 py-2 space-y-3">
          
          {/* 1. CARD: Rent 2 Wheeler */}
          <div
            id="offering-rent-2w"
            onClick={() => onSelectOffering("rent_2w")}
            className="group relative bg-[#F7FBF6] hover:bg-white text-slate-900 rounded-2xl p-4 border border-emerald-200/80 shadow-md active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-manipulation"
          >
            <div className="absolute right-2 -bottom-2 w-28 h-28 pointer-events-none opacity-15 group-hover:opacity-25 transition-opacity flex items-center justify-center">
              <Gauge className="w-full h-full text-emerald-700" />
            </div>

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="relative shrink-0 w-22 h-22 rounded-2xl bg-emerald-100/50 flex items-center justify-center p-1 border border-emerald-200">
                <div className="absolute -top-1 left-1 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[8px] font-black shadow-sm flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  <span>HI-SPEED</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop&q=80"
                  alt="Rent 2 Wheeler EV Scooter"
                  className="w-full h-full object-cover rounded-xl drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  Lowest Rent • ₹149/day
                </span>
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  Rent 2 Wheeler
                </h2>
                <p className="text-xs font-bold text-emerald-700 leading-tight">
                  Hi-Speed EV Scooters at Lowest Daily/Monthly Rent
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-1 text-[10px] text-slate-700 font-semibold">
                  <span className="inline-flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span>1-Min Swap</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span>Zero Maint.</span>
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 2. CARD: Rent 3 Wheeler */}
          <div
            id="offering-rent-3w"
            onClick={() => onSelectOffering("rent_3w_loader")}
            className="group relative bg-gradient-to-r from-[#00B074] to-[#009660] text-white rounded-2xl p-4 shadow-lg active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-manipulation"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="relative shrink-0 w-22 h-22 rounded-2xl bg-black/20 flex items-center justify-center p-1 border border-white/20">
                <div className="absolute -top-1 right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md animate-bounce">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80"
                  alt="Rent 3 Wheeler Cargo Loader"
                  className="w-full h-full object-cover rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="text-[9px] font-black text-slate-950 bg-amber-300 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  688kg - 1 Ton Cargo
                </span>
                <h2 className="text-base font-black text-white leading-tight">
                  Rent 3 Wheeler
                </h2>
                <p className="text-xs font-bold text-emerald-100 leading-tight">
                  Cargo Loaders & E-Rickshaws for Max Earnings
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-1 text-[10px] text-emerald-100 font-semibold">
                  <span className="inline-flex items-center gap-0.5 bg-black/25 px-1.5 py-0.5 rounded border border-white/15">
                    <Truck className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span>Heavy Duty</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 bg-black/25 px-1.5 py-0.5 rounded border border-white/15">
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span>Blinkit / Zepto</span>
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-emerald-200 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3. CARD: Rent 4 Wheeler */}
          <div
            id="offering-rent-4w"
            onClick={() => onSelectOffering("rent_4w_car")}
            className="group relative bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-4 border border-cyan-500/40 shadow-lg active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-manipulation"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="relative shrink-0 w-22 h-22 rounded-2xl bg-cyan-950/60 flex items-center justify-center p-1 border border-cyan-500/30">
                <div className="absolute -top-1 left-1 bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded-full text-[8px] font-black shadow-md flex items-center gap-0.5">
                  <Car className="w-2.5 h-2.5" />
                  <span>COMMERCIAL</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80"
                  alt="Rent 4 Wheeler Commercial EV"
                  className="w-full h-full object-cover rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="text-[9px] font-black text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase tracking-wider inline-block">
                  Taxi & Large Cargo Van
                </span>
                <h2 className="text-base font-black text-white leading-tight">
                  Rent 4 Wheeler
                </h2>
                <p className="text-xs font-bold text-cyan-300 leading-tight">
                  Tata Ace EV, Delivery Vans & Commercial Cabs
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-1 text-[10px] text-slate-300 font-semibold">
                  <span className="inline-flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded border border-slate-700">
                    <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span>Uber / Ola</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded border border-slate-700">
                    <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span>1-Ton Van</span>
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-cyan-300 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 4. CARD: Gig Jobs */}
          <div
            id="offering-gig-jobs"
            onClick={() => onSelectOffering("gig_jobs")}
            className="group relative bg-gradient-to-r from-[#4C1D95] to-[#6D28D9] text-white rounded-2xl p-4 shadow-lg active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-manipulation"
          >
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="relative shrink-0 w-22 h-22 rounded-2xl bg-black/20 flex items-center justify-center p-1 border border-purple-400/30">
                <div className="absolute -top-1 left-1 bg-amber-300 text-slate-950 px-1.5 py-0.5 rounded-full text-[8px] font-black shadow-md flex items-center gap-0.5">
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>JOBS</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=300&auto=format&fit=crop&q=80"
                  alt="Gig Jobs"
                  className="w-full h-full object-cover rounded-xl drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="text-[9px] font-black text-purple-200 bg-purple-900/80 px-2 py-0.5 rounded border border-purple-400/40 uppercase tracking-wider inline-block">
                  Daily Payouts • 100+ Openings
                </span>
                <h2 className="text-base font-black text-white leading-tight">
                  Gig Jobs
                </h2>
                <p className="text-xs font-bold text-amber-300 leading-tight">
                  Blinkit, Zomato, Porter, Rapido & Zepto Delivery Shifts
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-1 text-[10px] text-purple-100 font-semibold">
                  <span className="inline-flex items-center gap-0.5 bg-black/25 px-1.5 py-0.5 rounded border border-white/15">
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span>Instant Joining</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 bg-black/25 px-1.5 py-0.5 rounded border border-white/15">
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span>Daily Payouts</span>
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-purple-200 group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Secondary Extras: Rent To Own & BYOB */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div
              id="offering-rent-to-own"
              onClick={() => onSelectOffering("rent_to_own")}
              className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer flex items-center gap-2 transition-all active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Key className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-black text-white leading-tight truncate">Rent To Own</div>
                <div className="text-[9px] text-slate-400 truncate">12-Mo Ownership</div>
              </div>
            </div>

            <div
              id="offering-byob"
              onClick={() => onSelectOffering("bring_own_bike")}
              className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/80 cursor-pointer flex items-center gap-2 transition-all active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-black text-white leading-tight truncate">Own Bike / BYOB</div>
                <div className="text-[9px] text-slate-400 truncate">Earn Extra Bonus</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Logout Action */}
        {onLogout && (
          <div className="px-5 pt-4">
            <button
              type="button"
              id="offerings-bottom-logout-btn"
              onClick={onLogout}
              className="w-full bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{language === "hindi" ? "लॉगआउट करें (वापस साइन-इन स्क्रीन जाएं)" : "Logout & Return to Sign In"}</span>
            </button>
          </div>
        )}

        {/* Security Trust Note */}
        <div className="px-5 pt-3 pb-2 text-center text-[10px] text-slate-500 font-medium">
          🔒 Certified 100% Escrow Protected • Instant Swap & Fast Pickup Hubs Across NCR
        </div>

      </div>
    </div>
  );
};
