const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Admin = require("../models/Admin");
const Enquiry = require("../models/Enquiry");

/* ================= ADMIN LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    console.log("🔐 LOGIN HIT");
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    console.log("ADMIN FROM DB:", admin); // 🔴 VERY IMPORTANT

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
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

/* ================= FETCH ENQUIRIES ================= */
router.get("/enquiries", authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
});

module.exports = router;
