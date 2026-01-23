require("dotenv").config();

// ================== IMPORTS ==================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ================== APP INIT ==================
const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== ROOT ROUTE (IMPORTANT) ==================
app.get("/", (req, res) => {
  res.send("🚀 GyaanBotics Backend is running");
});

// ================== MONGODB CONNECTION ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ================== ENQUIRY MODEL ==================
const EnquirySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

// ================== ENQUIRY ROUTE ==================
app.post("/enquiry", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ message: "Enquiry saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save enquiry" });
  }
});

// ================== ADMIN ROUTES ==================
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// ================== SERVER START ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
