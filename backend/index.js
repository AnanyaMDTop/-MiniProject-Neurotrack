import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import reminderRoutes from "./routes/reminders.js";
import authRoutes from "./routes/auth.js";
import peopleRoutes from "./routes/people.js"; 

const app = express();
dotenv.config(); 
app.use(cors());
app.use(express.json());
app.use("/reminders", reminderRoutes);
app.use("/auth", authRoutes);
app.use("/people", peopleRoutes);


// Connect to MongoDB (use MONGO_URI in environment when available)
const MONGO_URI = process.env.MONGO_URI ||
  "mongodb+srv://ananyamd:ananya%40mongodb20@cluster0.iumrn5v.mongodb.net/neuro";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
