const express = require("express");
const cors = require("cors");
require("dotenv").config();

/* ---------------- IMPORTS ---------------- */
const connectDB = require("./config/db");
const wasteRoutes = require("./routes/wasteRoutes");
const authRoutes = require("./routes/authRoutes");     // 👈 ADD
const adminRoutes = require("./routes/adminRoutes");   // 👈 ADD

const app = express();

/* ---------------- CONNECT DATABASE ---------------- */
connectDB();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/waste", wasteRoutes);
app.use("/api/auth", authRoutes);     // 👈 LOGIN / REGISTER
app.use("/api/admin", adminRoutes);   // 👈 ADMIN PANEL

/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("EcoBridge Backend is running 🚀");
});

/* ---------------- GLOBAL ERROR HANDLER (OPTIONAL BUT PRO) ---------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});