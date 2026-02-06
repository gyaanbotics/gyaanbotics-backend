const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const Enquiry = require("../models/Enquiry");

// Email transporter (optional)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
});

// POST: Save enquiry
router.post("/", async (req, res) => {
  try {
    console.log("📦 BODY RECEIVED:", req.body);

    const { name, email, phone, organization, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Basic phone validation (India)
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      organization,
      message,
    });

    await enquiry.save();

    // Email (non-blocking, optional)
    try {
      await transporter.sendMail({
        from: `"GyaanBotics Website" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "📩 New Enquiry Received",
        html: `
          <h2>New Enquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Organization:</b> ${organization || "-"}</p>
          <p><b>Message:</b><br>${message}</p>
        `,
      });
    } catch (mailErr) {
      console.error("❌ Email failed:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
    });

  } catch (err) {
    console.error("❌ Enquiry error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
