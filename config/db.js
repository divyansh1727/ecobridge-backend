const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
mongoose.connection.on("connected", () => {
  console.log("Connected to DB:", mongoose.connection.name);
  console.log("Mongo URI:", process.env.MONGO_URI);
});

module.exports = connectDB;
