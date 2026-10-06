import React, { useState } from "react";
import { UserProfile, AppLanguage, RentalBooking } from "../types";
import { translations } from "../data/translations";
import { 
  X, 
  Wallet, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  IndianRupee, 
  CreditCard, 
  Sparkles,
  RotateCcw
} from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activeBooking: RentalBooking | null;
  language: AppLanguage;
  onAddMoney: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onRefundDeposit: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  user,
  activeBooking,
  language,
  onAddMoney,
  onWithdraw,
  onRefundDeposit,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const [addAmount, setAddAmount] = useState<number>(500);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [activeTab, setActiveTab] = useState<"overview" | "add" | "withdraw">("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" />
            <span>Zyro Smart Wallet & Escrow</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-xs text-slate-400">Available Cash Balance</div>
              <div className="text-3xl font-black text-white">₹{user.walletBalance}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Escrow Security Deposit</div>
              <div className="text-xl font-extrabold text-amber-300">
                ₹{user.securityDepositInEscrow}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-emerald-600 border-b-2 border-emerald-600 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview & Escrow
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === "add"
                ? "bg-white text-emerald-600 border-b-2 border-emerald-600 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            + Add Funds
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === "withdraw"
                ? "bg-white text-emerald-600 border-b-2 border-emerald-600 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Withdraw to UPI / Bank
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
          {toastMessage && (
            <div className="bg-emerald-600 text-white font-bold p-3 rounded-xl flex items-center justify-between">
              <span>{toastMessage}</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Escrow Deposit Card */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm">
                        Security Deposit Escrow Account
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        100% held securely for active vehicle rentals
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-amber-950">
                    ₹{user.securityDepositInEscrow}
                  </span>
                </div>

                <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Status: Safe in Escrow</span>
                  {user.securityDepositInEscrow > 0 && (
                    <button
                      onClick={() => {
                        onRefundDeposit();
                        showToast("Deposit refunded to Main Wallet balance!");
                      }}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Claim Instant Refund</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Lifetime Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Total Gig Earnings
                  </div>
                  <div className="text-lg font-black text-emerald-600 mt-1">
                    ₹{user.totalEarned ? user.totalEarned.toLocaleString("en-IN") : "0"}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Total Vehicle Rent
                  </div>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    ₹{user.totalSpentOnRent ? user.totalSpentOnRent.toLocaleString("en-IN") : "0"}
                  </div>
                </div>
              </div>

              {/* KYC Status Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">KYC Verification</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] space-y-1">
                  <div>• Aadhaar: {user.aadhaarNumber || "Verified at Registration"}</div>
                  <div>• Driving License: {user.licenseNumber || user.licenceNumber || "Verified at Registration"}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "add" && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Enter Amount to Add (₹):
                </label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-lg font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAddAmount(amt)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  onAddMoney(addAmount);
                  showToast(`₹${addAmount} added to wallet successfully!`);
                  setActiveTab("overview");
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-md text-sm cursor-pointer"
              >
                Pay & Add via UPI / Netbanking
              </button>
            </div>
          )}

          {activeTab === "withdraw" && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Withdraw to Bank / UPI (₹):
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  max={user.walletBalance}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-lg font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Available to withdraw: ₹{user.walletBalance}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">Transfer Destination:</div>
                <div className="text-slate-700 text-[11px] font-semibold">
                  {user.bankAccount 
                    ? `Bank: ${user.bankAccount.bankName} (${user.bankAccount.accountNumberMasked})`
                    : "Direct Bank Transfer / Registered UPI"}
                </div>
                <div className="text-emerald-700 text-[11px] font-semibold">
                  Instant IMPS settlement within 60 seconds
                </div>
              </div>

              <button
                onClick={() => {
                  if (withdrawAmount > user.walletBalance) {
                    showToast("Insufficient balance!");
                    return;
                  }
                  onWithdraw(withdrawAmount);
                  showToast(`₹${withdrawAmount} withdrawn to UPI successfully!`);
                  setActiveTab("overview");
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md text-sm cursor-pointer"
              >
                Confirm Instant Cashout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
