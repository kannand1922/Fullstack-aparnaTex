import express from "express";
import { configDotenv } from "dotenv";
import { authRoutes } from "./routes/userRoute.js";
import cors from "cors";
import dbConnect from "./config/db.js";
import { productsRoutes } from "./routes/productsRoute.js";
import { adminRoutes } from "./routes/adminRoute.js";
import { paymentRoutes } from "./routes/paymentRoutes.js";
configDotenv();

const app = express();

// DB connection
dbConnect();

// CORS setup
app.use(cors({ origin: "*" }));

// Increase request size limit for JSON and URL-encoded bodies
app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Route configuration
app.use("/api/auth", authRoutes);
app.use("/api/prod", productsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    