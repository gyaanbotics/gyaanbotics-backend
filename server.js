const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Enquiry = require("./models/Enquiry");

const app = express();
const PORT = process.env.PORT || 10000;

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

/* ================= AUTH ================= */
function authenticateAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    next();
  });
}

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("GyaanBotics Backend Running");
});

/* -------- SAVE ENQUIRY -------- */
app.post("/contact/enquiry", async (req, res) => {
  try {
    console.log("📦 BODY RECEIVED:", req.body);

    const { name, email, organization, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const enquiry = new Enquiry({
      name,
      email,
      organization,
      message
    });

    await enquiry.save();

    // Email (non-blocking)
    try {
      await transporter.sendMail({
        from: `"GyaanBotics Website" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "📩 New Enquiry Received",
        html: `
          <h2>New Enquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Organization:</b> ${organization || "-"}</p>
          <p><b>Message:</b><br>${message}</p>
        `
      });
    } catch (e) {
      console.error("❌ Email failed:", e.message);
    }

    res.json({ message: "Enquiry submitted successfully" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- ADMIN FETCH ENQUIRIES -------- */
app.get("/admin/enquiries", authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
