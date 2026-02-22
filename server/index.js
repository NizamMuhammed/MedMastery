require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const questionRoutes = require("./routes/questions");

const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/questions", questionRoutes);

// Serve static assets in production
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed (will use in-memory fallback):", err.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
