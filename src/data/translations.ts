export interface Translations {
  appName: string;
  tagline: string;
  subTagline: string;
  tabHome: string;
  tabVehicles: string;
  tabJobs: string;
  tabCombo: string;
  tabLiveGPS: string;
  tabMyRides: string;
  tabMyJobs: string;
  tabOwnerPortal: string;
  tabEmployerPortal: string;
  tabAdvisor: string;
  tabProfile: string;
  rentNow: string;
  applyNow: string;
  bundleRentAndWork: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  securityDeposit: string;
  depositRefundable: string;
  kycRequired: string;
  kycVerified: string;
  unlockVehicle: string;
  lockVehicle: string;
  activeBooking: string;
  startJobShift: string;
  todayEarnings: string;
  netProfit: string;
  batteryStatus: string;
  findSwapStations: string;
  postVehicle: string;
  postJob: string;
  aiAdvisorTitle: string;
  aiAdvisorSubtitle: string;
  noVehicleNeeded: string;
  vehicleIncluded: string;
  earnPerDay: string;
  allVehicles: string;
  allJobs: string;
  
  // Authentication & Partner Onboarding
  loginTitle: string;
  loginSubtitle: string;
  signupTitle: string;
  signupSubtitle: string;
  loginWithEmail: string;
  loginWithPhone: string;
  phoneInputLabel: string;
  phoneInputPlaceholder: string;
  emailInputLabel: string;
  emailInputPlaceholder: string;
  passwordInputLabel: string;
  passwordInputPlaceholder: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  cityLabel: string;
  signInBtn: string;
  signUpBtn: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  createAccount: string;
  step1Title: string;
  step2Title: string;
  chooseRole: string;
  roleDriver: string;
  roleDriverDesc: string;
  roleTruckOwner: string;
  roleTruckOwnerDesc: string;
  roleDual: string;
  roleDualDesc: string;
  roleRentDrive: string;
  roleRentDriveDesc: string;
  experienceYears: string;
  licenceNumber: string;
  licenceType: string;
  preferredLocation: string;
  workHistory: string;
  truckType: string;
  plateNumber: string;
  loadCapacity: string;
  vehicleAvailability: string;
  vehicleLocation: string;
  completeRegistrationBtn: string;
  nextStepBtn: string;
  backBtn: string;
  verifiedDriver: string;
  verifiedOwner: string;
  activeShift: string;
  noJobsFound: string;
  searchPlaceholder: string;
  filterAll: string;
  logout: string;
  wallet: string;
  profile: string;
  languageSelect: string;
}

export const translations: Record<"hinglish" | "hindi" | "english", Translations> = {
  hinglish: {
    appName: "Zyro",
    tagline: "Job aur Vehicle Rental ek hi App mein!",
    subTagline: "Gaadi rent karo, delivery / gig job start karo aur daily kamao.",
    tabHome: "Home",
    tabVehicles: "Gaadi Rent",
    tabJobs: "Gig Jobs",
    tabCombo: "Job + Gaadi Pack",
    tabLiveGPS: "Shift & Income",
    tabMyRides: "Meri Gaadi",
    tabMyJobs: "Meri Jobs",
    tabOwnerPortal: "Vehicle Owner",
    tabEmployerPortal: "Job Poster",
    tabAdvisor: "AI Income Saathi",
    tabProfile: "Profile",
    rentNow: "Abhi Rent Karein",
    applyNow: "Job Apply Karein",
    bundleRentAndWork: "Job Lo + Gaadi Rent Karo (Instant Pack)",
    dailyRate: "Daily Kiraya",
    weeklyRate: "Hafte Ka (Weekly)",
    monthlyRate: "Mahine Ka (Monthly)",
    securityDeposit: "Security Deposit (Refundable)",
    depositRefundable: "100% Refundable Deposit",
    kycRequired: "Instant Aadhaar & DL KYC",
    kycVerified: "KYC Verified",
    unlockVehicle: "Digital Key Unlock",
    lockVehicle: "Lock Vehicle",
    activeBooking: "Active Rental Gaadi",
    startJobShift: "Shift Shuru Karein",
    todayEarnings: "Aaj Ki Income",
    netProfit: "Net Munafa (Rent nikaal kar)",
    batteryStatus: "Battery & Range",
    findSwapStations: "Battery Swap & Charging Points",
    postVehicle: "Apni Gaadi Rent Par De",
    postJob: "Nayi Gig Job Post Karein",
    aiAdvisorTitle: "Zyro AI Saathi",
    aiAdvisorSubtitle: "Janiye kaunsi gaadi aur job se sabse zyada daily bachat hogi",
    noVehicleNeeded: "Gaadi ki zaroorat nahi",
    vehicleIncluded: "Vehicle Required",
    earnPerDay: "Kamao / Din",
    allVehicles: "Sabhi Gaadiyan",
    allJobs: "Sabhi Jobs",

    // Authentication & Onboarding
    loginTitle: "Apne Account Mein Sign In Karein",
    loginSubtitle: "Zyro Mobility Platform par login karein aur kamaai shuru karein",
    signupTitle: "Partner Registration (Naya Account)",
    signupSubtitle: "Apna naam, number aur role select karein aur judiye",
    loginWithEmail: "Email se Sign In",
    loginWithPhone: "Mobile Number se Sign In",
    phoneInputLabel: "10-digit Mobile Number",
    phoneInputPlaceholder: "e.g. 9876543210",
    emailInputLabel: "Email Address",
    emailInputPlaceholder: "e.g. rahul@example.com",
    passwordInputLabel: "Password",
    passwordInputPlaceholder: "Kam se kam 6 characters",
    fullNameLabel: "Poora Naam",
    fullNamePlaceholder: "e.g. Rahul Kumar",
    cityLabel: "Aapka Shehar / Location",
    signInBtn: "Sign In Karein",
    signUpBtn: "Naya Account Banayein",
    dontHaveAccount: "Naya account banana chahte hain?",
    alreadyHaveAccount: "Pehle se account hai?",
    createAccount: "Register Karein",
    step1Title: "1. Account & Mobile",
    step2Title: "2. Role & Details",
    chooseRole: "Aapka Role Chunein",
    roleDriver: "Commercial Driver",
    roleDriverDesc: "Commercial gaadiyan ya bike/rickshaw chalayein",
    roleTruckOwner: "Truck / Gaadi Owner",
    roleTruckOwnerDesc: "Apna truck ya commercial gaadi rent par lagayein",
    roleDual: "Driver + Truck Owner",
    roleDualDesc: "Apni gaadi khud chalayein aur rent par bhi dein",
    roleRentDrive: "Rent & Drive",
    roleRentDriveDesc: "Gaadi rent lekar delivery / transport kaam karein",
    experienceYears: "Driving Experience (Saal)",
    licenceNumber: "Driving Licence Number",
    licenceType: "Licence Category",
    preferredLocation: "Kaam Karne Ki Location",
    workHistory: "Previous Kaam Ka Anubhav",
    truckType: "Truck / Gaadi Type",
    plateNumber: "Vehicle Plate Number (RC)",
    loadCapacity: "Load Capacity (Weight)",
    vehicleAvailability: "Availability Status",
    vehicleLocation: "Gaadi Khadi Rehne Ki Jagah",
    completeRegistrationBtn: "Registration Poora Karein",
    nextStepBtn: "Agla Step",
    backBtn: "Peeche Jayein",
    verifiedDriver: "Verified Driver",
    verifiedOwner: "Verified Owner",
    activeShift: "Active Work Shift",
    noJobsFound: "Koi job nahi mili",
    searchPlaceholder: "Search karein...",
    filterAll: "Sabhi",
    logout: "Log Out",
    wallet: "Wallet & Escrow",
    profile: "Profile Dekhein",
    languageSelect: "Bhasha Chunein",
  },
  hindi: {
    appName: "ज़ायरो",
    tagline: "नौकरी और वाहन किराया एक ही ऐप में!",
    subTagline: "वाहन किराए पर लें, डिलीवरी / गिग काम शुरू करें और रोज़ाना कमाई करें।",
    tabHome: "होम",
    tabVehicles: "वाहन किराया",
    tabJobs: "गिग नौकरियां",
    tabCombo: "जॉब + वाहन पैक",
    tabLiveGPS: "शिफ्ट व दैनिक इनकम",
    tabMyRides: "मेरा वाहन",
    tabMyJobs: "मेरी नौकरियां",
    tabOwnerPortal: "वाहन मालिक",
    tabEmployerPortal: "नियोक्ता पोर्टल",
    tabAdvisor: "एआई इनकम साथी",
    tabProfile: "प्रोफ़ाइल",
    rentNow: "अभी किराए पर लें",
    applyNow: "आवेदन करें",
    bundleRentAndWork: "जॉब + वाहन एक साथ लें",
    dailyRate: "दैनिक किराया",
    weeklyRate: "साप्ताहिक किराया",
    monthlyRate: "मासिक किराया",
    securityDeposit: "सुरक्षा जमा (वापसी योग्य)",
    depositRefundable: "100% वापसी योग्य",
    kycRequired: "त्वरित आधार व डीएल सत्यापन",
    kycVerified: "केवाईसी सत्यापित",
    unlockVehicle: "डिजिटल चाबी से अनलॉक करें",
    lockVehicle: "वाहन लॉक करें",
    activeBooking: "सक्रिय वाहन किराया",
    startJobShift: "शिफ्ट शुरू करें",
    todayEarnings: "आज की कमाई",
    netProfit: "शुद्ध मुनाफा (किराया घटाकर)",
    batteryStatus: "बैटरी व रेंज",
    findSwapStations: "बैटरी स्वैप व चार्जिंग केंद्र",
    postVehicle: "अपना वाहन किराए पर दें",
    postJob: "नई नौकरी पोस्ट करें",
    aiAdvisorTitle: "ज़ायरो एआई साथी",
    aiAdvisorSubtitle: "जानें कौन सी नौकरी और वाहन से होगी अधिकतम बचत",
    noVehicleNeeded: "वाहन की आवश्यकता नहीं",
    vehicleIncluded: "वाहन आवश्यक",
    earnPerDay: "प्रति दिन कमाई",
    allVehicles: "सभी वाहन",
    allJobs: "सभी नौकरियां",

    // Authentication & Onboarding
    loginTitle: "अपने खाते में साइन इन करें",
    loginSubtitle: "ज़ायरो प्लेटफॉर्म पर लॉगिन करें और तुरंत कमाई शुरू करें",
    signupTitle: "पार्टनर पंजीकरण (नया खाता)",
    signupSubtitle: "अपना नाम, मोबाइल नंबर और श्रेणी चुनकर ज़ायरो से जुड़ें",
    loginWithEmail: "ईमेल से साइन इन करें",
    loginWithPhone: "मोबाइल नंबर से साइन इन करें",
    phoneInputLabel: "10 अंकों का मोबाइल नंबर",
    phoneInputPlaceholder: "उदा. 9876543210",
    emailInputLabel: "ईमेल पता",
    emailInputPlaceholder: "उदा. rahul@example.com",
    passwordInputLabel: "पासवर्ड",
    passwordInputPlaceholder: "कम से कम 6 अक्षर",
    fullNameLabel: "पूरा नाम",
    fullNamePlaceholder: "उदा. राहुल कुमार",
    cityLabel: "आपका शहर / स्थान",
    signInBtn: "साइन इन करें",
    signUpBtn: "नया खाता बनाएं",
    dontHaveAccount: "क्या आपका खाता नहीं है?",
    alreadyHaveAccount: "क्या आपका पहले से खाता है?",
    createAccount: "रजिस्टर करें",
    step1Title: "1. खाता और मोबाइल",
    step2Title: "2. श्रेणी और विवरण",
    chooseRole: "अपनी पार्टनर श्रेणी चुनें",
    roleDriver: "कमर्शियल ड्राइवर",
    roleDriverDesc: "कमर्शियल वाहन, ऑटो या बाइक चलाकर कमाई करें",
    roleTruckOwner: "ट्रक / वाहन मालिक",
    roleTruckOwnerDesc: "अपना ट्रक या कमर्शियल वाहन किराए पर लगाएं",
    roleDual: "ड्राइवर + वाहन मालिक",
    roleDualDesc: "अपनी गाड़ी खुद चलाएं और साथ ही किराए पर भी दें",
    roleRentDrive: "किराए पर लेकर चलाएं",
    roleRentDriveDesc: "वाहन किराए पर लेकर डिलीवरी व ट्रांसपोर्ट काम करें",
    experienceYears: "ड्राइविंग अनुभव (वर्ष)",
    licenceNumber: "ड्राइविंग लाइसेंस नंबर",
    licenceType: "लाइसेंस श्रेणी",
    preferredLocation: "पसंदीदा कार्य क्षेत्र",
    workHistory: "पूर्व कार्य अनुभव",
    truckType: "ट्रक / वाहन प्रकार",
    plateNumber: "वाहन नंबर (RC)",
    loadCapacity: "भार क्षमता (वजन)",
    vehicleAvailability: "उपलब्धता स्थिति",
    vehicleLocation: "वाहन का मुख्य स्थान",
    completeRegistrationBtn: "पंजीकरण पूरा करें",
    nextStepBtn: "अगला चरण",
    backBtn: "पीछे जाएं",
    verifiedDriver: "सत्यापित ड्राइवर",
    verifiedOwner: "सत्यापित वाहन मालिक",
    activeShift: "सक्रिय कार्य शिफ्ट",
    noJobsFound: "कोई नौकरी उपलब्ध नहीं है",
    searchPlaceholder: "खोजें...",
    filterAll: "सभी",
    logout: "लॉग आउट",
    wallet: "वॉलेट और सुरक्षा जमा",
    profile: "प्रोफ़ाइल देखें",
    languageSelect: "भाषा चुनें",
  },
  english: {
    appName: "Zyro",
    tagline: "Job & Vehicle Rental in One Single App!",
    subTagline: "Rent commercial vehicles, start gig/delivery jobs and earn daily.",
    tabHome: "Home",
    tabVehicles: "Rent Vehicle",
    tabJobs: "Gig Jobs",
    tabCombo: "Job + Vehicle Combo",
    tabLiveGPS: "My Shift & Earnings",
    tabMyRides: "My Rentals",
    tabMyJobs: "My Jobs",
    tabOwnerPortal: "Vehicle Owner",
    tabEmployerPortal: "Post a Job",
    tabAdvisor: "AI Earning Advisor",
    tabProfile: "Profile",
    rentNow: "Rent Now",
    applyNow: "Apply Job",
    bundleRentAndWork: "Bundle Job + Vehicle Rental",
    dailyRate: "Daily Rent",
    weeklyRate: "Weekly Rent",
    monthlyRate: "Monthly Rent",
    securityDeposit: "Security Deposit (Refundable)",
    depositRefundable: "100% Refundable Deposit",
    kycRequired: "Instant Aadhaar & DL KYC",
    kycVerified: "KYC Verified",
    unlockVehicle: "Digital Key Unlock",
    lockVehicle: "Lock Vehicle",
    activeBooking: "Active Vehicle Rental",
    startJobShift: "Start Work Shift",
    todayEarnings: "Today's Gross Earnings",
    netProfit: "Net Profit (After Rent)",
    batteryStatus: "Battery & Range",
    findSwapStations: "Battery Swap & Charging Stations",
    postVehicle: "List Vehicle For Rent",
    postJob: "Post a Gig Job",
    aiAdvisorTitle: "Zyro AI Advisor",
    aiAdvisorSubtitle: "Calculate accurate net daily profits based on vehicle and shift hours",
    noVehicleNeeded: "No Vehicle Needed",
    vehicleIncluded: "Vehicle Required",
    earnPerDay: "Earn / Day",
    allVehicles: "All Vehicles",
    allJobs: "All Jobs",

    // Authentication & Onboarding
    loginTitle: "Sign In to Your Account",
    loginSubtitle: "Sign in to Zyro Mobility Platform and start earning",
    signupTitle: "Partner Registration (New Account)",
    signupSubtitle: "Enter your name, mobile and choose your role to join Zyro",
    loginWithEmail: "Sign in with Email",
    loginWithPhone: "Sign in with Mobile",
    phoneInputLabel: "10-digit Mobile Number",
    phoneInputPlaceholder: "e.g. 9876543210",
    emailInputLabel: "Email Address",
    emailInputPlaceholder: "e.g. rahul@example.com",
    passwordInputLabel: "Password",
    passwordInputPlaceholder: "At least 6 characters",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "e.g. Rahul Kumar",
    cityLabel: "Your City / Location",
    signInBtn: "Sign In",
    signUpBtn: "Create New Account",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    createAccount: "Register Now",
    step1Title: "1. Account & Mobile",
    step2Title: "2. Role & Details",
    chooseRole: "Select Your Partner Role",
    roleDriver: "Commercial Driver",
    roleDriverDesc: "Drive commercial vehicles, auto or bike for deliveries",
    roleTruckOwner: "Truck / Vehicle Owner",
    roleTruckOwnerDesc: "List and attach your truck or fleet on rent",
    roleDual: "Driver + Truck Owner",
    roleDualDesc: "Drive your vehicle and also rent it out",
    roleRentDrive: "Rent & Drive",
    roleRentDriveDesc: "Rent a vehicle and start gig delivery work",
    experienceYears: "Driving Experience (Years)",
    licenceNumber: "Driving Licence Number",
    licenceType: "Licence Category",
    preferredLocation: "Preferred Work Location",
    workHistory: "Previous Work Experience",
    truckType: "Truck / Vehicle Type",
    plateNumber: "Vehicle Plate Number (RC)",
    loadCapacity: "Load Capacity (Weight)",
    vehicleAvailability: "Availability Status",
    vehicleLocation: "Vehicle Operating Location",
    completeRegistrationBtn: "Complete Registration",
    nextStepBtn: "Next Step",
    backBtn: "Back",
    verifiedDriver: "Verified Driver",
    verifiedOwner: "Verified Owner",
    activeShift: "Active Shift",
    noJobsFound: "No jobs found",
    searchPlaceholder: "Search...",
    filterAll: "All",
    logout: "Log Out",
    wallet: "Wallet & Escrow",
    profile: "View Profile",
    languageSelect: "Choose Language",
  },
};
