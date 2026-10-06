import React, { useState } from "react";
import { UserProfile, UserRole, AppLanguage } from "../types";
import { ZyroLogo } from "./ZyroLogo";
import { 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  User, 
  ArrowRight, 
  Bike, 
  AlertCircle,
  RefreshCw,
  Crown,
  KeyRound,
  LogIn
} from "lucide-react";
import { 
  formatIndianPhoneNumber,
  isValidIndianMobileNumber,
} from "../lib/firebase";
import { translations } from "../data/translations";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onLoginSuccess,
}) => {
  const t = translations[language];
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState<string>("9876543210");
  const [password, setPassword] = useState<string>("zyro123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Sign up fields
  const [fullName, setFullName] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("gig_worker");
  const [selectedCity, setSelectedCity] = useState<string>("Delhi NCR");
  const [licenseNumber, setLicenseNumber] = useState<string>("DL-042021008942");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanDigits = phone.replace(/\D/g, "").slice(0, 10);
    if (!isValidIndianMobileNumber(cleanDigits)) {
      setError(
        language === "hindi"
          ? "कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें"
          : "Please enter a valid 10-digit Indian mobile number"
      );
      return;
    }

    if (authMode === "signup" && !fullName.trim()) {
      setError(
        language === "hindi"
          ? "कृपया अपना पूरा नाम दर्ज करें"
          : "Please enter your full name"
      );
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = formatIndianPhoneNumber(cleanDigits);
      const userName = authMode === "signup" && fullName.trim() ? fullName.trim() : `Partner ${cleanDigits.slice(-4)}`;
      
      const userProfile: UserProfile = {
        id: `user-${cleanDigits}`,
        uid: `uid-${cleanDigits}`,
        name: userName,
        fullName: userName,
        phone: formattedPhone,
        phoneNumber: formattedPhone,
        email: `partner_${cleanDigits}@zyro.in`,
        emailAddress: `partner_${cleanDigits}@zyro.in`,
        role: selectedRole,
        registrationType: selectedRole === "owner_admin" ? "truck_owner" : "driver",
        city: selectedCity,
        isLoggedIn: true,
        kycStatus: "verified",
        walletBalance: selectedRole === "owner_admin" ? 45000 : 2500,
        securityDepositInEscrow: 500,
        totalEarned: selectedRole === "owner_admin" ? 128000 : 18500,
        totalSpentOnRent: 3200,
        preferredLanguage: language,
        licenseNumber: licenseNumber || "DL-042021008942",
        driverDetails: {
          experienceYears: "3",
          licenceNumber: licenseNumber || "DL-042021008942",
          licenceExpiryDate: "2031-12-31",
          licenceType: "LMV-TR (Commercial Transport)",
          preferredLocation: selectedCity,
          workHistory: "Experienced commercial logistics driver",
        },
      };

      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <ZyroLogo size="sm" variant="glass" />
            <span className="font-bold text-xs uppercase tracking-widest text-emerald-100">
              Zyro Mobility
            </span>
          </div>
          
          <h2 className="text-xl font-black text-white">
            {authMode === "login" ? t.signInBtn : t.signUpBtn}
          </h2>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            {authMode === "login" ? t.loginSubtitle : t.signupSubtitle}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "login"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.signInBtn}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "signup"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.signUpBtn}
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.fullNameLabel}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.fullNamePlaceholder}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}

            {/* Mobile Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.phoneInputLabel}</span>
              </label>
              <div className="flex gap-2">
                <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-400 flex items-center">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder={t.phoneInputPlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.passwordInputLabel}</span>
              </label>
              <input
                type="password"
                required
                placeholder={t.passwordInputPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Sign up extra role selection */}
            {authMode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {t.chooseRole}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("gig_worker")}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedRole === "gig_worker"
                          ? "bg-emerald-500/20 border-emerald-500 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Bike className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.roleDriver}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t.roleDriverDesc}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("owner_admin")}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedRole === "owner_admin"
                          ? "bg-amber-500/20 border-amber-500 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.roleTruckOwner}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t.roleTruckOwnerDesc}
                      </p>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {t.cityLabel}
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-[#00B074] hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{authMode === "login" ? t.signInBtn : t.completeRegistrationBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Verified Commercial Partner Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
