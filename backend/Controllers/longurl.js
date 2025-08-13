import shortid from "shortid";
import { LongUrl } from "../Models/LongUrl.js";

// Create short URL
export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const shortId = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${shortId}`;

    const urlData = {
      longUrl: originalUrl, // Store as longUrl in database
      shortId,
      shortUrl,
    };

    const data = await LongUrl.create(urlData);

    res.json({
      success: true,
      message: "URL shortened successfully",
      data: {
        shortId: data.shortId,
        longUrl: data.longUrl,
        shortUrl: shortUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Handles the actual short URL redirection
export const redirectShortUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlData = await LongUrl.findOne({ shortId });

    if (!urlData) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    // Redirect to the original URL
    res.redirect(urlData.longUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get all URLs
export const getAllStoredUrls = async (req, res) => {
  try {
    const urls = await LongUrl.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      urls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete a URL
export const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await LongUrl.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }
    res.json({ success: true, message: "URL deleted", id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};