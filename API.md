# LinkShort API Documentation

This document provides comprehensive documentation for the LinkShort URL Shortener API.

## 🌐 Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

## 📋 API Overview

The LinkShort API provides endpoints for:
- URL shortening with custom aliases
- URL redirection
- Analytics and click tracking
- URL management

## 🔐 Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## 📊 Response Format

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## 🔗 URL Shortening Endpoints

### Create Short URL

**POST** `/api/urls/shorten`

Creates a new shortened URL.

#### Request Body
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "customAlias": "my-link",        // Optional
  "description": "My custom link"   // Optional
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| originalUrl | string | Yes | The original URL to shorten |
| customAlias | string | No | Custom alias for the short URL |
| description | string | No | Description for the URL |

#### Response
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com/very-long-url",
    "shortUrl": "http://localhost:5000/my-link",
    "shortCode": "my-link",
    "description": "My custom link",
    "createdAt": "2025-09-29T16:05:00.000Z",
    "clicks": 0
  },
  "message": "URL shortened successfully"
}
```

#### Error Responses
- **400 Bad Request**: Invalid URL format
- **409 Conflict**: Custom alias already exists
- **500 Internal Server Error**: Server error

### Get All URLs

**GET** `/api/urls`

Retrieves all shortened URLs.

#### Response
```json
{
  "success": true,
  "data": [
    {
      "originalUrl": "https://github.com",
      "shortUrl": "http://localhost:5000/github",
      "shortCode": "github",
      "description": "GitHub - Code hosting platform",
      "createdAt": "2025-09-29T16:05:00.000Z",
      "clicks": 1
    }
  ],
  "message": "URLs retrieved successfully"
}
```

## 🔄 Redirection Endpoint

### Redirect to Original URL

**GET** `/:shortCode`

Redirects to the original URL and tracks the click.

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| shortCode | string | Yes | The short code to redirect |

#### Response
- **302 Found**: Redirects to original URL
- **404 Not Found**: Short code not found

#### Headers
The redirect includes tracking headers:
```
Location: https://original-url.com
X-Clicks: 5
X-Created: 2025-09-29T16:05:00.000Z
```

## 📈 Analytics Endpoints

### Get URL Analytics

**GET** `/api/analytics/:shortCode`

Retrieves detailed analytics for a specific short URL.

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| shortCode | string | Yes | The short code to analyze |

#### Response
```json
{
  "success": true,
  "data": {
    "shortCode": "github",
    "originalUrl": "https://github.com",
    "description": "GitHub - Code hosting platform",
    "createdAt": "2025-09-29T16:05:00.000Z",
    "totalClicks": 1,
    "activeDays": 1,
    "referrers": 1,
    "recentClicks": [
      {
        "timestamp": "2025-09-29T16:06:00.000Z",
        "referrer": "Direct",
        "userAgent": "Mozilla/5.0...",
        "ip": "127.0.0.1"
      }
    ]
  },
  "message": "Analytics retrieved successfully"
}
```

### Get Overall Analytics

**GET** `/api/analytics`

Retrieves overall analytics for all URLs.

#### Response
```json
{
  "success": true,
  "data": {
    "totalUrls": 2,
    "totalClicks": 5,
    "averageClicksPerUrl": 2.5,
    "topUrls": [
      {
        "shortCode": "github",
        "clicks": 3,
        "originalUrl": "https://github.com"
      }
    ],
    "clicksToday": 2,
    "clicksThisWeek": 5,
    "clicksThisMonth": 5
  },
  "message": "Overall analytics retrieved successfully"
}
```

## 🔍 URL Management Endpoints

### Get URL Details

**GET** `/api/urls/:shortCode`

Retrieves details for a specific short URL without redirecting.

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| shortCode | string | Yes | The short code to retrieve |

#### Response
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://github.com",
    "shortUrl": "http://localhost:5000/github",
    "shortCode": "github",
    "description": "GitHub - Code hosting platform",
    "createdAt": "2025-09-29T16:05:00.000Z",
    "clicks": 1
  },
  "message": "URL details retrieved successfully"
}
```

### Update URL

**PUT** `/api/urls/:shortCode`

Updates an existing short URL.

#### Request Body
```json
{
  "description": "Updated description",
  "originalUrl": "https://new-url.com"  // Optional
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://new-url.com",
    "shortUrl": "http://localhost:5000/github",
    "shortCode": "github",
    "description": "Updated description",
    "createdAt": "2025-09-29T16:05:00.000Z",
    "updatedAt": "2025-09-29T16:10:00.000Z",
    "clicks": 1
  },
  "message": "URL updated successfully"
}
```

### Delete URL

**DELETE** `/api/urls/:shortCode`

Deletes a short URL.

#### Response
```json
{
  "success": true,
  "message": "URL deleted successfully"
}
```

## 🏥 Health Check Endpoint

### Health Check

**GET** `/health`

Checks the health status of the API.

#### Response
```json
{
  "status": "OK",
  "timestamp": "2025-09-29T16:05:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "database": "connected"
}
```

## 📝 Request Examples

### cURL Examples

#### Create Short URL
```bash
curl -X POST http://localhost:5000/api/urls/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com",
    "customAlias": "example",
    "description": "Example website"
  }'
```

#### Get Analytics
```bash
curl http://localhost:5000/api/analytics/example
```

#### Redirect (in browser)
```
http://localhost:5000/example
```

### JavaScript Examples

#### Using Fetch API
```javascript
// Create short URL
const response = await fetch('/api/urls/shorten', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    originalUrl: 'https://example.com',
    customAlias: 'example',
    description: 'Example website'
  })
});

const data = await response.json();
console.log(data);

// Get analytics
const analytics = await fetch('/api/analytics/example');
const analyticsData = await analytics.json();
console.log(analyticsData);
```

#### Using Axios
```javascript
// Create short URL
const response = await axios.post('/api/urls/shorten', {
  originalUrl: 'https://example.com',
  customAlias: 'example',
  description: 'Example website'
});

// Get analytics
const analytics = await axios.get('/api/analytics/example');
```

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| INVALID_URL | The provided URL is not valid |
| ALIAS_EXISTS | The custom alias is already taken |
| URL_NOT_FOUND | The short code does not exist |
| VALIDATION_ERROR | Request validation failed |
| DATABASE_ERROR | Database operation failed |
| RATE_LIMIT_EXCEEDED | Too many requests |

## 🔒 Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Shortening endpoint**: 20 requests per 15 minutes per IP
- **Analytics endpoints**: 50 requests per 15 minutes per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📊 Analytics Data Structure

### Click Event
```json
{
  "timestamp": "2025-09-29T16:06:00.000Z",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "ip": "192.168.1.1",
  "country": "US",
  "city": "New York"
}
```

### URL Statistics
```json
{
  "totalClicks": 150,
  "uniqueClicks": 120,
  "clicksByDay": {
    "2025-09-29": 25,
    "2025-09-28": 30
  },
  "topReferrers": [
    { "referrer": "google.com", "clicks": 50 },
    { "referrer": "direct", "clicks": 40 }
  ],
  "deviceTypes": {
    "desktop": 80,
    "mobile": 60,
    "tablet": 10
  }
}
```

## 🚀 SDK and Libraries

### JavaScript SDK
```javascript
class LinkShortAPI {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async shortenUrl(originalUrl, customAlias = null, description = null) {
    const response = await fetch(`${this.baseUrl}/api/urls/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl, customAlias, description })
    });
    return response.json();
  }

  async getAnalytics(shortCode) {
    const response = await fetch(`${this.baseUrl}/api/analytics/${shortCode}`);
    return response.json();
  }
}

// Usage
const api = new LinkShortAPI();
const result = await api.shortenUrl('https://example.com', 'example');
```

## 📚 Additional Resources

- [Main Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Frontend Components](frontend/src/components/)
- [Backend Routes](backend/routes/)

## 🤝 Support

For API support and questions:
- Create an issue in the repository
- Email: api-support@linkshort.com
- Documentation: https://docs.linkshort.com

---

**LinkShort API** - Simple, powerful, and developer-friendly! 🚀
