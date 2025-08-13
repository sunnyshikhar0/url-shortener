import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import { getAllStoredUrls, redirectShortUrl, shortenUrl, deleteUrl } from "./Controllers/longurl.js";

dotenv.config()

const app = express(); 

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "Shorten_URL",
  })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// API Routes
// Home Api route / Health Check
app.get("/api", (_, res) => {
  res.json({
    message: "URL Shortener API is running",
  });
});

// Create short URL
app.post("/api/shorten", shortenUrl);

// Redirect route - handles the actual short URL redirection
app.get("/:shortId", redirectShortUrl);

// Get all URLs
app.get("/api/urls", getAllStoredUrls);

// Delete a URL
app.delete("/api/urls/:id", deleteUrl);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});