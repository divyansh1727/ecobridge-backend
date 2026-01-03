const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");          // 👈 MISSING EARLIER
const wasteRoutes = require("./routes/wasteRoutes");

const app = express();

/* ---------------- CONNECT DATABASE ---------------- */
connectDB();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/waste", wasteRoutes);

/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("EcoBridge Backend is running 🚀");
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
