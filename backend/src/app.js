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

app.use(
  cors({
    origin: configuredOrigins.length > 0
      ? [...new Set(configuredOrigins)]
      : "*",
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