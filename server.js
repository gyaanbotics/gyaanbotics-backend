require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Enquiry = require("./models/Enquiry");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/enquiry", async (req, res) => {
  const enquiry = new Enquiry(req.body);
  await enquiry.save();

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "New GyaanBotics Enquiry",
    html: `<pre>${JSON.stringify(req.body, null, 2)}</pre>`
  });

  res.json({ success: true });
});

app.use("/admin", adminRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
