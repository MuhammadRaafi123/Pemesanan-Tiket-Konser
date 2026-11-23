import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import supabase from "./config/supabase.js";
import routes from "./routes/index.js";

import {
  errorHandler,
  notFound,
} from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(
  import.meta.url
);

const __dirname = path.dirname(
  __filename
);


const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
].filter(Boolean);

const isPrivateLanOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    const port = Number(parsed.port);
    if (parsed.protocol !== "http:" || !Number.isInteger(port) || port < 3000 || port > 3010) return false;
    const parts = parsed.hostname.split(".").map(Number);
    if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
    return parts[0] === 10 ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31);
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || configuredOrigins.includes(origin) || isPrivateLanOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin tidak diizinkan oleh CORS"));
    },
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);


// HOME
app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Concert Ticket API is running 🚀",
    });
  }
);

// TEST SUPABASE CONNECTION

app.get(
  "/api/test-db",
  async (req, res) => {
    try {
      const { error } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        message:
          "Backend berhasil terhubung ke Supabase 🎉",
      });
    } catch (error) {
      console.error(
        "Supabase connection error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Backend gagal terhubung ke Supabase",
        error: error.message,
      });
    }
  }
);  


// API ROUTES
app.use(
  "/api",
  routes
);


// NOT FOUND
app.use(notFound);


// ERROR HANDLER
app.use(errorHandler);


export default app;
