const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "complaintDB", // ✅ IMPORTANT
    });
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;