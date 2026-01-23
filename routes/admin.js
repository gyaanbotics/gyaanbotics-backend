const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Enquiry = require("../models/Enquiry"); // CASE-SENSITIVE

// Middleware: Admin auth
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    next();
  });
}

// ✅ THIS IS THE MISSING ROUTE
router.get("/enquiries", authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error("❌ Admin enquiry fetch error:", err);
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
});

module.exports = router;
