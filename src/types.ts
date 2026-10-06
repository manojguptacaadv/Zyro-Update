export type VehicleType =
  | "electric_scooter"
  | "bike"
  | "scooter"
  | "e_rickshaw"
  | "delivery_van"
  | "car";

export type FuelType = "EV Electric" | "EV Fast Charge" | "Petrol" | "CNG" | "Diesel";

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  imageUrl: string;
  fuelType: FuelType;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  depositAmount: number;
  rangeKm: number;
  topSpeedKmH: number;
  loadCapacityKg: number;
  locationCity: string;
  locationArea: string;
  available: boolean;
  rating: number;
  reviewsCount: number;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  plateNumber: string;
  gpsTrackerId: string;
  features: string[];
  batteryPercent?: number;
  liveLat?: number;
  liveLng?: number;
  speedKmH?: number;
  isUnlocked?: boolean;
  requiredRole?: "driver" | "truck_owner" | "rent_and_drive" | "all";
  truckCategory?: "mini_truck" | "pickup" | "heavy_truck" | "cargo_3w" | "2w_scooter" | "4w_van";
}

export type JobCategory =
  | "food_delivery"
  | "grocery_delivery"
  | "courier"
  | "ecommerce"
  | "ride_hailing"
  | "warehouse"
  | "field_job"
  | "truck_freight"
  | "load_contract";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  category: JobCategory;
  payoutType: "per_order" | "daily" | "monthly" | "per_trip";
  payoutAmount: number;
  payoutLabel: string;
  city: string;
  area: string;
  shiftTiming: string;
  hoursPerDay: number;
  vehicleRequired: boolean;
  recommendedVehicleTypes: VehicleType[];
  vacancies: number;
  applicantsCount: number;
  requirements: string[];
  description: string;
  perks: string[];
  employerName: string;
  employerPhone: string;
  postedDate: string;
  joiningBonus?: number;
  requiredRole?: "driver" | "truck_owner" | "rent_and_drive" | "all";
  contractType?: "daily_shifts" | "per_trip_load" | "monthly_dedicated";
  tonnageRequirement?: string;
}

export interface RentalBooking {
  id: string;
  bookingNumber: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  durationType: "daily" | "weekly" | "monthly";
  durationCount: number;
  ratePerUnit: number;
  totalRent: number;
  depositAmount: number;
  depositStatus: "held_in_escrow" | "refunded" | "active";
  status: "active" | "completed" | "cancelled" | "pending_pickup";
  pickupLocation: string;
  pickupOtp: string;
  kycVerified: boolean;
  digitalKeyStatus: "locked" | "unlocked";
  batteryLevel: number;
  totalKmDriven: number;
  associatedJobId?: string;
  associatedJobTitle?: string;
  earningsMadeWithVehicle?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantPhone: string;
  appliedDate: string;
  status: "approved" | "in_review" | "active_shift" | "completed";
  hasRentedVehicle: boolean;
  vehicleRentalId?: string;
  vehicleName?: string;
  deliveriesCompleted: number;
  earningsToday: number;
}

export type RegistrationType =
  | "driver"
  | "truck_owner"
  | "driver_and_truck_owner"
  | "rent_and_drive";

export type UserRole = 
  | "gig_worker" 
  | "vehicle_owner" 
  | "employer" 
  | "owner_admin"
  | "driver"
  | "truck_owner"
  | "driver_and_truck_owner"
  | "rent_and_drive";

export type AppLanguage = "hinglish" | "hindi" | "english";

export interface DriverDetails {
  experienceYears: number | string;
  licenceNumber: string;
  licenceExpiryDate: string;
  licenceType: string;
  preferredLocation: string;
  workHistory: string;
}

export interface TruckDetails {
  truckType: string;
  brandModel: string;
  manufacturingDate: string;
  registrationNumber: string;
  registrationDetails: string;
  loadCapacity: string;
  availability: string;
  location: string;
  activeContractId?: string;
  activeContractTitle?: string;
}

export interface BankAccountDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber?: string;
  accountNumberMasked: string;
  ifscCode: string;
  isVerified?: boolean;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  fullName?: string;
  phone: string;
  phoneNumber?: string;
  email?: string;
  emailAddress?: string;
  avatar?: string;
  isLoggedIn?: boolean;
  role: UserRole;
  registrationType?: RegistrationType;
  city: string;
  kycStatus: "verified" | "pending" | "unverified";
  walletBalance: number;
  securityDepositInEscrow: number;
  totalEarned: number;
  totalSpentOnRent: number;
  preferredLanguage: AppLanguage;
  licenseNumber?: string;
  aadhaarNumber?: string;

  // Individual flat Firestore fields (stored top-level inside users/{Firebase_UID})
  experienceYears?: string;
  licenceNumber?: string;
  licenceExpiryDate?: string;
  licenceType?: string;
  preferredLocation?: string;
  workHistory?: string;

  truckType?: string;
  truckBrandModel?: string;
  manufacturingDate?: string;
  registrationNumber?: string;
  loadCapacity?: string;
  vehicleAvailability?: string;
  vehicleLocation?: string;

  // Mandatory KYC Document Photos (JPG format stored directly at top-level)
  aadhaarCardImage?: string;
  licenceCardImage?: string;
  vehicleRcImage?: string;

  // Supabase Storage Document File Paths (stored as separate fields in users/{Firebase_UID})
  storageProvider?: "supabase" | "firebase";
  storageBucket?: string;
  aadhaarFilePath?: string;
  aadhaarPath?: string;
  licenceFilePath?: string;
  licencePath?: string;
  rcFilePath?: string;
  rcPath?: string;
  vehicleFilePath?: string;
  vehiclePath?: string;
  profileFilePath?: string;
  profilePath?: string;

  // Authorized access URLs (temporary signed URLs generated for UI view)
  drivingLicencePhotoUrl?: string;
  profilePhotoUrl?: string;
  truckRCPhotoUrl?: string;
  rcPhotoUrl?: string;
  vehiclePhotoUrl?: string;
  truckPhotoUrl?: string;
  aadhaarCardPhotoUrl?: string;
  aadhaarPhotoUrl?: string;

  // Runtime helper objects for UI components
  driverDetails?: DriverDetails;
  truckDetails?: TruckDetails;
  bankAccount?: BankAccountDetails;
}

export interface GPSStation {
  id: string;
  name: string;
  type: "battery_swap" | "ev_charging" | "service_hub" | "pickup_point";
  lat: number;
  lng: number;
  distanceKm: number;
  address: string;
  availableBatteries?: number;
  fastChargers?: number;
  operatingHours: string;
}

export type OfferingKey =
  | "rent_2w"
  | "rent_3w_loader"
  | "rent_4w_car"
  | "rent_to_own"
  | "bring_own_bike"
  | "gig_jobs"
  | "rider_bazaar";

export interface RentToOwnModel {
  id: string;
  name: string;
  brand: string;
  type: VehicleType;
  imageUrl: string;
  marketPrice: number;
  dailyEMI: number;
  monthlyEMI: number;
  tenureMonths: number;
  downPayment: number;
  rangeKm: number;
  topSpeedKmH: number;
  batteryWarrantyYears: number;
  monthlyFuelSavings: number;
  features: string[];
}

export interface BYOBRegistration {
  id: string;
  riderName: string;
  phone: string;
  vehicleType: "2W_scooter" | "2W_bike" | "3W_auto" | "3W_loader";
  vehicleModel: string;
  registrationNumber: string;
  fuelType: FuelType;
  preferredClient: "Zomato" | "Blinkit" | "Swiggy" | "Zepto" | "Porter" | "Amazon Flex";
  city: string;
  installedGPS: boolean;
  partnerIdIssued: string;
  monthlyIncentiveEligible: number;
  status: "active" | "pending_verification";
  createdAt: string;
}

export interface RiderBazaarItem {
  id: string;
  title: string;
  category: "safety" | "delivery_bags" | "accessories" | "rain_gear";
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  inStock: boolean;
  tag?: string;
}

