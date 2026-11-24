import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server POS Cafe berjalan dengan baik!",
    timestamp: new Date().toISOString(),
  });
});

// Routes Utama
app.use("/api/auth", authRoutes);

// Error Handler Terpusat
app.use(errorHandler);

export default app;