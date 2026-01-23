require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const Enquiry = require("./models/Enquiry");
const adminRoutes = require("./routes/admin");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("🚀 GyaanBotics Backend is running successfully");
});


// ---------------- MONGODB CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ---------------- EMAIL CONFIG (RENDER-SAFE) ----------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // MUST be false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ---------------- CONTACT FORM API ----------------
app.post("/enquiry", async (req, res) => {
  try {
    // Save enquiry to DB
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    // Send email notification
    await transporter.sendMail({
      from: `"GyaanBotics" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: "📩 New GyaanBotics Enquiry",
      html: `
        <h3>New Enquiry Received</h3>
        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>School:</b> ${req.body.school || "-"}</p>
        <p><b>Email:</b> ${req.body.email}</p>
        <p><b>Phone:</b> ${req.body.phone || "-"}</p>
        <p><b>Message:</b> ${req.body.message || "-"}</p>
      `
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ Enquiry error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- ADMIN ROUTES ----------------
app.use("/admin", adminRoutes);

// ---------------- START SERVER (RENDER COMPATIBLE) ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
