const mongoose = require("mongoose");

const wasteRequestSchema = new mongoose.Schema({
  recyclerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recycler",
    required: true
  },

 generatorId: {
  type: String,
  required: true
},

  wasteType: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  contact: String,

  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING"
  }

}, { timestamps: true });

module.exports = mongoose.model("WasteRequest", wasteRequestSchema);