import React, { useState } from "react";
import { 
  X, 
  Bike, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  QrCode, 
  Navigation, 
  Award, 
  Fuel, 
  ArrowRight,
  Phone,
  User,
  CreditCard
} from "lucide-react";
import { UserProfile, FuelType } from "../types";

interface BringYourOwnBikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSuccessBYOB: (partnerId: string, client: string) => void;
}

export const BringYourOwnBikeModal: React.FC<BringYourOwnBikeModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccessBYOB,
}) => {
  const [riderName, setRiderName] = useState(user.name || "Manoj Kumar");
  const [phone, setPhone] = useState(user.phone || "+91 98765 43210");
  const [vehicleType, setVehicleType] = useState<"2W_scooter" | "2W_bike" | "3W_auto" | "3W_loader">("2W_bike");
  const [vehicleModel, setVehicleModel] = useState("Hero Splendor+ / Honda Activa");
  const [plateNumber, setPlateNumber] = useState("DL-08-CC-4921");
  const [fuelType, setFuelType] = useState<FuelType>("Petrol");
  const [selectedClient, setSelectedClient] = useState<"Blinkit" | "Zomato" | "Swiggy" | "Zepto" | "Porter" | "Amazon Flex">("Blinkit");
  const [hubSlot, setHubSlot] = useState("Central Delhi Hub (Connaught Place) - Today 3:00 PM");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<{ partnerId: string; client: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `ZY-BYOB-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsSubmitting(false);
      setRegisteredData({
        partnerId: generatedId,
        client: selectedClient,
      });
      onSuccessBYOB(generatedId, selectedClient);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#20304C] to-[#121B2C] p-5 sm:p-6 text-white flex items-center justify-between sticky top-0 z-20 shadow-md border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 text-emerald-400">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                  +₹3,000 / Month Incentive
                </span>
                <span className="text-xs text-slate-300">Client Partner ID</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Bring Your Own Bike / Vehicle
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {registeredData ? (
            <div className="text-center py-6 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">
                Vehicle Attached Successfully! 🚀
              </h3>
              <p className="text-sm text-slate-300">
                Aapka vehicle <span className="font-bold text-emerald-400">{registeredData.client}</span> ke saath link ho gaya hai.
              </p>

              {/* Digital Partner ID Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 text-left space-y-3 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase text-slate-300">ZYRO CLIENT PARTNER PASS</span>
                  </div>
                  <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Partner Rider Name</span>
                    <h4 className="text-base font-extrabold text-white">{riderName}</h4>
                    <div className="text-xs font-mono text-emerald-400 mt-0.5">{registeredData.partnerId}</div>
                  </div>
                  <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shadow">
                    <QrCode className="w-12 h-12 text-slate-950" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-400">Attached Plate:</span>
                    <div className="font-bold text-white font-mono">{plateNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Attached Client:</span>
                    <div className="font-bold text-amber-300">{registeredData.client}</div>
                  </div>
                </div>
              </div>

              {/* Hub Appointment */}
              <div className="bg-slate-800/80 rounded-2xl p-4 text-xs space-y-1.5 border border-slate-700 text-left">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                  <Navigation className="w-4 h-4" />
                  <span>Free GPS Tracker Installation Slot:</span>
                </div>
                <p className="text-slate-300 pl-5 font-semibold">{hubSlot}</p>
                <p className="text-[11px] text-slate-400 pl-5">
                  Hub par jaakar apni free GPS device lagwayein aur ₹3,000 monthly incentive unlock karein.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Top Banner with Benefits */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-800 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Why Attach Your Own Vehicle?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>₹3,000 / mo Extra Incentive</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Free Anti-Theft GPS Device</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Direct Onboarding with Client ID</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Rider Details */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Rider & Vehicle Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Your Name</label>
                    <div className="relative mt-1">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={riderName}
                        onChange={(e) => setRiderName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Manoj Kumar"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Mobile Number</label>
                    <div className="relative mt-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 mt-1"
                    >
                      <option value="2W_bike">2-Wheeler Motorcycle / Bike</option>
                      <option value="2W_scooter">2-Wheeler Scooter (Activa/Jupiter)</option>
                      <option value="3W_auto">3-Wheeler Auto / Passenger E-Rickshaw</option>
                      <option value="3W_loader">3-Wheeler Commercial Cargo Loader</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold">Registration Number (Number Plate)</label>
                    <div className="relative mt-1">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                        placeholder="DL-08-CC-4921"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Choose Delivery Client to Attach */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>2. Select Client Platform to Work With</span>
                  <span className="text-emerald-400 font-semibold">Instant ID Issued</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(["Blinkit", "Zomato", "Swiggy", "Zepto", "Porter", "Amazon Flex"] as const).map((client) => {
                    const isSelected = selectedClient === client;
                    return (
                      <button
                        key={client}
                        type="button"
                        onClick={() => setSelectedClient(client)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-950 border-emerald-500 text-white font-black shadow-lg shadow-emerald-500/20"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        <div className="text-sm font-black">{client}</div>
                        <div className="text-[10px] text-emerald-400 mt-0.5">High Order Volume</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Free GPS & Inspection Slot */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  3. Free GPS Tracker Installation Hub Slot
                </label>
                <select
                  value={hubSlot}
                  onChange={(e) => setHubSlot(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Central Delhi Hub (Connaught Place) - Today 3:00 PM">Central Delhi Hub (Connaught Place) - Today 3:00 PM</option>
                  <option value="East Delhi Hub (Laxmi Nagar Metro) - Today 5:00 PM">East Delhi Hub (Laxmi Nagar Metro) - Today 5:00 PM</option>
                  <option value="Gurugram Hub (Cyber City Rapid Metro) - Tomorrow 11:00 AM">Gurugram Hub (Cyber City Rapid Metro) - Tomorrow 11:00 AM</option>
                  <option value="Noida Sector 18 Fleet Center - Tomorrow 2:00 PM">Noida Sector 18 Fleet Center - Tomorrow 2:00 PM</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Client ID & Booking Slot...</span>
                ) : (
                  <>
                    <span>Register My Vehicle & Get Partner ID</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
