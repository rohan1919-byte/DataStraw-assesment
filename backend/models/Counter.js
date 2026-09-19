const mongoose = require("mongoose");

// A tiny single-purpose collection that hands out the next ticket number.
// Using findOneAndUpdate with $inc keeps this atomic even if two tickets
// are created at the exact same millisecond.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
