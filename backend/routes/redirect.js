const Url = require('../models/Url');

// In-memory storage reference (same as in urls.js)
const { urlStorage } = require('../utils/storage');

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

module.exports = async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (isMongoConnected()) {
      // Use MongoDB
      const url = await Url.findOne({ shortCode, isActive: true });

      if (!url) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found or inactive' 
        });
      }

      // Check if URL has expired
      if (url.expiresAt && new Date() > url.expiresAt) {
        return res.status(410).json({ 
          success: false, 
          message: 'URL has expired' 
        });
      }

      // Track click
      const clickData = {
        timestamp: new Date(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer')
      };

      await Url.findByIdAndUpdate(url._id, {
        $inc: { clicks: 1 },
        $push: { clickHistory: clickData }
      });

      // Redirect to original URL
      res.redirect(url.originalUrl);

    } else {
      // Use in-memory storage
      const url = urlStorage.get(shortCode);

      if (!url) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found' 
        });
      }

      // Track click
      url.clicks++;
      url.clickHistory.push({
        timestamp: new Date(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer')
      });

      // Redirect to original URL
      res.redirect(url.originalUrl);
    }

  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
