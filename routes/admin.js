const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Enquiry = require("../models/Enquiry");

// ---------------- ADMIN LOGIN ----------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

// ---------------- AUTH MIDDLEWARE ----------------
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ---------------- PROTECTED ENQUIRIES ----------------
router.get("/enquiries", authMiddleware, async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

module.exports = router;
