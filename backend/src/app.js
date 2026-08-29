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


app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
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