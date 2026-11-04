const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base API Test Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", message: "ImpactPulse API is running smoothly." });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;