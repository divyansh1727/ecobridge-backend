const User = require("../models/User");
const Waste = require("../models/Waste"); // or Project if you use that

exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const waste = await Waste.countDocuments();

    res.json({ users, waste });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: "User role updated" });
};