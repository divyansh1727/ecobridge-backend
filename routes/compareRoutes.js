const axios = require("axios");
const express = require("express");
const Recycler = require("../models/Recycler");

const router = express.Router();

router.post("/compare", async (req, res) => {
const { wasteType, quantity, latitude, longitude } = req.body;

if (!latitude || !longitude) {
return res.status(400).json({ message: "Location not provided" });
}

try {


/* ---------------------------
   STEP 1 — Fetch DB recyclers
----------------------------*/
let recyclers = await Recycler.find({
  wasteType: { $regex: new RegExp(`^${wasteType}$`, "i") },
  availability: true,
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      $maxDistance: 1000000
    }
  }
});

console.log("DB recyclers found:", recyclers.length);

/* ---------------------------
   STEP 2 — Calculate distance & score
----------------------------*/
const enriched = recyclers.map((r) => {

  const [lng, lat] = r.location.coordinates;

  const earthRadius = 6371;

  const dLat = (lat - latitude) * (Math.PI / 180);
  const dLng = (lng - longitude) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latitude * (Math.PI / 180)) *
    Math.cos(lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = earthRadius * c;

  const totalEarning = r.pricePerKg * quantity;

  const score = totalEarning - distanceKm * 2;

  return {
    _id: r._id,
    name: r.name,
    pricePerKg: r.pricePerKg,
    minQuantity: r.minQuantity,
    processingMethod: r.processingMethod,
    distanceKm: distanceKm.toFixed(2),
    totalEarning,
    score,
    source: "Platform"
  };
});

enriched.sort((a, b) => b.score - a.score);

if (enriched.length > 0) {
  enriched[0].recommended = true;
}

/* ---------------------------
   STEP 3 — Fetch Google recyclers
----------------------------*/
let apiRecyclers = [];

try {
  const googleRes = await axios.get(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    {
      params: {
        location: `${latitude},${longitude}`,
        radius: 5000,
        keyword: `${wasteType} recycling scrap`,
        key: process.env.GOOGLE_API_KEY
      }
    }
  );

  console.log("Google results:", googleRes.data.results.length);

  apiRecyclers = googleRes.data.results.slice(0, 5).map((place, index) => ({
    _id: "g_" + index,
    name: place.name,
    pricePerKg: 20,
    minQuantity: 0,
    processingMethod: "Google Recycler",
    distanceKm: place.vicinity || "-",
    totalEarning: quantity * 20,
    score: 0,
    source: "Google",
    rating: place.rating || null,
    placeId: place.place_id
  }));

} catch (err) {
  console.log("Google fetch failed:", err.message);
}

/* ---------------------------
   STEP 4 — Fallback
----------------------------*/
if (apiRecyclers.length === 0) {
  apiRecyclers.push({
    _id: "g_demo1",
    name: "Nearby Scrap Dealer",
    pricePerKg: 18,
    minQuantity: 0,
    processingMethod: "External Recycler",
    distanceKm: "-",
    totalEarning: quantity * 18,
    score: 0,
    source: "Google",
    rating: "4.0"
  });
}

/* ---------------------------
   STEP 5 — Merge results
----------------------------*/
const allRecyclers = [...enriched, ...apiRecyclers];

res.json(allRecyclers);


} catch (err) {
console.error(err);
res.status(500).json({ message: "Server Error" });
}
});

module.exports = router;
