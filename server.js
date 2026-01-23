const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRoutes = require("./routes/admin");
const enquiryRoutes = require("./routes/enquiry");

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
  .catch(err => console.error("❌ MongoDB error:", err.message));

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("GyaanBotics Backend Running");
});

app.use("/admin", adminRoutes);
app.use("/contact/enquiry", enquiryRoutes);

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
