import mongoose from "mongoose";

// URL Schema
const longUrlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const LongUrl = mongoose.model("LongUrl", longUrlSchema);
