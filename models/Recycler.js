const mongoose = require("mongoose");

const recyclerSchema = new mongoose.Schema({
  name: String,
  wasteType: String,
  minQuantity: Number,
  pricePerKg: Number,
  processingMethod: String,
  availability: { type: Boolean, default: true },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

// 🔥 VERY IMPORTANT FOR GEO QUERY
recyclerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Recycler", recyclerSchema);