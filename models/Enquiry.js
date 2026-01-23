const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({
  name: String,
  school: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Enquiry", EnquirySchema);
