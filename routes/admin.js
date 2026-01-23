const router = require("express").Router();
const Admin = require("../models/Admin");
const Enquiry = require("../models/Enquiry");

router.post("/login", async (req, res) => {
  const admin = await Admin.findOne(req.body);
  if (!admin) return res.status(401).json({ error: "Invalid" });
  res.json({ success: true });
});

router.get("/enquiries", async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

module.exports = router;
