const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Routes
const adminRoutes = require("./routes/admin");
const enquiryRoutes = require("./routes/enquiry");

const app = express();
const PORT = process.env.PORT || 10000;

/* ================= MIDDLEWARE ================= */

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers (VERY IMPORTANT)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ================= BASIC ROUTE ================= */

app.get("/", (req, res) => {
  res.send("GyaanBotics Backend Running");
});

/* ================= ROUTES ================= */

// Admin routes (login, fetch enquiries, etc.)
app.use("/admin", adminRoutes);

// Enquiry route (contact form)
app.use("/contact/enquiry", enquiryRoutes);

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
