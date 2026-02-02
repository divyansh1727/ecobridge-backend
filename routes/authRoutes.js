const express = require("express");
const router = express.Router();

/**
 * TEMP AUTH ROUTE
 * (We will improve this later)
 */
router.post("/login", (req, res) => {
  res.json({
    message: "Auth route working",
    token: "dummy-token",
  });
});

module.exports = router;