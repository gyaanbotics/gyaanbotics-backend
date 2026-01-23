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

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("🚀 GyaanBotics Backend is running");
});

// ---------------- MONGODB CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ---------------- EMAIL CONFIG ----------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

// ---------------- CONTACT FORM ----------------
app.post("/enquiry", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

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

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Enquiry error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- ADMIN ROUTES ----------------
app.use("/admin", adminRoutes);

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
