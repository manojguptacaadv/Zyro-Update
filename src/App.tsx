/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Vehicle, 
  Job, 
  RentalBooking, 
  JobApplication, 
  GPSStation, 
  UserProfile, 
  UserRole, 
  AppLanguage,
  OfferingKey,
  RiderBazaarItem
} from "./types";
import { 
  INITIAL_VEHICLES, 
  INITIAL_JOBS, 
  INITIAL_GPS_STATIONS, 
  INITIAL_USER 
} from "./data/mockData";
import { translations } from "./data/translations";
import { Header } from "./components/Header";
import { VehicleCatalog } from "./components/VehicleCatalog";
import { JobMarketplace } from "./components/JobMarketplace";
import { ComboFlowModal } from "./components/ComboFlowModal";
import { BookingModal } from "./components/BookingModal";
import { ActiveRideAndGPS } from "./components/ActiveRideAndGPS";
import { OwnerPortal } from "./components/OwnerPortal";
import { AIAdvisor } from "./components/AIAdvisor";
import { WalletModal } from "./components/WalletModal";
import { AuthModal } from "./components/AuthModal";
import { LoginScreen } from "./components/LoginScreen";
import { ProfileModal } from "./components/ProfileModal";
import { OfferingsHub } from "./components/OfferingsHub";
import { DriverDashboard } from "./components/DriverDashboard";
import { TruckOwnerDashboard } from "./components/TruckOwnerDashboard";
import { RentToOwnModal } from "./components/RentToOwnModal";
import { BringYourOwnBikeModal } from "./components/BringYourOwnBikeModal";
import { RiderBazaarModal } from "./components/RiderBazaarModal";
import { AndroidStatusBar } from "./components/AndroidStatusBar";
import { AndroidBottomNav, NavTabType } from "./components/AndroidBottomNav";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { auth, onAuthStateChanged, syncUserProfile, logOutUser, getUserProfileFromFirestore } from "./lib/firebase";

import { 
  Zap, 
  Bike, 
  Car,
  Briefcase, 
  Navigation, 
  Sparkles, 
  Key, 
  Building2, 
  Wallet, 
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Clock,
  Layers,
  ShoppingBag,
  Truck
} from "lucide-react";

export default function App() {
  // State initialized with 10 diverse commercial vehicles & gig jobs
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem("zyro_vehicles_v4") || localStorage.getItem("workride_vehicles_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_VEHICLES;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("zyro_jobs_v4") || localStorage.getItem("workride_jobs_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_JOBS;
  });

  const [stations] = useState<GPSStation[]>(INITIAL_GPS_STATIONS);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("zyro_user") || localStorage.getItem("workride_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_USER;
  });

  const [activeBooking, setActiveBooking] = useState<RentalBooking | null>(() => {
    const saved = localStorage.getItem("zyro_active_booking") || localStorage.getItem("workride_active_booking");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [bookingHistory, setBookingHistory] = useState<RentalBooking[]>(() => {
    const saved = localStorage.getItem("zyro_booking_history") || localStorage.getItem("workride_booking_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [activeJobApplication, setActiveJobApplication] = useState<JobApplication | null>(() => {
    const saved = localStorage.getItem("zyro_active_job") || localStorage.getItem("workride_active_job");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // Offering Selected Gatekeeper state & active offering key
  const [hasSelectedOffering, setHasSelectedOffering] = useState<boolean>(() => {
    return (localStorage.getItem("zyro_offering_selected") || localStorage.getItem("workride_offering_selected")) === "true";
  });
  const [selectedOffering, setSelectedOffering] = useState<OfferingKey | null>(() => {
    return ((localStorage.getItem("zyro_selected_offering") || localStorage.getItem("workride_selected_offering")) as OfferingKey) || null;
  });

  // UI state
  const [userRole, setUserRole] = useState<UserRole>("gig_worker");
  const [dualRoleActiveMode, setDualRoleActiveMode] = useState<"driver" | "truck_owner">("driver");
  const [activeTab, setActiveTab] = useState<"offerings" | "combo" | "vehicles" | "jobs" | "gps" | "advisor">("vehicles");
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem("zyro_language") || localStorage.getItem("workride_language");
    if (saved === "hindi" || saved === "english" || saved === "hinglish") {
      return saved;
    }
    return "hindi";
  });

  useEffect(() => {
    localStorage.setItem("zyro_language", language);
    localStorage.setItem("workride_language", language);
  }, [language]);

  const t = translations[language];
  const [currentCity, setCurrentCity] = useState("Delhi NCR");
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Vehicle catalog filter state
  const [vehicleCatalogFilter, setVehicleCatalogFilter] = useState<string>("all");

  // Modals state
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [comboPreselectedJob, setComboPreselectedJob] = useState<Job | null>(null);
  const [comboPreselectedVehicle, setComboPreselectedVehicle] = useState<Vehicle | null>(null);
  const [comboFilter, setComboFilter] = useState<"all" | "e_rickshaw" | "bike" | "cargo_van">("all");

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [bookingInitialDuration, setBookingInitialDuration] = useState<"daily" | "weekly" | "monthly">("daily");

  const [isRentToOwnModalOpen, setIsRentToOwnModalOpen] = useState(false);
  const [isBYOBModalOpen, setIsBYOBModalOpen] = useState(false);
  const [isBazaarModalOpen, setIsBazaarModalOpen] = useState(false);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Android Native Integration: Hardware Back-Button and Status Bar
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: "#0f172a" }).catch(() => {});
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    } catch (e) {
      // Running in environment without status-bar plugin
    }

    const backListener = CapApp.addListener("backButton", () => {
      // 1. Close any active top-level modal
      if (isBookingModalOpen) {
        setIsBookingModalOpen(false);
        return;
      }
      if (isComboModalOpen) {
        setIsComboModalOpen(false);
        return;
      }
      if (isRentToOwnModalOpen) {
        setIsRentToOwnModalOpen(false);
        return;
      }
      if (isBYOBModalOpen) {
        setIsBYOBModalOpen(false);
        return;
      }
      if (isBazaarModalOpen) {
        setIsBazaarModalOpen(false);
        return;
      }
      if (isWalletModalOpen) {
        setIsWalletModalOpen(false);
        return;
      }
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return;
      }
      if (isProfileModalOpen) {
        setIsProfileModalOpen(false);
        return;
      }
      if (toastMessage) {
        setToastMessage(null);
        return;
      }

      // 2. If viewing a secondary tab, return to main vehicles tab
      if (activeTab !== "vehicles" && activeTab !== "offerings") {
        setActiveTab("vehicles");
        return;
      }

      // 3. At root level, minimize or exit gracefully
      CapApp.exitApp();
    });

    return () => {
      backListener.then((sub) => sub.remove()).catch(() => {});
    };
  }, [
    isBookingModalOpen,
    isComboModalOpen,
    isRentToOwnModalOpen,
    isBYOBModalOpen,
    isBazaarModalOpen,
    isWalletModalOpen,
    isAuthModalOpen,
    isProfileModalOpen,
    toastMessage,
    activeTab,
  ]);

  const handleSelectOffering = (offering: OfferingKey) => {
    setSelectedOffering(offering);
    setHasSelectedOffering(true);
    localStorage.setItem("zyro_offering_selected", "true");
    localStorage.setItem("zyro_selected_offering", offering);
    localStorage.setItem("workride_offering_selected", "true");
    localStorage.setItem("workride_selected_offering", offering);

    if (offering === "rent_2w") {
      setVehicleCatalogFilter("electric_scooter");
      setActiveTab("vehicles");
      showToast(
        language === "hindi"
          ? "🛵 2-व्हीलर ईवी स्कूटर कैटलॉग अनलॉक हुआ!"
          : "🛵 2-Wheeler Hi-Speed EV Scooters Unlocked!"
      );
    } else if (offering === "rent_3w_loader") {
      setVehicleCatalogFilter("cargo");
      setActiveTab("vehicles");
      showToast(
        language === "hindi"
          ? "🚚 3-व्हीलर लोडर और कार्गो कैटलॉग अनलॉक हुआ!"
          : "🚚 3-Wheeler Heavy Loaders & Cargo Unlocked!"
      );
    } else if (offering === "rent_4w_car") {
      setVehicleCatalogFilter("car");
      setActiveTab("vehicles");
      showToast(
        language === "hindi"
          ? "🚗 4-व्हीलर कार और डिलीवरी वैन कैटलॉग अनलॉक हुआ!"
          : "🚗 4-Wheeler Commercial Cars & Vans Unlocked!"
      );
    } else if (offering === "rent_to_own") {
      setActiveTab("vehicles");
      setIsRentToOwnModalOpen(true);
      showToast("🔑 Rent-To-Own Scheme Unlocked!");
    } else if (offering === "bring_own_bike") {
      setActiveTab("jobs");
      setIsBYOBModalOpen(true);
      showToast("🚀 Own Vehicle / BYOB Attachment Unlocked!");
    } else if (offering === "gig_jobs") {
      setActiveTab("jobs");
      showToast(
        language === "hindi"
          ? "💼 गिग डिलीवरी जॉब्स और शिफ्ट्स अनलॉक हुई!"
          : "💼 Gig Delivery Jobs & Shifts Unlocked!"
      );
    } else if (offering === "rider_bazaar") {
      setActiveTab("vehicles");
      setIsBazaarModalOpen(true);
      showToast("🛍️ Rider Bazaar Deals Unlocked!");
    }
  };

  const handleResetOffering = () => {
    setHasSelectedOffering(false);
    setSelectedOffering(null);
    localStorage.removeItem("zyro_offering_selected");
    localStorage.removeItem("zyro_selected_offering");
    localStorage.removeItem("workride_offering_selected");
    localStorage.removeItem("workride_selected_offering");
    showToast(
      language === "hindi"
        ? "अपनी नई सर्विस (Offering) चुनें"
        : "Select your new service offering"
    );
  };

  const handleSuccessRTO = (modelName: string, emi: number) => {
    showToast(`🎉 Rent-To-Own pre-approved for ${modelName}! Daily EMI: ₹${emi}`);
  };

  const handleSuccessBYOB = (partnerId: string, client: string) => {
    showToast(`🚀 Vehicle attached with ${client}! Partner ID: ${partnerId}`);
  };

  const handleBuyBazaarItem = (item: RiderBazaarItem, paymentMethod: "wallet" | "cod") => {
    if (paymentMethod === "wallet") {
      if (user.walletBalance >= item.discountedPrice) {
        setUser((prev) => ({
          ...prev,
          walletBalance: prev.walletBalance - item.discountedPrice,
        }));
        showToast(`✅ ₹${item.discountedPrice} wallet se deduct hua. Order confirmed!`);
      } else {
        showToast(`✅ Order placed with Cash on Pickup at Hub!`);
      }
    } else {
      showToast(`✅ Order placed with Cash on Pickup at Hub!`);
    }
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    const verifiedUser: UserProfile = {
      ...loggedInUser,
      isLoggedIn: true,
    };
    setUser(verifiedUser);
    setUserRole(verifiedUser.role);

    // CONDITIONAL NAVIGATION BASED ON REGISTRATION TYPE:
    // 1. Rent & Drive -> Show Offering Selection screen
    // 2. Driver -> Directly Driver Dashboard
    // 3. Truck / Vehicle Owner -> Directly Truck Owner Dashboard
    // 4. Driver + Truck Owner -> Directly Dual Dashboard
    const isRentAndDriveUser =
      verifiedUser.registrationType === "rent_and_drive" ||
      verifiedUser.role === "rent_and_drive";

    if (isRentAndDriveUser) {
      setHasSelectedOffering(false);
      setSelectedOffering(null);
      localStorage.removeItem("zyro_offering_selected");
      localStorage.removeItem("zyro_selected_offering");
      localStorage.removeItem("workride_offering_selected");
      localStorage.removeItem("workride_selected_offering");
      showToast(
        language === "hindi"
          ? `🎉 स्वागत है, ${verifiedUser.name}! कृपया अपनी सर्विस (Offering) चुनें।`
          : `🎉 Welcome, ${verifiedUser.name}! Please select an offering.`
      );
    } else {
      setHasSelectedOffering(true);
      localStorage.setItem("zyro_offering_selected", "true");
      localStorage.setItem("workride_offering_selected", "true");
      if (verifiedUser.registrationType === "driver" || verifiedUser.role === "driver") {
        showToast(
          language === "hindi"
            ? `🎉 स्वागत है, ${verifiedUser.name}! आपका ड्राइवर डैशबोर्ड तैयार है।`
            : `🎉 Welcome, ${verifiedUser.name}! Your Driver Dashboard is ready.`
        );
      } else if (
        verifiedUser.registrationType === "truck_owner" ||
        verifiedUser.role === "truck_owner" ||
        verifiedUser.role === "owner_admin"
      ) {
        showToast(
          language === "hindi"
            ? `🎉 स्वागत है, ${verifiedUser.name}! आपका फ्लीट व ओनर पोर्टल तैयार है।`
            : `🎉 Welcome, ${verifiedUser.name}! Your Vehicle Owner Dashboard is ready.`
        );
      } else if (
        verifiedUser.registrationType === "driver_and_truck_owner" ||
        verifiedUser.role === "driver_and_truck_owner"
      ) {
        showToast(
          language === "hindi"
            ? `🎉 स्वागत है, ${verifiedUser.name}! आपका 2-इन-1 डुअल डैशबोर्ड तैयार है।`
            : `🎉 Welcome, ${verifiedUser.name}! Your 2-in-1 Dual Dashboard is ready.`
        );
      }
    }
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setUser({
      ...INITIAL_USER,
      isLoggedIn: false,
    });
    setHasSelectedOffering(false);
    setSelectedOffering(null);
    localStorage.removeItem("zyro_user");
    localStorage.removeItem("zyro_offering_selected");
    localStorage.removeItem("zyro_selected_offering");
    localStorage.removeItem("workride_user");
    localStorage.removeItem("workride_offering_selected");
    localStorage.removeItem("workride_selected_offering");
    showToast(
      language === "hindi"
        ? "आप सफलतापूर्वक लॉगआउट हो गए हैं।"
        : "You have been logged out successfully."
    );
  };

  // Listen to Firebase Auth state changes (Firebase Authentication only - no database)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Enforce email verification using Firebase Authentication only:
        // If user registered with email and hasn't verified, block access and keep logged out
        if (fbUser.email && !fbUser.emailVerified) {
          setUser((prev) => ({ ...prev, isLoggedIn: false }));
          return;
        }
        try {
          // Fetch user document from Firestore collection users/{Firebase_UID}
          let firestoreProfile: any = null;
          try {
            firestoreProfile = await getUserProfileFromFirestore(fbUser.uid);
          } catch (fErr) {
            console.warn("Could not fetch user document from Firestore:", fErr);
          }

          let cachedData: any = null;
          try {
            const cached = localStorage.getItem(`zyro_reg_${fbUser.uid}`) || localStorage.getItem(`workride_reg_${fbUser.uid}`);
            if (cached) cachedData = JSON.parse(cached);
          } catch {}
          
          const profile = syncUserProfile(fbUser, {
            ...(firestoreProfile || {}),
            name: firestoreProfile?.fullName || fbUser.displayName || cachedData?.fullName || cachedData?.name,
            role: firestoreProfile?.role || cachedData?.role,
            registrationType: firestoreProfile?.registrationType || cachedData?.registrationType,
            city: firestoreProfile?.preferredLocation || firestoreProfile?.vehicleLocation || cachedData?.city,
          });

          setUser({ ...profile, isLoggedIn: true });
          if (profile.role) {
            setUserRole(profile.role);
          }

          // ONLY Rent & Drive users use the Offering Selection Gatekeeper
          const isRentAndDriveUser =
            profile.registrationType === "rent_and_drive" ||
            profile.role === "rent_and_drive";

          if (isRentAndDriveUser) {
            const savedOfferingChoice = localStorage.getItem("zyro_offering_selected") || localStorage.getItem("workride_offering_selected");
            const savedOfferingKey = localStorage.getItem("zyro_selected_offering") || localStorage.getItem("workride_selected_offering");
            setHasSelectedOffering(savedOfferingChoice === "true");
            if (savedOfferingKey) {
              setSelectedOffering(savedOfferingKey as OfferingKey);
            }
          } else {
            // Driver, Truck Owner, and Dual Driver+Owner skip offering selection screen
            setHasSelectedOffering(true);
          }
        } catch (err) {
          console.warn("Auth state sync warning:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("zyro_vehicles_v4", JSON.stringify(vehicles));
    localStorage.setItem("workride_vehicles_v4", JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem("zyro_jobs_v4", JSON.stringify(jobs));
    localStorage.setItem("workride_jobs_v4", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem("zyro_user", JSON.stringify(user));
      localStorage.setItem("workride_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("zyro_user");
      localStorage.removeItem("workride_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("zyro_active_booking", JSON.stringify(activeBooking));
    localStorage.setItem("workride_active_booking", JSON.stringify(activeBooking));
  }, [activeBooking]);

  useEffect(() => {
    localStorage.setItem("zyro_booking_history", JSON.stringify(bookingHistory));
    localStorage.setItem("workride_booking_history", JSON.stringify(bookingHistory));
  }, [bookingHistory]);

  useEffect(() => {
    localStorage.setItem("zyro_active_job", JSON.stringify(activeJobApplication));
    localStorage.setItem("workride_active_job", JSON.stringify(activeJobApplication));
  }, [activeJobApplication]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleSelectVehicleForBooking = (vehicle: Vehicle, duration: "daily" | "weekly" | "monthly") => {
    setBookingVehicle(vehicle);
    setBookingInitialDuration(duration);
    setIsBookingModalOpen(true);
  };

  const handleSelectCombo = (vehicle?: Vehicle, job?: Job) => {
    setComboPreselectedVehicle(vehicle || null);
    setComboPreselectedJob(job || null);
    setIsComboModalOpen(true);
  };

  const handleConfirmDirectBooking = (
    vehicle: Vehicle,
    duration: "daily" | "weekly" | "monthly",
    durationCount: number,
    pickupLocation: string
  ) => {
    const rate = duration === "daily" ? vehicle.dailyRate : duration === "weekly" ? vehicle.weeklyRate : vehicle.monthlyRate;
    const totalRent = rate * durationCount;
    const deposit = vehicle.depositAmount;

    const newBooking: RentalBooking = {
      id: `booking-${Date.now()}`,
      bookingNumber: `ZY-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleType: vehicle.type,
      vehiclePlate: vehicle.plateNumber,
      vehicleImage: vehicle.imageUrl,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      durationType: duration,
      durationCount,
      ratePerUnit: rate,
      totalRent,
      depositAmount: deposit,
      depositStatus: "active",
      status: "active",
      pickupLocation,
      pickupOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      kycVerified: true,
      digitalKeyStatus: "unlocked",
      batteryLevel: vehicle.batteryPercent || 90,
      totalKmDriven: 0,
    };

    setActiveBooking(newBooking);
    setUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - totalRent),
      securityDepositInEscrow: prev.securityDepositInEscrow + deposit,
      totalSpentOnRent: prev.totalSpentOnRent + totalRent,
    }));

    setIsBookingModalOpen(false);
    setActiveTab("gps");
    showToast(`🎉 ${vehicle.name} booked successfully! Digital key unlocked.`);
  };

  const handleConfirmCombo = (job: Job, vehicle: Vehicle, duration: "daily" | "weekly" | "monthly") => {
    const rate = duration === "daily" ? vehicle.dailyRate : duration === "weekly" ? vehicle.weeklyRate : vehicle.monthlyRate;
    const depositWaiver = Math.min(300, vehicle.depositAmount);
    const finalDeposit = vehicle.depositAmount - depositWaiver;

    const newBooking: RentalBooking = {
      id: `booking-${Date.now()}`,
      bookingNumber: `ZY-COMBO-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleType: vehicle.type,
      vehiclePlate: vehicle.plateNumber,
      vehicleImage: vehicle.imageUrl,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      durationType: duration,
      durationCount: 1,
      ratePerUnit: rate,
      totalRent: rate,
      depositAmount: finalDeposit,
      depositStatus: "active",
      status: "active",
      pickupLocation: vehicle.locationArea,
      pickupOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      kycVerified: true,
      digitalKeyStatus: "unlocked",
      batteryLevel: vehicle.batteryPercent || 92,
      totalKmDriven: 0,
      associatedJobId: job.id,
      associatedJobTitle: job.title,
      earningsMadeWithVehicle: 0,
    };

    const newJobApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantName: user.name,
      applicantPhone: user.phone,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "active_shift",
      hasRentedVehicle: true,
      vehicleRentalId: newBooking.id,
      vehicleName: vehicle.name,
      deliveriesCompleted: 0,
      earningsToday: 0,
    };

    setActiveBooking(newBooking);
    setActiveJobApplication(newJobApp);

    setUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - rate),
      securityDepositInEscrow: prev.securityDepositInEscrow + finalDeposit,
      totalSpentOnRent: prev.totalSpentOnRent + rate,
    }));

    setIsComboModalOpen(false);
    setActiveTab("gps");
    showToast(`🚀 Combo Activated! Job assigned & ${vehicle.name} unlocked.`);
  };

  const handleApplyJobDirect = (job: Job) => {
    const newJobApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantName: user.name,
      applicantPhone: user.phone,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "active_shift",
      hasRentedVehicle: !!activeBooking,
      vehicleRentalId: activeBooking?.id,
      vehicleName: activeBooking?.vehicleName,
      deliveriesCompleted: 0,
      earningsToday: 0,
    };

    setActiveJobApplication(newJobApp);
    setActiveTab("gps");
    showToast(`💼 Applied to ${job.company}! Shift is now active.`);
  };

  const handleToggleLock = (bookingId: string) => {
    if (!activeBooking || activeBooking.id !== bookingId) return;
    const nextStatus = activeBooking.digitalKeyStatus === "locked" ? "unlocked" : "locked";
    setActiveBooking({
      ...activeBooking,
      digitalKeyStatus: nextStatus,
    });
  };

  const handleSimulateDelivery = () => {
    if (!activeJobApplication) return;
    const earned = 55;
    setActiveJobApplication((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        deliveriesCompleted: prev.deliveriesCompleted + 1,
        earningsToday: prev.earningsToday + earned,
      };
    });

    if (activeBooking) {
      setActiveBooking((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          totalKmDriven: prev.totalKmDriven + 2.8,
          batteryLevel: Math.max(15, prev.batteryLevel - 3),
        };
      });
    }

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + earned,
      totalEarned: prev.totalEarned + earned,
    }));

    showToast(`✅ Order Delivered! +₹${earned} added to your wallet.`);
  };

  const handleEndRide = (bookingId: string) => {
    if (!activeBooking) return;
    const refundAmt = activeBooking.depositAmount;

    setBookingHistory((prev) => [
      {
        ...activeBooking,
        status: "completed",
        depositStatus: "refunded",
      },
      ...prev,
    ]);

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + refundAmt,
      securityDepositInEscrow: Math.max(0, prev.securityDepositInEscrow - refundAmt),
    }));

    setActiveBooking(null);
    showToast(`🏁 Rental completed. ₹${refundAmt} deposit refunded to wallet.`);
  };

  const handleAddNewVehicle = (newVeh: Vehicle) => {
    setVehicles((prev) => [newVeh, ...prev]);
    showToast(`🔑 ${newVeh.name} listed successfully for rental!`);
  };

  const handleDeleteVehicle = (vehId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehId));
    showToast(`🗑️ Vehicle removed from fleet.`);
  };

  const handleToggleVehicleAvailability = (vehId: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehId
          ? { ...v, isAvailable: !v.isAvailable, isCurrentlyRented: v.isAvailable ? false : v.isCurrentlyRented }
          : v
      )
    );
    showToast(`🔄 Vehicle status updated.`);
  };

  const handleAddNewJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`🏢 ${newJob.title} posted successfully for riders!`);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast(`🗑️ Job post removed.`);
  };

  const handleAddMoney = (amt: number) => {
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amt,
    }));
  };

  const handleWithdraw = (amt: number) => {
    setUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - amt),
    }));
  };

  const handleRefundDeposit = () => {
    const held = user.securityDepositInEscrow;
    if (held <= 0) return;
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + held,
      securityDepositInEscrow: 0,
    }));
    if (activeBooking) {
      setActiveBooking({
        ...activeBooking,
        depositStatus: "refunded",
      });
    }
  };

  // User Persona Categorization based on Firestore registrationType & userRole
  const isDriverOnly =
    user.registrationType === "driver" ||
    (userRole === "driver" && user.registrationType !== "driver_and_truck_owner");

  const isTruckOwnerOnly =
    (user.registrationType === "truck_owner" ||
      userRole === "truck_owner" ||
      userRole === "owner_admin") &&
    user.registrationType !== "driver_and_truck_owner" &&
    userRole !== "driver_and_truck_owner";

  const isDualRole =
    user.registrationType === "driver_and_truck_owner" ||
    userRole === "driver_and_truck_owner";

  const isRentAndDrive = !isDriverOnly && !isTruckOwnerOnly && !isDualRole;

  // 1. UNGATED SECURITY CHECK:
  // When app is opened for the first time or logged out, the FIRST screen MUST ALWAYS be Login / Sign Up.
  if (!user.isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start font-sans antialiased overflow-y-auto">
        {/* Toast Notification Container */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-top-4 max-w-[90%]">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}
        <LoginScreen
          language={language}
          setLanguage={setLanguage}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // 2. ISOLATED OFFERINGS SELECTION SCREEN:
  // SHOW THE OFFERING SELECTION SECTION ONLY for users who select: RENT & DRIVE!
  // Drivers, Truck Owners, and Dual Persona users bypass this and go directly to their respective dashboards.
  if (isRentAndDrive && !hasSelectedOffering) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start font-sans antialiased overflow-y-auto">
        {/* Toast Notification Container */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-top-4 max-w-[90%]">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}
        <OfferingsHub
          onSelectOffering={handleSelectOffering}
          language={language}
          userName={user.name}
          onLogout={handleLogout}
          onLanguageToggle={() => {
            if (language === "hinglish") setLanguage("hindi");
            else if (language === "hindi") setLanguage("english");
            else setLanguage("hinglish");
          }}
        />
      </div>
    );
  }

  // 3. FULL UNLOCKED MOBILE APP DASHBOARDS (AFTER AUTH / OFFERING SELECTION)
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start font-sans antialiased overflow-hidden">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-top-4 max-w-[90%]">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Android Mobile Phone Chassis Container: 
          On mobile phones: 100% responsive full screen.
          On larger screens: Centered mobile phone frame with smooth rounded corners and bezel.
      */}
      <div className="w-full sm:max-w-[440px] h-[100dvh] bg-slate-900 sm:border-x sm:border-slate-800/80 shadow-2xl flex flex-col relative overflow-hidden">

        {/* Mobile Header Bar */}
        <Header
          userRole={userRole}
          setUserRole={setUserRole}
          language={language}
          setLanguage={setLanguage}
          user={user}
          activeBookingCount={activeBooking ? 1 : 0}
          activeJobCount={activeJobApplication ? 1 : 0}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onOpenAdvisor={() => setActiveTab("advisor")}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onLogout={handleLogout}
          currentCity={currentCity}
          setCurrentCity={setCurrentCity}
        />

        {/* Main Vertically Scrollable Content Area */}
        <main className="flex-1 min-h-0 px-3 pt-3 pb-24 touch-scroll overflow-y-auto overflow-x-hidden">
          
          {/* ========================================================================= */}
          {/* 1. RENT & DRIVE MODE: SHOW ONLY CONTENT RELATED TO SELECTED OFFERING      */}
          {/* ========================================================================= */}
          {isRentAndDrive && (
            <div className="space-y-3">
              {/* Selected Offering Header & Switcher Banner */}
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-2.5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    {selectedOffering === "rent_2w" && <Bike className="w-4 h-4" />}
                    {selectedOffering === "rent_3w_loader" && <Truck className="w-4 h-4" />}
                    {selectedOffering === "rent_4w_car" && <Car className="w-4 h-4 text-cyan-400" />}
                    {selectedOffering === "gig_jobs" && <Briefcase className="w-4 h-4 text-purple-400" />}
                    {!selectedOffering && <Zap className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">
                      Active Service Offering
                    </span>
                    <span className="text-xs font-black text-white truncate block">
                      {selectedOffering === "rent_2w" && "🛵 Rent 2 Wheeler (EV Scooters)"}
                      {selectedOffering === "rent_3w_loader" && "🛺 Rent 3 Wheeler (Cargo Loaders)"}
                      {selectedOffering === "rent_4w_car" && "🚗 Rent 4 Wheeler (Commercial EVs)"}
                      {selectedOffering === "gig_jobs" && "💼 Gig Jobs Marketplace"}
                      {selectedOffering === "rent_to_own" && "🔑 Rent To Own"}
                      {selectedOffering === "bring_own_bike" && "🛡️ BYOB Attachment"}
                      {!selectedOffering && "Commercial Mobility"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="switch-offering-btn"
                  onClick={handleResetOffering}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Change</span>
                </button>
              </div>

              {/* A. OFFERING: RENT 2 WHEELER (SHOW ONLY 2W VEHICLES) */}
              {selectedOffering === "rent_2w" && (
                <div className="space-y-3">
                  <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2 text-center text-xs text-emerald-200 font-semibold">
                    ⚡ Showing 2-Wheeler EV Scooters & Bikes available for rent in {currentCity}
                  </div>
                  <VehicleCatalog
                    vehicles={vehicles.filter(
                      (v) =>
                        v.type === "electric_scooter" ||
                        v.type === "bike" ||
                        v.name.toLowerCase().includes("scooter") ||
                        v.name.toLowerCase().includes("splendor") ||
                        v.name.toLowerCase().includes("wynn")
                    )}
                    language={language}
                    onSelectVehicle={handleSelectVehicleForBooking}
                    onSelectCombo={handleSelectCombo}
                    selectedCity={currentCity}
                    initialTypeFilter="electric_scooter"
                  />
                </div>
              )}

              {/* B. OFFERING: RENT 3 WHEELER (SHOW ONLY 3W CARGO LOADERS & E-RICKSHAWS) */}
              {selectedOffering === "rent_3w_loader" && (
                <div className="space-y-3">
                  <div className="bg-amber-950/60 border border-amber-500/30 rounded-xl p-2 text-center text-xs text-amber-200 font-semibold">
                    🛺 Showing 3-Wheeler Cargo Loaders & E-Rickshaws available for rent in {currentCity}
                  </div>
                  <VehicleCatalog
                    vehicles={vehicles.filter(
                      (v) =>
                        v.type === "e_rickshaw" ||
                        v.name.toLowerCase().includes("loader") ||
                        v.name.toLowerCase().includes("hiload") ||
                        v.name.toLowerCase().includes("treo") ||
                        (v.loadCapacityKg && v.loadCapacityKg >= 400 && v.loadCapacityKg <= 800)
                    )}
                    language={language}
                    onSelectVehicle={handleSelectVehicleForBooking}
                    onSelectCombo={handleSelectCombo}
                    selectedCity={currentCity}
                    initialTypeFilter="cargo"
                  />
                </div>
              )}

              {/* C. OFFERING: RENT 4 WHEELER (SHOW ONLY 4W COMMERCIAL CARS & VANS) */}
              {selectedOffering === "rent_4w_car" && (
                <div className="space-y-3">
                  <div className="bg-cyan-950/60 border border-cyan-500/30 rounded-xl p-2 text-center text-xs text-cyan-200 font-semibold">
                    🚗 Showing 4-Wheeler Commercial Cabs & Delivery Vans in {currentCity}
                  </div>
                  <VehicleCatalog
                    vehicles={vehicles.filter(
                      (v) =>
                        v.type === "car" ||
                        v.type === "delivery_van" ||
                        v.name.toLowerCase().includes("tata ace") ||
                        v.name.toLowerCase().includes("tigor") ||
                        (v.loadCapacityKg && v.loadCapacityKg >= 800)
                    )}
                    language={language}
                    onSelectVehicle={handleSelectVehicleForBooking}
                    onSelectCombo={handleSelectCombo}
                    selectedCity={currentCity}
                    initialTypeFilter="car"
                  />
                </div>
              )}

              {/* D. OFFERING: GIG JOBS (SHOW ONLY GIG DELIVERY JOBS) */}
              {selectedOffering === "gig_jobs" && (
                <div className="space-y-3">
                  <div className="bg-purple-950/60 border border-purple-500/30 rounded-xl p-2 text-center text-xs text-purple-200 font-semibold">
                    💼 Showing High-Paying Gig Delivery Shifts in {currentCity}
                  </div>
                  <JobMarketplace
                    jobs={jobs}
                    vehicles={vehicles}
                    language={language}
                    onApplyJob={handleApplyJobDirect}
                    onSelectComboForJob={(j) => handleSelectCombo(undefined, j)}
                  />
                </div>
              )}

              {/* E. LIVE GPS & ACTIVE BOOKING */}
              {activeTab === "gps" && (
                <ActiveRideAndGPS
                  activeBooking={activeBooking}
                  bookingHistory={bookingHistory}
                  activeJobApplication={activeJobApplication}
                  language={language}
                  onToggleLock={handleToggleLock}
                  onSimulateDelivery={handleSimulateDelivery}
                  onEndRide={handleEndRide}
                />
              )}

              {/* F. AI ADVISOR */}
              {activeTab === "advisor" && (
                <AIAdvisor
                  language={language}
                  currentCity={currentCity}
                  allVehicles={vehicles}
                  allJobs={jobs}
                  onSelectCombo={handleSelectCombo}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DEDICATED DRIVER ROLE: DIRECTLY OPENS DRIVER DASHBOARD                 */}
          {/* ========================================================================= */}
          {isDriverOnly && (
            <DriverDashboard
              user={user}
              jobs={jobs}
              vehicles={vehicles}
              language={language}
              onApplyJob={handleApplyJobDirect}
              onSelectComboForJob={(j) => handleSelectCombo(undefined, j)}
              activeJobApplication={activeJobApplication}
              activeBooking={activeBooking}
              onOpenWallet={() => setIsWalletModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          )}

          {/* ========================================================================= */}
          {/* 3. DEDICATED TRUCK / VEHICLE OWNER ROLE: DIRECTLY OPENS OWNER DASHBOARD   */}
          {/* ========================================================================= */}
          {isTruckOwnerOnly && (
            <TruckOwnerDashboard
              user={user}
              jobs={jobs}
              vehicles={vehicles}
              language={language}
              onAddTruck={(newTruck) => {
                showToast(`🚚 Truck ${newTruck.registrationNumber} attached to your fleet!`);
              }}
              onOpenWallet={() => setIsWalletModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onUpdateUser={(updated) => setUser(updated)}
            />
          )}

          {/* ========================================================================= */}
          {/* 4. DUAL ROLE: DRIVER + TRUCK OWNER (BOTH PERSONAS ACCESSIBLE)              */}
          {/* ========================================================================= */}
          {isDualRole && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Dual Persona Switcher Banner */}
              <div className="bg-slate-800/95 border border-slate-700/80 p-2.5 rounded-2xl flex flex-col gap-2 shadow-xl">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-black uppercase text-slate-200 tracking-wider">
                      Dual Persona Mode Switcher
                    </span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    2-in-1 Account
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-700/60">
                  <button
                    type="button"
                    id="switch-to-driver-mode-btn"
                    onClick={() => setDualRoleActiveMode("driver")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      dualRoleActiveMode === "driver"
                        ? "bg-[#00B074] text-slate-950 shadow-md shadow-emerald-950 scale-[1.01]"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>🚗 Driver View</span>
                  </button>

                  <button
                    type="button"
                    id="switch-to-truck-owner-mode-btn"
                    onClick={() => setDualRoleActiveMode("truck_owner")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      dualRoleActiveMode === "truck_owner"
                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-950 scale-[1.01]"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>🚚 Truck Owner View</span>
                  </button>
                </div>
              </div>

              {/* Conditional Dashboard for Active Dual Mode */}
              {dualRoleActiveMode === "driver" ? (
                <DriverDashboard
                  user={user}
                  jobs={jobs}
                  vehicles={vehicles}
                  language={language}
                  onApplyJob={handleApplyJobDirect}
                  onSelectComboForJob={(j) => handleSelectCombo(undefined, j)}
                  activeJobApplication={activeJobApplication}
                  activeBooking={activeBooking}
                  onOpenWallet={() => setIsWalletModalOpen(true)}
                  onOpenProfile={() => setIsProfileModalOpen(true)}
                />
              ) : (
                <TruckOwnerDashboard
                  user={user}
                  jobs={jobs}
                  vehicles={vehicles}
                  language={language}
                  onAddTruck={(newTruck) => {
                    showToast(`🚚 Truck ${newTruck.registrationNumber} attached to your fleet!`);
                  }}
                  onOpenWallet={() => setIsWalletModalOpen(true)}
                  onOpenProfile={() => setIsProfileModalOpen(true)}
                  onUpdateUser={(updated) => setUser(updated)}
                />
              )}
            </div>
          )}
        </main>

        {/* Fixed Android Bottom Navigation Bar for Rent & Drive */}
        {isRentAndDrive && (
          <AndroidBottomNav
            activeTab={activeTab}
            onChangeTab={(tab) => {
              if (tab === "offerings") {
                handleResetOffering();
              } else {
                setActiveTab(tab);
              }
            }}
            activeBooking={!!activeBooking}
            vehicleCount={vehicles.length}
            jobCount={jobs.length}
            language={language}
          />
        )}

        {/* Global Modals */}
        <ComboFlowModal
          isOpen={isComboModalOpen}
          onClose={() => setIsComboModalOpen(false)}
          selectedJob={comboPreselectedJob}
          selectedVehicle={comboPreselectedVehicle}
          allJobs={jobs}
          allVehicles={vehicles}
          language={language}
          user={user}
          onConfirmCombo={handleConfirmCombo}
        />

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          vehicle={bookingVehicle}
          initialDuration={bookingInitialDuration}
          language={language}
          user={user}
          pickupStations={stations}
          onConfirmBooking={handleConfirmDirectBooking}
        />

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          user={user}
          activeBooking={activeBooking}
          language={language}
          onAddMoney={handleAddMoney}
          onWithdraw={handleWithdraw}
          onRefundDeposit={handleRefundDeposit}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          language={language}
          onLoginSuccess={handleLoginSuccess}
        />

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          language={language}
          onLogout={handleLogout}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onUpdateUser={(updated) => setUser(updated)}
        />

        <RentToOwnModal
          isOpen={isRentToOwnModalOpen}
          onClose={() => setIsRentToOwnModalOpen(false)}
          user={user}
          onSuccessApplication={handleSuccessRTO}
        />

        <BringYourOwnBikeModal
          isOpen={isBYOBModalOpen}
          onClose={() => setIsBYOBModalOpen(false)}
          user={user}
          onSuccessBYOB={handleSuccessBYOB}
        />

        <RiderBazaarModal
          isOpen={isBazaarModalOpen}
          onClose={() => setIsBazaarModalOpen(false)}
          user={user}
          onBuyItem={handleBuyBazaarItem}
        />
      </div>
    </div>
  );
}

