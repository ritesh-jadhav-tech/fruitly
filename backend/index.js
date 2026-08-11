import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./Database/prismaClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./Routes/Auth.routes.js";
import filerouter from "./Routes/Image.routes.js";
import datarouter from "./Routes/Data.routes.js";
import InfoRouter from "./Routes/Info.routes.js";
import OrderRouter from "./Routes/Order.routes.js";
import productsRouter from "./Routes/Products.routes.js";
import categoryRouter from "./Routes/Category.routes.js";
import adminRouter from "./Routes/Admin.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://grocery-management-jet.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.) or from localhost/127.0.0.1
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        console.error("CORS blocked request from origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Serve uploaded images ───────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "FruitMart API is running", version: "1.0.0" }));

// ── Auth routes ──────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);

// ── Public product & category routes ─────────────────────────────────────────
app.use("/products", productsRouter);
app.use("/categories", categoryRouter);

// ── File upload routes (Vendor only) ─────────────────────────────────────────
app.use("/file", filerouter);

// ── Data routes (authenticated) ───────────────────────────────────────────────
app.use("/data", datarouter);

// ── Order routes (authenticated) ──────────────────────────────────────────────
app.use("/order", OrderRouter);

// ── Info / feedback routes ────────────────────────────────────────────────────
app.use("/info", InfoRouter);

// ── Admin routes (Vendor only) ────────────────────────────────────────────────
app.use("/admin", adminRouter);

// ── Start server ─────────────────────────────────────────────────────────────
prisma
  .$connect()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`✅ SERVER IS RUNNING ON PORT ${process.env.PORT || 3000}`);
      // console.log(`   Frontend allowed: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  });
