const express = require('express');
const Url = require('../models/Url');

const router = express.Router();

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// @route   GET /api/analytics/:shortCode
// @desc    Get analytics for a specific URL
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

      // Process click history for analytics
      const clicksByDate = {};
      const clicksByHour = Array(24).fill(0);
      const referrers = {};
      const userAgents = {};

      url.clickHistory.forEach(click => {
        // Clicks by date
        const date = click.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        // Clicks by hour
        const hour = click.timestamp.getHours();
        clicksByHour[hour]++;

        // Referrers
        const referer = click.referer || 'Direct';
        referrers[referer] = (referrers[referer] || 0) + 1;

        // User agents (simplified)
        const ua = click.userAgent || 'Unknown';
        const browser = ua.includes('Chrome') ? 'Chrome' : 
                       ua.includes('Firefox') ? 'Firefox' : 
                       ua.includes('Safari') ? 'Safari' : 'Other';
        userAgents[browser] = (userAgents[browser] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          url: {
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            description: url.description
          },
          analytics: {
            totalClicks: url.clicks,
            clicksByDate,
            clicksByHour,
            referrers,
            userAgents,
            recentClicks: url.clickHistory.slice(-10).reverse()
          }
        }
      });

    } else {
      // Use in-memory storage
      const { urlStorage } = require('../utils/storage');
      const url = urlStorage.get(shortCode);

      if (!url) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found' 
        });
      }

      // Process click history for analytics
      const clicksByDate = {};
      const clicksByHour = Array(24).fill(0);
      const referrers = {};
      const userAgents = {};

      url.clickHistory.forEach(click => {
        // Clicks by date
        const date = new Date(click.timestamp).toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        // Clicks by hour
        const hour = new Date(click.timestamp).getHours();
        clicksByHour[hour]++;

        // Referrers
        const referer = click.referer || 'Direct';
        referrers[referer] = (referrers[referer] || 0) + 1;

        // User agents (simplified)
        const ua = click.userAgent || 'Unknown';
        const browser = ua.includes('Chrome') ? 'Chrome' : 
                       ua.includes('Firefox') ? 'Firefox' : 
                       ua.includes('Safari') ? 'Safari' : 'Other';
        userAgents[browser] = (userAgents[browser] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          url: {
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            description: url.description
          },
          analytics: {
            totalClicks: url.clicks,
            clicksByDate,
            clicksByHour,
            referrers,
            userAgents,
            recentClicks: url.clickHistory.slice(-10).reverse()
          }
        }
      });
    }

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/analytics
// @desc    Get overall analytics
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const totalUrls = await Url.countDocuments();
      const totalClicks = await Url.aggregate([
        { $group: { _id: null, total: { $sum: '$clicks' } } }
      ]);

      const recentUrls = await Url.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('originalUrl shortUrl shortCode clicks createdAt');

      res.json({
        success: true,
        data: {
          totalUrls,
          totalClicks: totalClicks[0]?.total || 0,
          recentUrls
        }
      });

    } else {
      // Use in-memory storage
      const { urlStorage } = require('../utils/storage');
      const urls = Array.from(urlStorage.values());
      
      const totalUrls = urls.length;
      const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
      const recentUrls = urls
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(url => ({
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          shortCode: url.shortCode,
          clicks: url.clicks,
          createdAt: url.createdAt
        }));

      res.json({
        success: true,
        data: {
          totalUrls,
          totalClicks,
          recentUrls
        }
      });
    }

  } catch (error) {
    console.error('Error fetching overall analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
