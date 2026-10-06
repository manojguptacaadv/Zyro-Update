import React, { useState } from "react";
import { Vehicle, VehicleType, FuelType, AppLanguage } from "../types";
import { translations } from "../data/translations";
import { 
  Zap, 
  BatteryCharging, 
  Gauge, 
  Package, 
  Shield, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  Search,
  Bike,
  Car,
  Truck,
  ArrowRight,
  Info
} from "lucide-react";

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  language: AppLanguage;
  onSelectVehicle: (vehicle: Vehicle, duration: "daily" | "weekly" | "monthly") => void;
  onSelectCombo: (vehicle: Vehicle) => void;
  selectedCity: string;
  initialTypeFilter?: string;
}

export const VehicleCatalog: React.FC<VehicleCatalogProps> = ({
  vehicles,
  language,
  onSelectVehicle,
  onSelectCombo,
  selectedCity,
  initialTypeFilter = "all",
}) => {
  const t = translations[language];
  const [selectedType, setSelectedType] = useState<string>(initialTypeFilter);
  const [selectedFuel, setSelectedFuel] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<"daily" | "weekly" | "monthly">("daily");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync if initialTypeFilter changes
  React.useEffect(() => {
    if (initialTypeFilter) {
      setSelectedType(initialTypeFilter);
    }
  }, [initialTypeFilter]);


  const filteredVehicles = vehicles.filter((v) => {
    if (selectedType === "cargo") {
      const isCargo = v.loadCapacityKg >= 200 || v.type === "delivery_van" || v.name.toLowerCase().includes("cargo") || v.type === "e_rickshaw";
      if (!isCargo) return false;
    } else if (selectedType !== "all" && v.type !== selectedType) {
      return false;
    }
    if (selectedFuel !== "all" && v.fuelType !== selectedFuel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchBrand = v.brand.toLowerCase().includes(q);
      const matchArea = v.locationArea.toLowerCase().includes(q);
      const matchType = v.type.toLowerCase().includes(q);
      const matchFuel = v.fuelType.toLowerCase().includes(q);
      const matchFeatures = v.features.some((f) => f.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchArea && !matchType && !matchFuel && !matchFeatures) return false;
    }
    return true;
  });

  const getPrice = (v: Vehicle) => {
    if (selectedDuration === "daily") return { amount: v.dailyRate, unit: "/ day" };
    if (selectedDuration === "weekly") return { amount: v.weeklyRate, unit: "/ week" };
    return { amount: v.monthlyRate, unit: "/ month" };
  };

  return (
    <div className="space-y-6">
      {/* Banner / Value Proposition */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 fill-emerald-300" />
              <span>Zero Downpayment • Daily / Weekly / Monthly Plans</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === "hinglish"
                ? "Gaadi Rent karo aur turant Earning start karo"
                : language === "hindi"
                ? "वाहन किराए पर लें और तुरंत कमाई शुरू करें"
                : "Rent Commercial Vehicles & Start Earning Today"}
            </h2>
            <p className="text-sm text-slate-300">
              {language === "hinglish"
                ? "EV Scooters, Petrol Bikes, Commercial E-Rickshaws aur Delivery Vans. 100% Refundable Escrow Deposit."
                : language === "hindi"
                ? "ईवी स्कूटर, पेट्रोल बाइक, ई-रिक्शा और डिलीवरी वैन 100% सुरक्षित डिपॉजिट के साथ।"
                : "EV Scooters, delivery bikes, commercial e-rickshaws and cargo mini trucks with refundable deposit."}
            </p>
          </div>

          {/* Quick Perks Badge */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Refundable Security Deposit</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Digital Key via App + Live GPS</span>
            </div>
          </div>
        </div>

        {/* Duration Plan Switcher Pill */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-300">
            {language === "hinglish" ? "Rental Plan Chunein:" : "Select Rental Duration:"}
          </div>
          <div className="inline-flex bg-slate-950/80 p-1 rounded-xl border border-slate-700">
            <button
              id="duration-daily-btn"
              onClick={() => setSelectedDuration("daily")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDuration === "daily"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Daily (Daily Basis)
            </button>
            <button
              id="duration-weekly-btn"
              onClick={() => setSelectedDuration("weekly")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDuration === "weekly"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Weekly <span className="bg-amber-400 text-slate-950 text-[9px] px-1 py-0.2 rounded font-black">12% OFF</span>
            </button>
            <button
              id="duration-monthly-btn"
              onClick={() => setSelectedDuration("monthly")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDuration === "monthly"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly <span className="bg-amber-400 text-slate-950 text-[9px] px-1 py-0.2 rounded font-black">25% OFF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="vehicle-search-input"
              type="text"
              placeholder={
                language === "hinglish"
                  ? "Search vehicle (Yulu, Splendor, Ola, Treo, Activa, Okhla)..."
                  : "Search vehicles by model, brand, area or type..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Fuel Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              id="fuel-type-filter"
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Fuel / Energy Types</option>
              <option value="EV Battery Swap">EV (Battery Swap - Zero Fuel Cost)</option>
              <option value="EV Fast Charge">EV (Fast Charging)</option>
              <option value="Petrol">Petrol</option>
              <option value="CNG">CNG</option>
            </select>
          </div>
        </div>

        {/* Vehicle Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer transition-all ${
              selectedType === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setSelectedType("cargo")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "cargo"
                ? "bg-emerald-600 text-white"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Cargo & Heavy Loaders 📦
          </button>
          <button
            onClick={() => setSelectedType("electric_scooter")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "electric_scooter"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            EV Scooters
          </button>
          <button
            onClick={() => setSelectedType("bike")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "bike"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            Bikes (Motorcycle)
          </button>
          <button
            onClick={() => setSelectedType("e_rickshaw")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "e_rickshaw"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            E-Rickshaws
          </button>
          <button
            onClick={() => setSelectedType("delivery_van")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "delivery_van"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Cargo Vans / Mini-Trucks
          </button>
          <button
            onClick={() => setSelectedType("car")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "car"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            4-Wheeler / Cars & Cabs
          </button>
          <button
            onClick={() => setSelectedType("scooter")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "scooter"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            Petrol Scooters (Activa)
          </button>
          <button
            onClick={() => setSelectedType("car")}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
              selectedType === "car"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Cars / Taxis
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((vehicle) => {
          const price = getPrice(vehicle);
          const isEV = vehicle.fuelType.includes("EV");

          return (
            <div
              key={vehicle.id}
              id={`vehicle-card-${vehicle.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow flex items-center gap-1 ${
                    isEV ? "bg-emerald-600" : "bg-slate-800"
                  }`}>
                    {isEV ? <Zap className="w-3 h-3 fill-white" /> : <Bike className="w-3 h-3" />}
                    {vehicle.fuelType}
                  </span>
                  {vehicle.batteryPercent !== undefined && isEV && (
                    <span className="bg-slate-900/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded-lg text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-400" />
                      {vehicle.batteryPercent}%
                    </span>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{vehicle.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({vehicle.reviewsCount})</span>
                </div>

                {/* Plate & Area bottom bar */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-mono font-bold text-[11px] border border-white/20">
                    {vehicle.plateNumber}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 truncate max-w-[180px]">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{vehicle.locationArea}</span>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                        {vehicle.name}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium">
                        {vehicle.brand} • {vehicle.model}
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-emerald-600">
                        ₹{price.amount}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {price.unit}
                      </div>
                    </div>
                  </div>

                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Range</div>
                      <div className="text-xs font-bold text-slate-800">{vehicle.rangeKm} km</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Top Speed</div>
                      <div className="text-xs font-bold text-slate-800">{vehicle.topSpeedKmH} km/h</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Capacity</div>
                      <div className="text-xs font-bold text-slate-800">{vehicle.loadCapacityKg} kg</div>
                    </div>
                  </div>

                  {/* Features / Perks pills */}
                  <div className="mt-3 space-y-1">
                    {vehicle.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Security Deposit badge */}
                  <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-xl p-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                      <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Security Deposit:</span>
                    </div>
                    <div className="font-bold text-amber-900">
                      ₹{vehicle.depositAmount}{" "}
                      <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                        100% Refundable
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  {/* Primary Rent Now Button */}
                  <button
                    id={`rent-btn-${vehicle.id}`}
                    onClick={() => onSelectVehicle(vehicle, selectedDuration)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>{t.rentNow}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Combo Work + Rent Button */}
                  <button
                    id={`combo-btn-${vehicle.id}`}
                    onClick={() => onSelectCombo(vehicle)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {language === "hinglish"
                        ? "Job ke saath Bundle karein (Save ₹500)"
                        : "Bundle with Gig Job (Zero Deposit)"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-14 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <Bike className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">
              {vehicles.length === 0
                ? language === "hinglish"
                  ? "Abhi koi Vehicle Rent Post published nahi hai"
                  : language === "hindi"
                  ? "अभी कोई वाहन रेंट पोस्ट उपलब्ध नहीं है"
                  : "No Vehicles Posted for Rent Yet"
                : "No vehicles match your filter"}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {vehicles.length === 0
                ? language === "hinglish"
                  ? "Vehicle Owners 'Owner Mode' mein ja kar apni bike, scooter ya EV rent par add kar sakte hain."
                  : language === "hindi"
                  ? "वाहन मालिक 'ओनर मोड' में जाकर अपनी गाड़ी किराए के लिए जोड़ सकते हैं।"
                  : "Vehicle owners can list their bikes, scooters, and EVs in the Owner Portal."
                : "Try adjusting your search query or clearing category filters."}
            </p>
          </div>
          {vehicles.length > 0 ? (
            <button
              onClick={() => {
                setSelectedType("all");
                setSelectedFuel("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
