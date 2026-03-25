const express = require("express");
const WasteRequest = require("../models/WasteRequest");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/* 🔥 CREATE REQUEST */
router.post("/request", async (req, res) => {
  try {
    const newRequest = await WasteRequest.create({
      recyclerId: req.body.recyclerId,
      generatorId: req.body.generatorId,
      contact: req.body.contact,
      wasteType: req.body.wasteType,
      quantity: req.body.quantity,
      status: "PENDING"
    });

    res.json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Request creation failed" });
  }
});

const Recycler = require("../models/Recycler");

router.get("/requests", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recycler") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔥 STEP 1: Find recycler profile using userId
    const recycler = await Recycler.findOne({ userId: req.user.id });

    if (!recycler) {
      return res.status(404).json({ message: "Recycler profile not found" });
    }

    // 🔥 STEP 2: Fetch requests for this recycler
    const requests = await WasteRequest.find({
      recyclerId: recycler._id
    });

    res.json(requests);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/request/:id", async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});
/* 🔥 UPDATE request status */
router.put("/request/:id", async (req, res) => {
  try {
    const updated = await WasteRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});
/* 🔥 GET requests for specific generator */
router.get("/generator/requests", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "generator") {
      return res.status(403).json({ message: "Access denied" });
    }

    const requests = await WasteRequest.find({
      generatorId: req.user.id
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;