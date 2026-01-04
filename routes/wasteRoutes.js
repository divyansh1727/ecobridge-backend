const express = require("express");
const router = express.Router();
const Waste = require("../models/Waste");

// ---------------- CREATE WASTE ----------------
router.post("/", async (req, res) => {
  try {
    const waste = new Waste({
      ...req.body,
      status: "PENDING",
    });

    await waste.save();

    // AI simulation
    setTimeout(async () => {
      const current = await Waste.findById(waste._id);
      if (current && current.status === "PENDING") {
        await Waste.findByIdAndUpdate(waste._id, {
          status: "MATCHED",
        });
      }
    }, 3000);

    res.status(201).json(waste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET ALL (RECYCLER DASHBOARD) ----------------
router.get("/", async (req, res) => {
  try {
    const wastes = await Waste.find({ status: { $in:["MATCHED"]},
    });
    res.status(200).json(wastes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET SINGLE (GENERATOR STATUS) ----------------
router.get("/:id", async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    res.json(waste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- UPDATE STATUS ----------------
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedWaste = await Waste.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedWaste) {
      return res.status(404).json({ message: "Waste not found" });
    }

    res.status(200).json(updatedWaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
