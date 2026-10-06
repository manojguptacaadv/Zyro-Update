import React, { useState } from "react";
import { UserProfile, BankAccountDetails } from "../types";
import { 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Edit3, 
  X, 
  Lock
} from "lucide-react";
import { saveUserBankAccountToFirestore } from "../lib/firebase";

interface BankAccountCardProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  title?: string;
  theme?: "dark" | "light";
}

export const BankAccountCard: React.FC<BankAccountCardProps> = ({
  user,
  onUpdateUser,
  title = "Bank Account for Payouts",
  theme = "dark",
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [accountHolderName, setAccountHolderName] = useState<string>(
    user.bankAccount?.accountHolderName || user.name || ""
  );
  const [bankName, setBankName] = useState<string>(
    user.bankAccount?.bankName || ""
  );
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>(
    user.bankAccount?.ifscCode || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const holder = accountHolderName.trim();
    const bank = bankName.trim();
    const acc = accountNumber.replace(/\D/g, "");
    const confirmAcc = confirmAccountNumber.replace(/\D/g, "");
    const ifsc = ifscCode.trim().toUpperCase();

    if (!holder || holder.length < 3) {
      setError("Please enter a valid Account Holder Name (minimum 3 characters).");
      return;
    }
    if (!bank || bank.length < 2) {
      setError("Please enter your Bank Name.");
      return;
    }
    if (!acc || acc.length < 9 || acc.length > 18) {
      setError("Please enter a valid 9 to 18-digit Bank Account Number.");
      return;
    }
    if (acc !== confirmAcc) {
      setError("Account Number and Confirm Account Number do not match.");
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      setError("Please enter a valid 11-character Indian IFSC code (e.g. HDFC0001234, SBIN0004567).");
      return;
    }

    try {
      setLoading(true);
      const uid = user.uid || user.id.replace("user-", "");
      const bankResult = await saveUserBankAccountToFirestore(uid, {
        accountHolderName: holder,
        bankName: bank,
        accountNumber: acc,
        ifscCode: ifsc,
      });

      const updatedUser: UserProfile = {
        ...user,
        bankAccount: bankResult,
      };

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      setSuccess("Bank account verified & saved securely!");
      setIsEditing(false);
      setAccountNumber("");
      setConfirmAccountNumber("");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to save bank account. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`rounded-2xl border p-4 space-y-3 shadow-md ${
      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black tracking-tight">{title}</h4>
            <p className="text-[10px] text-slate-400">Direct settlement & payouts</p>
          </div>
        </div>

        {user.bankAccount ? (
          <button
            type="button"
            onClick={() => {
              setIsEditing(!isEditing);
              setError(null);
            }}
            className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditing ? "Cancel" : "Change Bank"}</span>
          </button>
        ) : (
          !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
            >
              + Add Bank Account
            </button>
          )
        )}
      </div>

      {success && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs p-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Display Existing Saved Bank Account */}
      {!isEditing && user.bankAccount && (
        <div className={`p-3 rounded-xl border text-xs space-y-2 ${
          isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-emerald-400">{user.bankAccount.bankName}</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified for Payouts</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Account Holder:</span>
              <span className="font-bold truncate block">{user.bankAccount.accountHolderName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Account Number:</span>
              <span className="font-mono font-bold tracking-wider">{user.bankAccount.accountNumberMasked}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
              <span className="font-mono font-bold text-slate-300">{user.bankAccount.ifscCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Security:</span>
              <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                <Lock className="w-2.5 h-2.5 text-slate-400" />
                <span>Masked & Encrypted</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State when no bank account is added */}
      {!isEditing && !user.bankAccount && (
        <div className={`p-4 rounded-xl border border-dashed text-center text-xs space-y-1 ${
          isDark ? "border-slate-800 text-slate-400 bg-slate-950/40" : "border-slate-200 text-slate-500 bg-slate-50"
        }`}>
          <CreditCard className="w-6 h-6 mx-auto text-slate-500" />
          <p className="font-bold text-slate-300">No bank account added yet</p>
          <p className="text-[11px]">Add your bank details to receive trip earnings and rental payouts directly.</p>
        </div>
      )}

      {/* Add / Edit Bank Account Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className={`p-4 rounded-xl border space-y-3 animate-in fade-in ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <span className="text-xs font-black text-slate-200">
              {user.bankAccount ? "Update Bank Account" : "Add Bank Account"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="bg-rose-950/80 border border-rose-500/60 text-rose-300 text-[11px] p-2 rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Account Holder Name *
            </label>
            <input
              type="text"
              required
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="As per bank passbook / cheque"
              className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border border-slate-300 text-slate-900"
              }`}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank"
              className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border border-slate-300 text-slate-900"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Account Number *
              </label>
              <input
                type="password"
                required
                maxLength={18}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter account number"
                className={`w-full rounded-xl px-3 py-2 text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Confirm Account Number *
              </label>
              <input
                type="text"
                required
                maxLength={18}
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Re-enter account number"
                className={`w-full rounded-xl px-3 py-2 text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              IFSC Code (11 Characters) *
            </label>
            <input
              type="text"
              required
              maxLength={11}
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g. SBIN0001234, HDFC0000456"
              className={`w-full rounded-xl px-3 py-2 text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark ? "bg-slate-900 border border-slate-800 text-white" : "bg-white border border-slate-300 text-slate-900"
              }`}
            />
          </div>

          <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Account numbers are encrypted and never shown in full publicly.</span>
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <span>Validating & Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Bank Account</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
