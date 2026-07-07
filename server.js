require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Model
const Complaint = require("./models/complaint");

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================= ROUTES START =================

// ✅ POST
app.post("/complaint", async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    const saved = await newComplaint.save();
    res.json(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ✅ GET
app.get("/complaint", async (req, res) => {
  try {
    const data = await Complaint.find();
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ✅ DELETE
app.delete("/complaint/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.send("Deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});
// UPDATE complaint (PUT)
app.put("/complaint/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).send(error);
  }
});
// ================= ROUTES END =================

// ✅ Start server (ALWAYS LAST)
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});