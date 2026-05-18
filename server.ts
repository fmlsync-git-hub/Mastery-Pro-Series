import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Paystack Helper
const initializePaystack = async (email: string, amount: number, level: string, courseId: string, metadata: any, origin: string) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY not configured");

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount,
      callback_url: `${origin}/?payment_status=success&level=${level}&courseId=${courseId}`,
      metadata,
      currency: "GHS", // Or USD depending on your account
    },
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data; // { authorization_url, access_code, reference }
};

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/create-checkout-session", async (req, res) => {
  const { userId, userEmail, level, courseId, origin } = req.body;
  
  try {
    const amount = parseInt(process.env.PRICE_ADVANCED_EXAM || "9900");
    const metadata = {
      userId,
      level,
      courseId,
      custom_fields: [
        { display_name: "Course", variable_name: "course", value: courseId },
        { display_name: "Level", variable_name: "level", value: level }
      ]
    };

    const paystackData = await initializePaystack(userEmail, amount, level, courseId, metadata, origin);
    
    // We append the level to the success URL in the client side handling usually, 
    // but Paystack works slightly differently with references.
    // For simplicity, we'll store specific intent in metadata.
    
    res.json({ id: paystackData.reference, url: paystackData.authorization_url });
  } catch (err: any) {
    console.error("Paystack Init Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

// Production/Development middleware
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
