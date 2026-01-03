const express = require("express");
const router = express.Router();
const Waste = require("../models/Waste");

// ---------------- CREATE WASTE (GENERATOR) ----------------
router.post("/", async (req, res) => {
  try {
    const waste = new Waste({
      ...req.body,
      status: "PENDING",
    });

    await waste.save();

    // 🔥 AI AUTO-MATCH SIMULATION
    setTimeout(async () => {
      await Waste.findByIdAndUpdate(waste._id, {
        status: "MATCHED",
      });
      console.log("AI matched waste:", waste._id);
    }, 3000); // 3 sec delay

    res.status(201).json(waste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET WASTE (RECYCLER DASHBOARD) ----------------
router.get("/", async (req, res) => {
  try {
    const wastes = await Waste.find({
      status: { $in: ["PENDING", "MATCHED"] },
    }).sort({ createdAt: -1 });

    res.status(200).json(wastes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- UPDATE STATUS (ACCEPT / REJECT) ----------------
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate status
    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status update",
      });
    }

    const updatedWaste = await Waste.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedWaste) {
      return res.status(404).json({
        message: "Waste request not found",
      });
    }

    res.status(200).json(updatedWaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
