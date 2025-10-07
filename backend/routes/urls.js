const express = require('express');
const { nanoid } = require('nanoid');
const validator = require('validator');
const Url = require('../models/Url');

const router = express.Router();

// In-memory storage for demo (fallback when MongoDB is not available)
const { urlStorage } = require('../utils/storage');

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// @route   POST /api/urls/shorten
// @desc    Create short URL
// @access  Public
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, customAlias, description } = req.body;

    // Validate URL
    if (!originalUrl || !validator.isURL(originalUrl)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid URL' 
      });
    }

    // Generate short code
    let shortCode = customAlias || nanoid(8);
    
    // Check if custom alias already exists
    if (customAlias) {
      if (isMongoConnected()) {
        const existingUrl = await Url.findOne({ shortCode: customAlias });
        if (existingUrl) {
          return res.status(400).json({ 
            success: false, 
            message: 'Custom alias already exists' 
          });
        }
      } else {
        if (urlStorage.has(customAlias)) {
          return res.status(400).json({ 
            success: false, 
            message: 'Custom alias already exists' 
          });
        }
      }
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const shortUrl = `${baseUrl}/${shortCode}`;

    if (isMongoConnected()) {
      // Use MongoDB
      const url = new Url({
        originalUrl,
        shortCode,
        shortUrl,
        customAlias: customAlias || null,
        description: description || ''
      });

      await url.save();

      res.json({
        success: true,
        data: {
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          shortCode: url.shortCode,
          createdAt: url.createdAt,
          description: url.description
        }
      });
    } else {
      // Use in-memory storage
      const urlData = {
        originalUrl,
        shortCode,
        shortUrl,
        clicks: 0,
        clickHistory: [],
        createdAt: new Date(),
        customAlias: customAlias || null,
        description: description || ''
      };

      urlStorage.set(shortCode, urlData);

      res.json({
        success: true,
        data: {
          originalUrl: urlData.originalUrl,
          shortUrl: urlData.shortUrl,
          shortCode: urlData.shortCode,
          createdAt: urlData.createdAt,
          description: urlData.description
        }
      });
    }

  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/urls
// @desc    Get all URLs
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const urls = await Url.find().sort({ createdAt: -1 }).limit(50);
      res.json({
        success: true,
        data: urls
      });
    } else {
      const urls = Array.from(urlStorage.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);
      res.json({
        success: true,
        data: urls
      });
    }
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/urls/:shortCode
// @desc    Get URL details
// @access  Public
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (isMongoConnected()) {
      const url = await Url.findOne({ shortCode });
      if (!url) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found' 
        });
      }
      res.json({
        success: true,
        data: url
      });
    } else {
      const url = urlStorage.get(shortCode);
      if (!url) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found' 
        });
      }
      res.json({
        success: true,
        data: url
      });
    }
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/urls/:shortCode
// @desc    Delete URL
// @access  Public
router.delete('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (isMongoConnected()) {
      const url = await Url.findOneAndDelete({ shortCode });
      if (!url) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found' 
        });
      }
    } else {
      if (!urlStorage.has(shortCode)) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found' 
        });
      }
      urlStorage.delete(shortCode);
    }

    res.json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
