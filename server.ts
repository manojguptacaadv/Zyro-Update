import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize GoogleGenAI client if API key is present
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "WorkRide",
    aiEnabled: !!process.env.GEMINI_API_KEY,
    supabaseConfigured: !!(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
    timestamp: new Date().toISOString(),
  });
});

// Supabase Public Config endpoint (Exposes ONLY public URL and public anon key)
app.get("/api/config/supabase", (_req, res) => {
  res.json({
    supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
  });
});

// AI Advisor for gig earnings, vehicle choice and smart route/job planning
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { city, preferredJobType, preferredVehicle, dailyHours, targetEarning, language } = req.body;

    const ai = getGenAI();
    if (!ai) {
      // Return smart calculated fallback advice
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
            "Opt for Electric Scooters with Unlimited Battery Swap to save up to ₹3,500/month on petrol.",
            "Work peak grocery & food delivery slots (12 PM - 3 PM and 7 PM - 11 PM) for 1.5x surge pay.",
            "Keep daily rental active on a weekly plan to unlock 15% discount on rental tariffs.",
          ],
          bestJobMatches: ["Quick Grocery (Blinkit/Zepto)", "Food Delivery (Zomato/Swiggy)", "E-Commerce Courier"],
        },
      });
    }

    const prompt = `You are "WorkRide Saathi", an expert Indian gig-economy and commercial vehicle rental consultant for the WorkRide platform.
The user wants smart advice to start working and renting a vehicle.
User Details:
- City: ${city || "Delhi NCR"}
- Preferred Job Category: ${preferredJobType || "Food / Quick Grocery Delivery"}
- Preferred Vehicle: ${preferredVehicle || "EV Scooter (Lithium Swap)"}
- Daily Work Hours: ${dailyHours || 8}
- Target Daily Income: ₹${targetEarning || 1200}
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
        systemInstruction:
          "You are WorkRide's AI Gig & Rental advisor. You calculate accurate figures in Indian Rupees (INR) for Indian gig platforms like Zomato, Swiggy, Blinkit, Zepto, Porter, Amazon Flex, and EV rental fleets like Yulu, Bounce, Ather, Hero Electric.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      isFallback: false,
      recommendation: parsed,
    });
  } catch (error: any) {
    console.error("AI Advisor error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI advice",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WorkRide server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
