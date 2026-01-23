const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

const router = express.Router();

const ADMIN_EMAIL = "admin@gyaanbotics.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("Admin@123", 10);

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL)
    return res.status(401).json({ message: "Invalid credentials" });

  if (!bcrypt.compareSync(password, ADMIN_PASSWORD_HASH))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

router.get("/dashboard", auth, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
