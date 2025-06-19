// utils/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUrl = process.env.ATLAS_URI || "mongodb://127.0.0.1:27017/eimihub";

  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
