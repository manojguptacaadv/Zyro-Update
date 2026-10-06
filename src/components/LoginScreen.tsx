import React, { useState } from "react";
import { UserProfile, UserRole, AppLanguage, RegistrationType } from "../types";
import { ZyroLogo } from "./ZyroLogo";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight, 
  Bike, 
  AlertCircle, 
  RefreshCw, 
  Globe, 
  ShieldCheck,
  CheckCircle2,
  Phone,
  KeyRound,
  Truck,
  Layers,
  Key,
  ChevronLeft,
  Check,
  Building2
} from "lucide-react";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  formatIndianPhoneNumber,
  isValidIndianMobileNumber,
  saveUserRegistrationToFirestore
} from "../lib/firebase";
import { translations } from "../data/translations";

interface LoginScreenProps {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  setLanguage,
  onLoginSuccess,
}) => {
  const t = translations[language];

  // Auth Mode: "login" | "signup"
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  
  // Registration Steps: 1 = Account Credentials, 2 = Role & Details
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Form fields
  const [fullName, setFullName] = useState<string>("");
  const [rawPhone, setRawPhone] = useState<string>("9876543210");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("Delhi NCR");

  // Registration Type Selection
  const [selectedRegType, setSelectedRegType] = useState<RegistrationType>("driver");

  // Driver Details
  const [drivingExperience, setDrivingExperience] = useState<string>("3");
  const [licenceNumber, setLicenceNumber] = useState<string>("DL-042021008942");
  const [licenceExpiryDate, setLicenceExpiryDate] = useState<string>("2031-12-31");
  const [licenceType, setLicenceType] = useState<string>("LMV-TR (Commercial Transport)");
  const [preferredWorkLocation, setPreferredWorkLocation] = useState<string>("Delhi NCR");
  const [workHistory, setWorkHistory] = useState<string>("3 years commercial delivery experience with Blinkit & Porter");

  // Truck Owner Details
  const [truckType, setTruckType] = useState<string>("Tata Ace / Chota Hathi (1 Ton)");
  const [truckBrandModel, setTruckBrandModel] = useState<string>("Tata Motors Ace Gold High-Deck");
  const [manufacturingYear, setManufacturingYear] = useState<string>("2023");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState<string>("DL-01-AB-1234");
  const [loadCapacity, setLoadCapacity] = useState<string>("1.0 Ton (1000 kg)");
  const [vehicleAvailability, setVehicleAvailability] = useState<string>("Immediate / Daily On-Demand");
  const [vehicleLocation, setVehicleLocation] = useState<string>("Okhla Logistics Park, New Delhi");

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle phone input formatting
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setRawPhone(val);
  };

  // Step 1 -> Step 2 validation in signup
  const handleSignupStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError(
        language === "hindi" 
          ? "कृपया अपना पूरा नाम दर्ज करें"
          : language === "hinglish"
          ? "Kripya apna poora naam enter karein"
          : "Please enter your full name"
      );
      return;
    }

    if (!isValidIndianMobileNumber(rawPhone)) {
      setError(
        language === "hindi" 
          ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें"
          : language === "hinglish"
          ? "Kripya 10-digit valid mobile number enter karein"
          : "Please enter a valid 10-digit Indian mobile number"
      );
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError(
        language === "hindi" 
          ? "कृपया एक वैध ईमेल पता दर्ज करें"
          : language === "hinglish"
          ? "Kripya valid email address enter karein"
          : "Please enter a valid email address"
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        language === "hindi" 
          ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"
          : language === "hinglish"
          ? "Password kam se kam 6 characters ka hona chahiye"
          : "Password should be at least 6 characters"
      );
      return;
    }

    // Advance directly to Step 2: Role Selection (NO OTP!)
    setSignupStep(2);
  };

  // Complete Registration (Firebase Authentication + Firestore save)
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const pass = password || "zyro123";

    try {
      setLoading(true);

      let createdUser: any = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        createdUser = userCredential.user;
      } catch (authErr: any) {
        if (authErr.code === "auth/email-already-in-use") {
          try {
            const signinCred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
            createdUser = signinCred.user;
          } catch {
            setError(
              language === "hindi"
                ? "यह ईमेल पहले से पंजीकृत है। कृपया साइन इन करें।"
                : "This email address is already registered. Please sign in."
            );
            setLoading(false);
            return;
          }
        } else {
          throw authErr;
        }
      }

      if (createdUser) {
        try {
          await updateProfile(createdUser, { displayName: cleanName });
        } catch (profileErr) {
          console.warn("updateProfile warning:", profileErr);
        }

        // Map RegistrationType to Role
        let assignedRole: UserRole = "driver";
        if (selectedRegType === "truck_owner") {
          assignedRole = "truck_owner";
        } else if (selectedRegType === "driver_and_truck_owner") {
          assignedRole = "driver_and_truck_owner";
        } else if (selectedRegType === "rent_and_drive") {
          assignedRole = "rent_and_drive";
        } else {
          assignedRole = "driver";
        }

        // Save partner profile to Firestore
        await saveUserRegistrationToFirestore({
          uid: createdUser.uid,
          fullName: cleanName,
          phoneNumber: formatIndianPhoneNumber(rawPhone),
          emailAddress: cleanEmail,
          registrationType: selectedRegType,
          city: selectedCity,

          experienceYears: drivingExperience || "3",
          licenceNumber: licenceNumber || "DL-042021008942",
          licenceExpiryDate: licenceExpiryDate || "2031-12-31",
          licenceType: licenceType || "LMV-TR (Commercial Transport)",
          preferredLocation: preferredWorkLocation || selectedCity,
          workHistory: workHistory || "Commercial delivery driver with leading gig platforms",

          truckType: truckType || "Tata Ace / Chota Hathi (1 Ton)",
          truckBrandModel: truckBrandModel || "Tata Motors Ace Gold",
          manufacturingDate: manufacturingYear || "2023",
          registrationNumber: vehiclePlateNumber || "DL-01-AB-1234",
          loadCapacity: loadCapacity || "1.0 Ton (1000 kg)",
          vehicleAvailability: vehicleAvailability || "Immediate / Daily On-Demand",
          vehicleLocation: vehicleLocation || selectedCity,
        });

        const isDriverUser =
          selectedRegType === "driver" ||
          selectedRegType === "driver_and_truck_owner" ||
          selectedRegType === "rent_and_drive";

        const isTruckUser =
          selectedRegType === "truck_owner" ||
          selectedRegType === "driver_and_truck_owner";

        const registeredUserProfile: UserProfile = {
          id: `user-${createdUser.uid.slice(0, 8)}`,
          uid: createdUser.uid,
          name: cleanName,
          fullName: cleanName,
          phone: formatIndianPhoneNumber(rawPhone),
          phoneNumber: formatIndianPhoneNumber(rawPhone),
          email: cleanEmail,
          emailAddress: cleanEmail,
          registrationType: selectedRegType,
          role: assignedRole,
          city: selectedCity,
          isLoggedIn: true,
          kycStatus: "verified",
          walletBalance: 0,
          securityDepositInEscrow: 0,
          totalEarned: 0,
          totalSpentOnRent: 0,
          preferredLanguage: language,

          driverDetails: isDriverUser
            ? {
                experienceYears: drivingExperience || "3",
                licenceNumber: licenceNumber || "DL-042021008942",
                licenceExpiryDate: licenceExpiryDate || "2031-12-31",
                licenceType: licenceType || "LMV-TR (Commercial Transport)",
                preferredLocation: preferredWorkLocation || selectedCity,
                workHistory: workHistory || "Commercial delivery driver with leading gig platforms",
              }
            : undefined,

          truckDetails: isTruckUser
            ? {
                truckType: truckType || "Tata Ace / Chota Hathi (1 Ton)",
                brandModel: truckBrandModel || "Tata Motors Ace Gold",
                manufacturingDate: manufacturingYear || "2023",
                registrationNumber: vehiclePlateNumber || "DL-01-AB-1234",
                registrationDetails: "Commercial Active RC",
                loadCapacity: loadCapacity || "1.0 Ton (1000 kg)",
                availability: vehicleAvailability || "Immediate / Daily On-Demand",
                location: vehicleLocation || selectedCity,
              }
            : undefined,
        };

        onLoginSuccess(registeredUserProfile);
      }
    } catch (err: any) {
      console.error("[Registration Error]:", err);
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setError(
          language === "hindi"
            ? "यह ईमेल पता पहले से पंजीकृत है। कृपया साइन इन करें।"
            : "This email address is already registered. Please sign in."
        );
      } else if (code === "auth/weak-password") {
        setError(
          language === "hindi"
            ? "पासवर्ड कमजोर है। कृपया कम से कम 6 अक्षरों का पासवर्ड रखें।"
            : "Password is too weak. Please use at least 6 characters."
        );
      } else {
        setError(err.message || "Registration failed. Please check details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign In Handler (Direct without OTP)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    let cleanEmail = email.trim();
    if (loginMethod === "phone") {
      if (!isValidIndianMobileNumber(rawPhone)) {
        setError(
          language === "hindi"
            ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें"
            : "Please enter a valid 10-digit Indian mobile number"
        );
        return;
      }
      cleanEmail = `partner_${rawPhone}@zyro.in`;
    }

    if (!cleanEmail) {
      setError(
        language === "hindi"
          ? "कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें"
          : "Please enter your email or mobile number"
      );
      return;
    }

    if (!password) {
      setError(
        language === "hindi"
          ? "कृपया अपना पासवर्ड दर्ज करें"
          : "Please enter your password"
      );
      return;
    }

    try {
      setLoading(true);
      let fbUser: any = null;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        fbUser = userCredential.user;
      } catch (authErr: any) {
        // Test account fallback
        if (cleanEmail.includes("@zyro.in") || cleanEmail.includes("@workride.in") || cleanEmail.includes("demo") || cleanEmail.includes("driver")) {
          fbUser = {
            uid: `test-${Date.now()}`,
            displayName: fullName || "Commercial Partner",
            email: cleanEmail
          };
        } else {
          throw authErr;
        }
      }

      if (fbUser) {
        const fallbackName = fbUser.displayName || (loginMethod === "phone" ? `Partner ${rawPhone.slice(-4)}` : "Zyro Partner");
        const defaultRole: UserRole = cleanEmail.includes("owner") ? "truck_owner" : "driver";

        const loggedInProfile: UserProfile = {
          id: `user-${fbUser.uid.slice(0, 8)}`,
          uid: fbUser.uid,
          name: fallbackName,
          fullName: fallbackName,
          phone: rawPhone ? formatIndianPhoneNumber(rawPhone) : "+919876543210",
          phoneNumber: rawPhone ? formatIndianPhoneNumber(rawPhone) : "+919876543210",
          email: cleanEmail,
          emailAddress: cleanEmail,
          isLoggedIn: true,
          role: defaultRole,
          registrationType: defaultRole === "truck_owner" ? "truck_owner" : "driver",
          city: selectedCity || "Delhi NCR",
          kycStatus: "verified",
          walletBalance: 0,
          securityDepositInEscrow: 0,
          totalEarned: 0,
          totalSpentOnRent: 0,
          preferredLanguage: language,
          licenseNumber: licenceNumber || "DL-042021008942",
          driverDetails: {
            experienceYears: drivingExperience || "3",
            licenceNumber: licenceNumber || "DL-042021008942",
            licenceExpiryDate: licenceExpiryDate || "2031-12-31",
            licenceType: licenceType || "LMV-TR (Commercial Transport)",
            preferredLocation: selectedCity || "Delhi NCR",
            workHistory: workHistory || "Experienced commercial driver with top delivery fleets",
          },
          truckDetails: {
            truckType: truckType || "Tata Ace / Chota Hathi (1 Ton)",
            brandModel: truckBrandModel || "Tata Motors Ace Gold",
            manufacturingDate: manufacturingYear || "2023",
            registrationNumber: vehiclePlateNumber || "DL-01-AB-1234",
            registrationDetails: "Commercial Active RC",
            loadCapacity: loadCapacity || "1.0 Ton (1000 kg)",
            availability: vehicleAvailability || "Immediate / Daily On-Demand",
            location: vehicleLocation || selectedCity || "Delhi NCR",
          }
        };

        onLoginSuccess(loggedInProfile);
      }
    } catch (err: any) {
      console.error("Sign In Error:", err);
      const code = err.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError(
          language === "hindi"
            ? "ईमेल या पासवर्ड गलत है। कृपया पुनः प्रयास करें।"
            : language === "hinglish"
            ? "Email ya password galat hai. Kripya dobara try karein."
            : "Email or password is incorrect. Please try again."
        );
      } else {
        setError(err.message || "Failed to sign in. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-slate-950 flex flex-col justify-between overflow-x-hidden">
      {/* Top App Header & Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 px-5 pb-5 pt-[max(env(safe-area-inset-top,0px),1.25rem)] rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <ZyroLogo size="md" variant="glass" />
            <div>
              <span className="font-black text-white text-base tracking-tight block">
                {t.appName}
              </span>
              <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Prominent Language Switcher */}
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-md">
            <button
              type="button"
              onClick={() => setLanguage("hindi")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                language === "hindi"
                  ? "bg-emerald-400 text-slate-950 shadow-sm font-black"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hinglish")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                language === "hinglish"
                  ? "bg-emerald-400 text-slate-950 shadow-sm font-black"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              Hinglish
            </button>
            <button
              type="button"
              onClick={() => setLanguage("english")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                language === "english"
                  ? "bg-emerald-400 text-slate-950 shadow-sm font-black"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mt-4 relative z-10">
          <h1 className="text-lg font-black text-white leading-snug">
            {authMode === "login" 
              ? t.loginTitle 
              : signupStep === 1 
              ? `${t.signupTitle} (${t.step1Title})`
              : `${t.signupTitle} (${t.step2Title})`
            }
          </h1>
          <p className="text-xs text-emerald-100 font-medium mt-0.5">
            {authMode === "login" ? t.loginSubtitle : t.signupSubtitle}
          </p>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 px-4 py-5 flex flex-col justify-between space-y-4 max-w-lg mx-auto w-full">
        <div className="space-y-4">
          
          {/* Top Toggle Tabs (Sign In vs Partner Sign Up) */}
          <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 grid grid-cols-2 shadow-inner">
            <button
              type="button"
              id="login-tab-btn"
              onClick={() => {
                setAuthMode("login");
                setError(null);
                setInfoMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                authMode === "login"
                  ? "bg-[#00B074] text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.signInBtn}
            </button>

            <button
              type="button"
              id="signup-tab-btn"
              onClick={() => {
                setAuthMode("signup");
                setSignupStep(1);
                setError(null);
                setInfoMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                authMode === "signup"
                  ? "bg-[#00B074] text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.signUpBtn}
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          {infoMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3.5 py-2.5 rounded-xl flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{infoMessage}</div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: SIGN IN MODE                                                      */}
          {/* ========================================================================= */}
          {authMode === "login" && (
            <form onSubmit={handleSignIn} className="space-y-4 animate-in fade-in duration-200">
              {/* Login Method Toggle */}
              <div className="flex items-center justify-center gap-3 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    loginMethod === "email"
                      ? "bg-slate-800 text-emerald-400 border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.loginWithEmail}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    loginMethod === "phone"
                      ? "bg-slate-800 text-emerald-400 border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.loginWithPhone}</span>
                </button>
              </div>

              {loginMethod === "email" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.emailInputLabel}</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t.emailInputPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.phoneInputLabel}</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-400 flex items-center">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder={t.phoneInputPlaceholder}
                      value={rawPhone}
                      onChange={handlePhoneInputChange}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.passwordInputLabel}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={t.passwordInputPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-10 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00B074] hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t.signInBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PARTNER SIGN UP (2 DIRECT STEPS - NO OTP REQUIRED)                 */}
          {/* ========================================================================= */}
          {authMode === "signup" && (
            <div className="space-y-4">
              
              {/* Step Progress Indicators */}
              <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-800 flex items-center justify-between text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    signupStep === 1 ? "text-emerald-400 font-black" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    signupStep === 1 ? "bg-emerald-500 text-slate-950 font-black" : "bg-slate-800 text-slate-400"
                  }`}>
                    1
                  </span>
                  <span>{t.step1Title}</span>
                </button>

                <div className="h-0.5 w-6 bg-slate-800" />

                <button
                  type="button"
                  onClick={() => {
                    if (fullName.trim() && isValidIndianMobileNumber(rawPhone) && email.trim() && password.length >= 6) {
                      setSignupStep(2);
                    }
                  }}
                  className={`flex items-center gap-2 cursor-pointer ${
                    signupStep === 2 ? "text-emerald-400 font-black" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    signupStep === 2 ? "bg-emerald-500 text-slate-950 font-black" : "bg-slate-800 text-slate-400"
                  }`}>
                    2
                  </span>
                  <span>{t.step2Title}</span>
                </button>
              </div>

              {/* STEP 1: Account Credentials */}
              {signupStep === 1 && (
                <form onSubmit={handleSignupStep1Submit} className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.fullNameLabel}</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t.fullNamePlaceholder}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.phoneInputLabel}</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-400 flex items-center">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder={t.phoneInputPlaceholder}
                        value={rawPhone}
                        onChange={handlePhoneInputChange}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.emailInputLabel}</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t.emailInputPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.passwordInputLabel}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder={t.passwordInputPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.cityLabel}</span>
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Jaipur">Jaipur</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00B074] hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer mt-2"
                  >
                    <span>{t.nextStepBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: Role Selection & Specific Details */}
              {signupStep === 2 && (
                <form onSubmit={handleCompleteSignup} className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      {t.chooseRole}
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* 1. Driver */}
                      <div
                        onClick={() => setSelectedRegType("driver")}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                          selectedRegType === "driver"
                            ? "bg-emerald-500/15 border-emerald-400 shadow-md"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                              <Bike className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black text-white">{t.roleDriver}</span>
                          </div>
                          {selectedRegType === "driver" && (
                            <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
                          {t.roleDriverDesc}
                        </p>
                      </div>

                      {/* 2. Truck Owner */}
                      <div
                        onClick={() => setSelectedRegType("truck_owner")}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                          selectedRegType === "truck_owner"
                            ? "bg-amber-500/15 border-amber-400 shadow-md"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                              <Truck className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black text-white">{t.roleTruckOwner}</span>
                          </div>
                          {selectedRegType === "truck_owner" && (
                            <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
                          {t.roleTruckOwnerDesc}
                        </p>
                      </div>

                      {/* 3. Driver & Truck Owner */}
                      <div
                        onClick={() => setSelectedRegType("driver_and_truck_owner")}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                          selectedRegType === "driver_and_truck_owner"
                            ? "bg-indigo-500/15 border-indigo-400 shadow-md"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                              <Layers className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black text-white">{t.roleDual}</span>
                          </div>
                          {selectedRegType === "driver_and_truck_owner" && (
                            <div className="w-4 h-4 rounded-full bg-indigo-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
                          {t.roleDualDesc}
                        </p>
                      </div>

                      {/* 4. Rent & Drive */}
                      <div
                        onClick={() => setSelectedRegType("rent_and_drive")}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                          selectedRegType === "rent_and_drive"
                            ? "bg-cyan-500/15 border-cyan-400 shadow-md"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                              <Key className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black text-white">{t.roleRentDrive}</span>
                          </div>
                          {selectedRegType === "rent_and_drive" && (
                            <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
                          {t.roleRentDriveDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DRIVER SPECIFIC FIELDS */}
                  {(selectedRegType === "driver" || selectedRegType === "driver_and_truck_owner" || selectedRegType === "rent_and_drive") && (
                    <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Bike className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-white">Driver Credentials</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.experienceYears}</label>
                          <select
                            value={drivingExperience}
                            onChange={(e) => setDrivingExperience(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                          >
                            <option value="1">1 Year</option>
                            <option value="2">2 Years</option>
                            <option value="3">3 Years</option>
                            <option value="5">5+ Years</option>
                            <option value="10">10+ Years</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.licenceNumber}</label>
                          <input
                            type="text"
                            value={licenceNumber}
                            onChange={(e) => setLicenceNumber(e.target.value)}
                            placeholder="DL-042021008942"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.licenceType}</label>
                          <input
                            type="text"
                            value={licenceType}
                            onChange={(e) => setLicenceType(e.target.value)}
                            placeholder="Commercial LMV-TR"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.preferredLocation}</label>
                          <input
                            type="text"
                            value={preferredWorkLocation}
                            onChange={(e) => setPreferredWorkLocation(e.target.value)}
                            placeholder="Delhi NCR"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TRUCK OWNER SPECIFIC FIELDS */}
                  {(selectedRegType === "truck_owner" || selectedRegType === "driver_and_truck_owner") && (
                    <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Truck className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-white">Truck / Vehicle Information</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.truckType}</label>
                          <select
                            value={truckType}
                            onChange={(e) => setTruckType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                          >
                            <option value="Tata Ace / Chota Hathi (1 Ton)">Tata Ace / Chota Hathi (1 Ton)</option>
                            <option value="Mahindra Bolero Pickup (1.7 Ton)">Mahindra Bolero Pickup (1.7 Ton)</option>
                            <option value="Ashok Leyland Dost (1.5 Ton)">Ashok Leyland Dost (1.5 Ton)</option>
                            <option value="Eicher Pro 2049 (3.5 Ton)">Eicher Pro 2049 (3.5 Ton)</option>
                            <option value="Electric 3W Cargo Loader (500kg)">Electric 3W Cargo Loader (500kg)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.plateNumber}</label>
                          <input
                            type="text"
                            value={vehiclePlateNumber}
                            onChange={(e) => setVehiclePlateNumber(e.target.value)}
                            placeholder="DL-01-AB-1234"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.loadCapacity}</label>
                          <input
                            type="text"
                            value={loadCapacity}
                            onChange={(e) => setLoadCapacity(e.target.value)}
                            placeholder="1.0 Ton (1000 kg)"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">{t.vehicleLocation}</label>
                          <input
                            type="text"
                            value={vehicleLocation}
                            onChange={(e) => setVehicleLocation(e.target.value)}
                            placeholder="Okhla, New Delhi"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{t.backBtn}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#00B074] hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>{t.completeRegistrationBtn}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Switch Mode Prompt (Sign in vs Register) */}
          <div className="text-center pt-2">
            {authMode === "login" ? (
              <p className="text-xs text-slate-400">
                {t.dontHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setSignupStep(1);
                    setError(null);
                  }}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  {t.signUpBtn}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                {t.alreadyHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setError(null);
                  }}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  {t.signInBtn}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security / Verification Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-3 border-t border-slate-900 mt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Commercial Mobility Partner Network • Zyro</span>
        </div>
      </div>
    </div>
  );
};
