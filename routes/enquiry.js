const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Enquiry = require("../models/Enquiry");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

// POST: Save enquiry
router.post("/", async (req, res) => {
  try {
    const { name, email, organization, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Save to MongoDB
    const enquiry = new Enquiry({
      name,
      email,
      organization,
      message
    });

    await enquiry.save();

    // Send email (non-blocking)
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
    } catch (mailErr) {
      console.error("❌ Email failed:", mailErr.message);
    }

    res.json({ message: "Enquiry submitted successfully" });

  } catch (err) {
    console.error("❌ Enquiry error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
