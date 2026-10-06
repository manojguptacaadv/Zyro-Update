import React from "react";
import { UserProfile, UserRole, AppLanguage } from "../types";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Receipt, 
  CheckCircle2, 
  LogOut, 
  X, 
  FileText, 
  Award,
  Sparkles,
  Bike,
  Crown
} from "lucide-react";
import { BankAccountCard } from "./BankAccountCard";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  language: AppLanguage;
  onLogout: () => void;
  onOpenWallet: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  onLogout,
  onOpenWallet,
  onUpdateUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-white relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header with profile banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/40 shadow-xl text-2xl font-black shrink-0 overflow-hidden">
              {user.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : user.role === "owner_admin" ? (
                <Crown className="w-8 h-8 text-amber-300" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{user.name}</h2>
                <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>KYC VERIFIED</span>
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-mono flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                <span>{user.phone}</span>
                {user.email && (
                  <>
                    <span>•</span>
                    <span className="text-[11px] truncate">{user.email}</span>
                  </>
                )}
              </p>
              <div className="text-[11px] text-white/80 flex flex-wrap items-center gap-1.5 pt-1">
                <span className="bg-slate-950/60 border border-white/15 px-2 py-0.5 rounded font-black uppercase text-[9px] text-emerald-300">
                  {user.registrationType === "driver"
                    ? "1. Driver"
                    : user.registrationType === "truck_owner"
                    ? "2. Truck / Vehicle Owner"
                    : user.registrationType === "driver_and_truck_owner"
                    ? "3. Driver + Truck Owner"
                    : user.registrationType === "rent_and_drive"
                    ? "4. Rent & Drive"
                    : user.role === "owner_admin"
                    ? "Fleet Owner"
                    : "Gig Partner"}
                </span>
                <span>•</span>
                <span>{user.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Balance & Escrow Highlight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wallet Balance</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                ₹{user.walletBalance}
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenWallet();
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer pt-1 block"
              >
                + Recharge / Withdraw
              </button>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Escrow Security</span>
              </div>
              <div className="text-2xl font-black text-cyan-400">
                ₹{user.securityDepositInEscrow}
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                100% Refundable on return
              </span>
            </div>
          </div>

          {/* Income & Expense History Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>Lifetime Income</span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                ₹{user.totalEarned ? user.totalEarned.toLocaleString() : "0"}
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Receipt className="w-3 h-3 text-rose-400" />
                <span>Total Spent on Rent</span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                ₹{user.totalSpentOnRent ? user.totalSpentOnRent.toLocaleString() : "0"}
              </div>
            </div>
          </div>

          {/* Bank Account Section (Requirement 6) */}
          <BankAccountCard
            user={user}
            onUpdateUser={onUpdateUser}
            title="Registered Bank Account"
            theme="dark"
          />

          {/* Verified KYC Documents & Badges */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Verified KYC Credentials</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                Government Verified
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Driving License:</span>
                <span className="font-mono font-bold text-slate-200">
                  {user.licenseNumber || user.licenceNumber || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Aadhaar (UIDAI):</span>
                <span className="font-mono font-bold text-slate-200">
                  {user.aadhaarNumber || "Verified at Registration"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Safety & Background Check:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Passed (Clear Record)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout / Dusra Account Login Karein</span>
          </button>
        </div>
      </div>
    </div>
  );
};
