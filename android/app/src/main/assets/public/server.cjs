var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGenAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "WorkRide",
    aiEnabled: !!process.env.GEMINI_API_KEY,
    supabaseConfigured: !!(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/config/supabase", (_req, res) => {
  res.json({
    supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""
  });
});
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { city, preferredJobType, preferredVehicle, dailyHours, targetEarning, language } = req.body;
    const ai = getGenAI();
    if (!ai) {
      const hours = Number(dailyHours) || 8;
      const target = Number(targetEarning) || 1200;
      const estDeliveries = Math.round(hours * 2.5);
      const grossIncome = estDeliveries * 45 + Math.min(250, hours * 30);
      const rentalCost = preferredVehicle === "electric_scooter" ? 180 : preferredVehicle === "bike" ? 220 : 250;
      const fuelOrSwap = preferredVehicle === "electric_scooter" ? 50 : 150;
      const netProfit = grossIncome - rentalCost - fuelOrSwap;
      return res.json({
        success: true,
        isFallback: true,
        recommendation: {
          summary: `WorkRide AI Plan for ${city || "your city"}: Work ${hours} hrs with a ${preferredVehicle || "EV Scooter"} for maximum net savings.`,
          estimatedDeliveries: estDeliveries,
          grossDaily: grossIncome,
          vehicleRentalDaily: rentalCost,
          fuelOrChargingCost: fuelOrSwap,
          netDailyProfit: netProfit,
          monthlyPotential: netProfit * 26,
          tips: [
            "Opt for Electric Scooters with Unlimited Battery Swap to save up to \u20B93,500/month on petrol.",
            "Work peak grocery & food delivery slots (12 PM - 3 PM and 7 PM - 11 PM) for 1.5x surge pay.",
            "Keep daily rental active on a weekly plan to unlock 15% discount on rental tariffs."
          ],
          bestJobMatches: ["Quick Grocery (Blinkit/Zepto)", "Food Delivery (Zomato/Swiggy)", "E-Commerce Courier"]
        }
      });
    }
    const prompt = `You are "WorkRide Saathi", an expert Indian gig-economy and commercial vehicle rental consultant for the WorkRide platform.
The user wants smart advice to start working and renting a vehicle.
User Details:
- City: ${city || "Delhi NCR"}
- Preferred Job Category: ${preferredJobType || "Food / Quick Grocery Delivery"}
- Preferred Vehicle: ${preferredVehicle || "EV Scooter (Lithium Swap)"}
- Daily Work Hours: ${dailyHours || 8}
- Target Daily Income: \u20B9${targetEarning || 1200}
- Preferred Response Language: ${language || "Hinglish (mix of Hindi and English)"}

Provide a structured, encouraging, and accurate daily financial breakdown and strategy for gig workers.
Respond ONLY in valid JSON with this exact structure:
{
  "summary": "Short 2-3 sentence overview in the requested language explaining the best strategy.",
  "estimatedDeliveries": number,
  "grossDaily": number,
  "vehicleRentalDaily": number,
  "fuelOrChargingCost": number,
  "netDailyProfit": number,
  "monthlyPotential": number,
  "topPicksExplanation": "1-2 sentences on why this vehicle + job combo is most profitable.",
  "tips": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"],
  "bestJobMatches": ["Job 1 with company name", "Job 2 with company name", "Job 3 with company name"]
}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are WorkRide's AI Gig & Rental advisor. You calculate accurate figures in Indian Rupees (INR) for Indian gig platforms like Zomato, Swiggy, Blinkit, Zepto, Porter, Amazon Flex, and EV rental fleets like Yulu, Bounce, Ather, Hero Electric."
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      isFallback: false,
      recommendation: parsed
    });
  } catch (error) {
    console.error("AI Advisor error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI advice"
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WorkRide server running at http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
