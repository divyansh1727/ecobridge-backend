const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Recycler = require("../models/Recycler");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      wasteType,
      minQuantity,
      pricePerKg,
      processingMethod,
      availability,
      latitude,
      longitude
    } = req.body;

    // 🔥 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "recycler"
    });

    // 🔥 2. Create Recycler Profile linked to user
    const newRecycler = await Recycler.create({
      name,
      wasteType,
      minQuantity,
      pricePerKg,
      processingMethod,
      availability,
      userId: user._id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    res.status(201).json({
      message: "Recycler registered successfully",
      recycler: newRecycler
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register recycler" });
  }
});

module.exports = router;