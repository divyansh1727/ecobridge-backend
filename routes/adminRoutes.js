const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protect, isAdmin, getDashboardStats);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/users/:id", protect, isAdmin, updateUserRole);

module.exports = router;