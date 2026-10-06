import React, { useState } from "react";
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Wallet, 
  Truck, 
  ArrowRight 
} from "lucide-react";
import { RiderBazaarItem, UserProfile } from "../types";
import { INITIAL_BAZAAR_ITEMS } from "../data/mockData";

interface RiderBazaarModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onBuyItem: (item: RiderBazaarItem, paymentMethod: "wallet" | "cod") => void;
}

export const RiderBazaarModal: React.FC<RiderBazaarModalProps> = ({
  isOpen,
  onClose,
  user,
  onBuyItem,
}) => {
  const [items] = useState<RiderBazaarItem[]>(INITIAL_BAZAAR_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<RiderBazaarItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "cod">("wallet");
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const handlePlaceOrder = () => {
    if (!selectedItem) return;
    onBuyItem(selectedItem, paymentMethod);
    setOrderSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-5 sm:p-6 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShoppingBag className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded">
                  UP TO 50% SUBSIDY
                </span>
                <span className="text-xs text-emerald-200">Delivery Partner Deals</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Rider Bazaar & Safety Gear
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {orderSuccess && selectedItem ? (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">
                Order Placed Successfully! 📦
              </h3>
              <p className="text-sm text-slate-300">
                Aapka order <span className="font-bold text-amber-300">{selectedItem.title}</span> dispatch kar diya gaya hai.
              </p>

              <div className="bg-slate-800 rounded-2xl p-4 text-xs space-y-2 border border-slate-700 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="font-bold text-emerald-400">₹{selectedItem.discountedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Mode:</span>
                  <span className="font-bold text-white uppercase">{paymentMethod === "wallet" ? "Zyro Wallet" : "Cash on Delivery"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <span className="font-bold text-cyan-300">Today within 2 Hours at Hub</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setOrderSuccess(false);
                  setSelectedItem(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : selectedItem ? (
            /* Checkout View */
            <div className="space-y-5">
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold"
              >
                ← Back to Bazaar Catalog
              </button>

              <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 flex flex-col sm:flex-row gap-5 items-center">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-32 h-32 rounded-2xl object-cover border border-slate-600"
                />
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded">
                    {selectedItem.tag || "DEAL"}
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
                  <p className="text-xs text-slate-300">{selectedItem.description}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-2xl font-black text-emerald-400">
                      ₹{selectedItem.discountedPrice}
                    </span>
                    <span className="text-sm line-through text-slate-500">
                      ₹{selectedItem.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      Save ₹{selectedItem.originalPrice - selectedItem.discountedPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === "wallet"
                        ? "bg-emerald-950/80 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/50"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span>Zyro Wallet</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Balance: <span className="text-emerald-400 font-bold">₹{user.walletBalance}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === "cod"
                        ? "bg-emerald-950/80 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/50"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>Cash on Hub Pickup</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Pay at nearest charging hub
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Confirm Purchase (₹{selectedItem.discountedPrice})</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Items Catalog */
            <div className="space-y-4">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                {[
                  { id: "all", label: "All Gear (4)" },
                  { id: "safety", label: "ISI Helmets" },
                  { id: "delivery_bags", label: "Delivery Bags" },
                  { id: "rain_gear", label: "Rain Suits" },
                  { id: "accessories", label: "Mobile Mounts" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/90 border border-slate-700 rounded-3xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500/50 transition-all shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-36 rounded-2xl object-cover border border-slate-700 group-hover:scale-[1.02] transition-transform"
                        />
                        {item.tag && (
                          <span className="absolute top-2 left-2 text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-md shadow">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{item.rating}</span>
                          <span className="text-slate-400">({item.reviewsCount})</span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold">In Stock</span>
                      </div>

                      <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-emerald-400">₹{item.discountedPrice}</div>
                        <div className="text-[11px] line-through text-slate-500">₹{item.originalPrice}</div>
                      </div>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
