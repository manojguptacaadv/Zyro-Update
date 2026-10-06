import React, { useState } from "react";
import { 
  UserProfile, 
  Job, 
  Vehicle, 
  AppLanguage,
  TruckDetails
} from "../types";
import { 
  Truck, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  Navigation, 
  Briefcase, 
  Clock, 
  Check, 
  AlertCircle,
  X,
  Phone,
  Mail,
  RotateCcw
} from "lucide-react";
import { translations } from "../data/translations";
import { BankAccountCard } from "./BankAccountCard";

interface TruckOwnerDashboardProps {
  user: UserProfile;
  jobs: Job[];
  vehicles: Vehicle[];
  language: AppLanguage;
  onAddTruck?: (truck: TruckDetails) => void;
  onOpenWallet?: () => void;
  onOpenProfile?: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

interface ContractAssignment {
  contractId: string;
  contractTitle: string;
  client: string;
  payoutAmount: number;
  assignedAt: string;
}

export const TruckOwnerDashboard: React.FC<TruckOwnerDashboardProps> = ({
  user,
  jobs,
  vehicles,
  language,
  onAddTruck,
  onOpenWallet,
  onOpenProfile,
  onUpdateUser,
}) => {
  const t = translations[language];

  // Trucks list initialized from user profile if exists, otherwise empty
  const [trucksList, setTrucksList] = useState<TruckDetails[]>(() => {
    if (user.truckDetails && user.truckDetails.registrationNumber) {
      return [user.truckDetails];
    }
    const saved = localStorage.getItem(`zyro_trucks_${user.uid || user.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"fleet" | "contracts" | "earnings">("fleet");
  const [selectedTruckForAssignment, setSelectedTruckForAssignment] = useState<string>("");

  // Add Truck Form State
  const [newTruckType, setNewTruckType] = useState<string>("Tata Ace / Chota Hathi (1 Ton)");
  const [newBrandModel, setNewBrandModel] = useState<string>("");
  const [newMfgYear, setNewMfgYear] = useState<string>("2023");
  const [newPlateNumber, setNewPlateNumber] = useState<string>("");
  const [newRegDetails, setNewRegDetails] = useState<string>("Commercial Yellow Plate • Fitness Valid");
  const [newLoadCapacity, setNewLoadCapacity] = useState<string>("1.0 Ton (1000 kg)");
  const [newAvailability, setNewAvailability] = useState<string>("Immediate / Daily On-Demand");
  const [newLocation, setNewLocation] = useState<string>(user.city || "Delhi NCR");

  // Contract assignment state: mapping from truck plate number -> { contractId, contractTitle, client, payoutAmount }
  // Requirement: One truck can have only ONE active Load Contract at a time!
  // Requirement: Load contracts start at 0 for a new user!
  const [assignedContracts, setAssignedContracts] = useState<Record<string, ContractAssignment>>(() => {
    const saved = localStorage.getItem(`zyro_truck_contracts_${user.uid || user.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  const [assignmentNotice, setAssignmentNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Available B2B Freight Loads & Contracts
  const availableContracts = [
    {
      id: "contract-1",
      title: "Daily FMCG Bulk Depot-to-Store Distribution",
      client: "Reliance Retail & JioMart Logistics",
      route: "Okhla Warehouse ➔ South Delhi & Noida Hubs",
      payLabel: "₹4,200 per trip",
      payoutAmount: 4200,
      tonnage: "1.0 to 2.5 Ton Capacity",
      timing: "Morning Shift (6:00 AM - 2:00 PM)",
      tripsPerDay: "2 Trips Daily Guaranteed",
      contractDuration: "6 Months Assured Contract",
      perks: ["Fuel Advance Provided", "Fast Loading Dock Priority", "Instant Weekly Settlement"],
    },
    {
      id: "contract-2",
      title: "Mid-Mile Heavy Cargo & Parcel Logistics Linehaul",
      client: "Delhivery Express Freight Hub",
      route: "Sanjay Gandhi Transport Nagar ➔ Gurugram Gateway",
      payLabel: "₹5,500 per trip + Toll Reimbursed",
      payoutAmount: 5500,
      tonnage: "1.5 to 3.5 Ton Container",
      timing: "Night Route (9:00 PM - 5:00 AM)",
      tripsPerDay: "1 Long Haul Night Run",
      contractDuration: "12 Months Renewable",
      perks: ["FASTag Toll Direct Reimbursement", "Dedicated Route Coordinator", "Fleet Loyalty Bonus"],
    },
    {
      id: "contract-3",
      title: "Industrial Goods & Hardware Wholesale Transit",
      client: "Tata Steel & JSW Distribution Partner",
      route: "Mayapuri Industrial Area ➔ Faridabad Logistics Cluster",
      payLabel: "₹6,800 per trip",
      payoutAmount: 6800,
      tonnage: "2.0 to 5.0 Ton Heavy Vehicle",
      timing: "Flexible Day Loading (9:00 AM - 6:00 PM)",
      tripsPerDay: "On-Demand Daily Dispatch",
      contractDuration: "Monthly On-Call Agreement",
      perks: ["Zero Waiting Time Surcharge", "Free Driver Helper Provided", "Direct Bank RTGS"],
    },
    {
      id: "contract-4",
      title: "Cold Chain & Fresh Dairy Morning Supply Fleet",
      client: "Mother Dairy & Amul Supply Chain",
      route: "Patparganj Central Dairy ➔ East Delhi Outlets",
      payLabel: "₹3,800 per trip",
      payoutAmount: 3800,
      tonnage: "1.0 to 1.5 Ton Insulated/Open Deck",
      timing: "Early Morning (4:30 AM - 10:30 AM)",
      tripsPerDay: "Daily Fixed Morning Schedule",
      contractDuration: "1 Year Standard Contract",
      perks: ["Early Hours Easy Traffic", "Clean Cargo Only", "Punctuality Incentive"],
    },
  ];

  const handleAddNewTruckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandModel.trim() || !newPlateNumber.trim()) {
      setAssignmentNotice({
        type: "error",
        message: "Please enter brand model and vehicle registration plate number.",
      });
      return;
    }

    const createdTruck: TruckDetails = {
      truckType: newTruckType,
      brandModel: newBrandModel.trim(),
      manufacturingDate: newMfgYear.trim(),
      registrationNumber: newPlateNumber.trim().toUpperCase(),
      registrationDetails: newRegDetails.trim(),
      loadCapacity: newLoadCapacity.trim(),
      availability: newAvailability,
      location: newLocation.trim(),
    };

    const updated = [createdTruck, ...trucksList];
    setTrucksList(updated);
    try {
      localStorage.setItem(`zyro_trucks_${user.uid || user.id}`, JSON.stringify(updated));
    } catch {}

    if (onAddTruck) {
      onAddTruck(createdTruck);
    }

    setShowAddModal(false);
    setNewBrandModel("");
    setNewPlateNumber("");
    setAssignmentNotice({
      type: "success",
      message: `Truck ${createdTruck.registrationNumber} added successfully!`,
    });
    setTimeout(() => setAssignmentNotice(null), 4000);
  };

  // Requirement: One truck can have only ONE active Load Contract at a time!
  const handleAssignContractToTruck = (contractId: string, truckPlate: string) => {
    if (!truckPlate) {
      setAssignmentNotice({
        type: "error",
        message: "Please select a truck to assign this contract.",
      });
      return;
    }

    // Check if selected truck already has an active contract
    if (assignedContracts[truckPlate]) {
      const activeContract = assignedContracts[truckPlate];
      setAssignmentNotice({
        type: "error",
        message: `⚠️ Truck ${truckPlate} already has an active Load Contract: "${activeContract.contractTitle}". A truck can only have ONE active contract at a time. Please complete or release the active contract before assigning a new one.`,
      });
      return;
    }

    const contractObj = availableContracts.find((c) => c.id === contractId);
    if (!contractObj) return;

    const newAssignments = {
      ...assignedContracts,
      [truckPlate]: {
        contractId: contractObj.id,
        contractTitle: contractObj.title,
        client: contractObj.client,
        payoutAmount: contractObj.payoutAmount,
        assignedAt: new Date().toLocaleDateString("en-IN"),
      },
    };

    setAssignedContracts(newAssignments);
    try {
      localStorage.setItem(`zyro_truck_contracts_${user.uid || user.id}`, JSON.stringify(newAssignments));
    } catch {}

    setAssignmentNotice({
      type: "success",
      message: `✅ Contract allocated to truck ${truckPlate}! Active load started.`,
    });
    setTimeout(() => setAssignmentNotice(null), 5000);
  };

  const handleReleaseContract = (truckPlate: string) => {
    const updated = { ...assignedContracts };
    delete updated[truckPlate];
    setAssignedContracts(updated);
    try {
      localStorage.setItem(`zyro_truck_contracts_${user.uid || user.id}`, JSON.stringify(updated));
    } catch {}
    setAssignmentNotice({
      type: "success",
      message: `Contract released for truck ${truckPlate}. The truck is now available for new loads.`,
    });
    setTimeout(() => setAssignmentNotice(null), 4000);
  };

  const activeContractCount = Object.keys(assignedContracts).length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-12">
      {/* Feedback Banner */}
      {assignmentNotice && (
        <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 animate-in slide-in-from-top-2 ${
          assignmentNotice.type === "success" 
            ? "bg-emerald-950/90 border-emerald-500 text-emerald-200" 
            : "bg-amber-950/90 border-amber-500 text-amber-200"
        }`}>
          {assignmentNotice.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="flex-1">{assignmentNotice.message}</span>
          <button
            type="button"
            onClick={() => setAssignmentNotice(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TRUCK OWNER OVERVIEW BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-inner">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">{user.name}</span>
                <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t.verifiedOwner}
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 font-medium mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>{user.city || "Commercial Logistics"}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-950 cursor-pointer active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Truck</span>
          </button>
        </div>

        {/* Clean, Real Fleet Statistics Counters */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/90 grid grid-cols-3 gap-2 text-[11px] bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Fleet Size</span>
            <span className="font-bold text-white text-xs">{trucksList.length} Vehicle(s)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Active Contracts</span>
            <span className="font-bold text-emerald-400 text-xs">{activeContractCount}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Completed Trips</span>
            <span className="font-bold text-slate-200 text-xs">0 Trips</span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 grid grid-cols-3 text-xs shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab("fleet")}
          className={`py-2 rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "fleet"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>My Trucks ({trucksList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contracts")}
          className={`py-2 rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "contracts"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Load Contracts ({activeContractCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("earnings")}
          className={`py-2 rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "earnings"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Earnings & Bank</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {/* 3A. MY FLEET TAB */}
      {activeTab === "fleet" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Attached Trucks & Commercial Vehicles
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Attach New Vehicle</span>
            </button>
          </div>

          {trucksList.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No vehicles added yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Attach your commercial truck, pickup, or mini-truck to get dedicated B2B load contracts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Attach Your First Truck</span>
              </button>
            </div>
          ) : (
            trucksList.map((truck, idx) => {
              const currentActiveContract = assignedContracts[truck.registrationNumber];

              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 shrink-0">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-300 bg-indigo-950/90 px-2 py-0.5 rounded border border-indigo-800/80 inline-block mb-1">
                          {truck.truckType}
                        </span>
                        <h4 className="text-xs font-black text-white">{truck.brandModel}</h4>
                        <p className="font-mono text-[11px] text-emerald-400 font-bold tracking-wider">
                          {truck.registrationNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {currentActiveContract ? (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Contract Active</span>
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-700">
                          Available for Load
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Mfg: {truck.manufacturingDate}
                      </span>
                    </div>
                  </div>

                  {/* Active Contract Details on this Truck */}
                  {currentActiveContract && (
                    <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-2.5 text-xs text-emerald-200 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                          Active Freight Contract
                        </span>
                        <p className="font-bold truncate">{currentActiveContract.contractTitle}</p>
                        <p className="text-[10px] text-slate-300">Client: {currentActiveContract.client}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleReleaseContract(truck.registrationNumber)}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-rose-500/30 flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Release this contract to free truck for other loads"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Complete / Release</span>
                      </button>
                    </div>
                  )}

                  {/* Truck specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Payload:</span>
                      <span className="font-bold text-slate-200">{truck.loadCapacity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Status:</span>
                      <span className={`font-bold ${currentActiveContract ? "text-emerald-400" : "text-indigo-300"}`}>
                        {currentActiveContract ? "On Contract" : "Available"}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">Base Location:</span>
                      <span className="font-bold text-slate-200 truncate block">{truck.location}</span>
                    </div>
                  </div>

                  {truck.registrationDetails && (
                    <div className="text-[10px] text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{truck.registrationDetails}</span>
                    </div>
                  )}

                  {/* Quick Action */}
                  {!currentActiveContract && (
                    <div className="pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTruckForAssignment(truck.registrationNumber);
                          setActiveTab("contracts");
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Find & Assign Load Contract</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 3B. LOAD CONTRACTS TAB */}
      {activeTab === "contracts" && (
        <div className="space-y-4">
          {/* Active Contracts Summary Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              My Active Load Contracts ({activeContractCount})
            </h3>

            {activeContractCount === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-xs space-y-1">
                <Briefcase className="w-6 h-6 mx-auto text-slate-500" />
                <p className="font-bold text-slate-300">No active contracts yet</p>
                <p className="text-slate-500 text-[11px]">
                  Choose from available B2B freight loads below or contact support for direct enterprise allocation.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(assignedContracts).map(([plate, details]: [string, ContractAssignment]) => (
                  <div
                    key={plate}
                    className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 inline-block mb-1">
                          Active Contract
                        </span>
                        <h4 className="text-xs font-black text-white">{details.contractTitle}</h4>
                        <p className="text-[11px] text-slate-300">{details.client}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-emerald-400 block">
                          Truck: {plate}
                        </span>
                        <span className="text-[10px] text-slate-400">Assigned: {details.assignedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40">
                      <span className="text-xs font-bold text-emerald-300">
                        Payout: ₹{details.payoutAmount} / trip
                      </span>
                      <button
                        type="button"
                        onClick={() => handleReleaseContract(plate)}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold px-3 py-1 rounded-xl border border-rose-500/30 cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Complete / Release Contract</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Direct Support Contact Card for Load Contract (Requirements 4 & 5) */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/50 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Contact for Load Contract
                </h4>
                <p className="text-[11px] text-slate-300">
                  Dedicated truck attachment & B2B contract onboarding support
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {/* Phone Dialer Action Button */}
              <a
                href="tel:7419263136"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call: 7419263136</span>
              </a>

              {/* Email App Action Button */}
              <a
                href="mailto:manojgupta.caadv@gmail.com?subject=Zyro%20Truck%20Load%20Contract%20Inquiry"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95 text-xs truncate"
              >
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Email: manojgupta.caadv@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Available B2B Freight Loads Catalog */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Available Freight Load Opportunities
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                {availableContracts.length} Verified Contracts
              </span>
            </div>

            {availableContracts.map((contract) => {
              // Check if any truck is currently assigned to this contract
              const assignedPlate = Object.keys(assignedContracts).find(
                (p) => assignedContracts[p]?.contractId === contract.id
              );

              return (
                <div
                  key={contract.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-black uppercase text-indigo-300 bg-indigo-950/90 px-2 py-0.5 rounded border border-indigo-800/80 inline-block mb-1">
                        {contract.tonnage}
                      </span>
                      <h4 className="text-xs font-black text-white">{contract.title}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold">{contract.client}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-400 block">
                        {contract.payLabel}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">
                        {contract.tripsPerDay}
                      </span>
                    </div>
                  </div>

                  {/* Route & timing */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Navigation className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{contract.route}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{contract.timing}</span>
                    </div>
                  </div>

                  {/* Contract perks */}
                  <div className="flex flex-wrap gap-1">
                    {contract.perks.map((perk, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{perk}</span>
                      </span>
                    ))}
                  </div>

                  {/* Assignment Control */}
                  <div className="pt-2 border-t border-slate-800">
                    {assignedPlate ? (
                      <div className="w-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold py-2 rounded-xl text-xs flex items-center justify-between px-3">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Allocated to Truck {assignedPlate}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleReleaseContract(assignedPlate)}
                          className="text-[10px] text-rose-300 hover:underline font-bold cursor-pointer"
                        >
                          Release
                        </button>
                      </div>
                    ) : trucksList.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Attach a Truck to Accept This Contract</span>
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <select
                          value={selectedTruckForAssignment}
                          onChange={(e) => setSelectedTruckForAssignment(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 flex-1"
                        >
                          <option value="">-- Select Truck to Assign --</option>
                          {trucksList.map((tItem) => {
                            const isAlreadyAssigned = Boolean(assignedContracts[tItem.registrationNumber]);
                            return (
                              <option
                                key={tItem.registrationNumber}
                                value={tItem.registrationNumber}
                                disabled={isAlreadyAssigned}
                              >
                                {tItem.registrationNumber} - {tItem.brandModel} {isAlreadyAssigned ? "(Already on Contract)" : "(Available)"}
                              </option>
                            );
                          })}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleAssignContractToTruck(contract.id, selectedTruckForAssignment)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Contract</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3C. EARNINGS & BANK TAB */}
      {activeTab === "earnings" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-200">Owner Revenue & Payout Ledger</h3>
              <span className="text-[10px] text-slate-400">Real verified settlement</span>
            </div>

            {/* Clean Real Stats - No Fake Revenue Numbers */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">Total Earned</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{user.totalEarned || 0}
                </span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">Completed Trips</span>
                <span className="text-base font-black text-white">0 Trips</span>
              </div>
            </div>

            {user.totalEarned === 0 && (
              <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-3 text-center text-xs text-slate-400">
                <p className="font-bold text-slate-300">No earnings yet</p>
                <p className="text-[11px]">Payouts will reflect automatically once completed trips are logged under your active contracts.</p>
              </div>
            )}
          </div>

          {/* Clean Add Bank Account Section (Requirement 6) */}
          <BankAccountCard
            user={user}
            onUpdateUser={onUpdateUser}
            title="Bank Account for Truck Payouts"
            theme="dark"
          />
        </div>
      )}

      {/* 4. MODAL: ADD / ATTACH NEW TRUCK */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Attach / List New Truck</h3>
                  <p className="text-[10px] text-slate-400">Register vehicle for B2B loads & contracts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewTruckSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Truck Category / Type
                </label>
                <select
                  value={newTruckType}
                  onChange={(e) => setNewTruckType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Tata Ace / Chota Hathi (1 Ton)">Tata Ace / Chota Hathi (1 Ton)</option>
                  <option value="Mahindra Bolero Pickup (1.5 Ton)">Mahindra Bolero Pickup (1.5 Ton)</option>
                  <option value="Ashok Leyland Dost / Bada Dost (2 Ton)">Ashok Leyland Dost / Bada Dost (2 Ton)</option>
                  <option value="Euler HiLoad EV 3-Wheeler Cargo">Euler HiLoad EV 3-Wheeler Cargo</option>
                  <option value="14ft - 19ft Closed Container Truck">14ft - 19ft Closed Container Truck</option>
                  <option value="Multi-Axle Heavy Commercial Truck (10+ Ton)">Multi-Axle Heavy Commercial Truck (10+ Ton)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Brand & Model *
                  </label>
                  <input
                    type="text"
                    value={newBrandModel}
                    onChange={(e) => setNewBrandModel(e.target.value)}
                    placeholder="e.g. Tata Motors Ace Gold"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Mfg Year *
                  </label>
                  <input
                    type="text"
                    value={newMfgYear}
                    onChange={(e) => setNewMfgYear(e.target.value)}
                    placeholder="e.g. 2023"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Registration Plate Number *
                  </label>
                  <input
                    type="text"
                    value={newPlateNumber}
                    onChange={(e) => setNewPlateNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. DL-01-TX-9988"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 uppercase"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Payload Capacity
                  </label>
                  <input
                    type="text"
                    value={newLoadCapacity}
                    onChange={(e) => setNewLoadCapacity(e.target.value)}
                    placeholder="e.g. 1.0 Ton (1000 kg)"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Registration Details / RC Fitness
                </label>
                <input
                  type="text"
                  value={newRegDetails}
                  onChange={(e) => setNewRegDetails(e.target.value)}
                  placeholder="e.g. Commercial Yellow Plate • RC Fitness Active"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Availability
                  </label>
                  <select
                    value={newAvailability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Immediate / Daily On-Demand">Immediate / Daily On-Demand</option>
                    <option value="Monthly Dedicated Contract">Monthly Dedicated Contract</option>
                    <option value="Part-Time Night Shifts">Part-Time Night Shifts</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Base Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Okhla Logistics Park"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attach Truck & Start Earning</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
