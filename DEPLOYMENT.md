# Deployment Guide for LinkShort URL Shortener

This guide provides step-by-step instructions for deploying the LinkShort URL shortener application to various hosting platforms.

## 🚀 Quick Deployment Options

### Option 1: Full-Stack Deployment (Recommended)
Deploy both frontend and backend together for a complete solution.

### Option 2: Separate Deployment
Deploy frontend and backend to different services for scalability.

## 📋 Pre-Deployment Checklist

- [ ] Node.js 16+ installed
- [ ] MongoDB database ready (or use in-memory storage)
- [ ] Environment variables configured
- [ ] Application tested locally
- [ ] Build process verified

## 🌐 Frontend Deployment

### Build the Frontend
```bash
cd frontend
pnpm install
pnpm run build
```

This creates a `dist/` folder with optimized static files.

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && pnpm run build`
3. Set publish directory: `frontend/dist`
4. Deploy automatically on git push

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Follow the prompts to deploy

### Deploy to GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Run `npm run deploy`

## 🖥️ Backend Deployment

### Deploy to Heroku
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```
3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set BASE_URL=https://your-app-name.herokuapp.com
   ```
4. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Deploy to Railway
1. Connect GitHub repository to Railway
2. Set root directory to `backend`
3. Configure environment variables in Railway dashboard
4. Deploy automatically

### Deploy to DigitalOcean App Platform
1. Create new app in DigitalOcean
2. Connect GitHub repository
3. Set source directory to `backend`
4. Configure environment variables
5. Deploy

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Add to environment variables:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshortener
   ```

### Local MongoDB
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Use local connection
MONGODB_URI=mongodb://localhost:27017/urlshortener
```

## ⚙️ Environment Configuration

### Backend Environment Variables
Create `.env` file in backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_connection_string

# Application
BASE_URL=https://your-domain.com

# Security (optional)
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables
Create `.env` file in frontend directory:
```env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=LinkShort
```

## 🔧 Full-Stack Deployment

### Deploy to Single Server (VPS)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 2. Application Setup
```bash
# Clone repository
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

# Install dependencies
npm run install:all

# Build frontend
cd frontend && pnpm run build

# Copy built files to backend static directory
cp -r dist/* ../backend/public/
```

#### 3. PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'linkshort-backend',
    script: './backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4. Nginx Configuration
Create `/etc/nginx/sites-available/linkshort`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/linkshort /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Maintenance

### Health Checks
Add health check endpoint to backend:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging
Configure logging with Winston:
```bash
npm install winston
```

### Backup Strategy
```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR
tar -czf "$BACKUP_DIR.tar.gz" $BACKUP_DIR
rm -rf $BACKUP_DIR
```

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

#### MongoDB Connection Issues
```javascript
// Check connection string format
// mongodb+srv://username:password@cluster.mongodb.net/database

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

#### Build Failures
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

### Performance Optimization

#### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement service worker for caching

#### Backend
- Enable compression middleware
- Implement rate limiting
- Use database indexing
- Add Redis for caching

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple backend instances
- Database clustering
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Use connection pooling

## 🔐 Security Best Practices

- Use HTTPS everywhere
- Implement rate limiting
- Validate all inputs
- Use environment variables for secrets
- Regular security updates
- Monitor for suspicious activity

---

For additional support, please refer to the main README.md or create an issue in the repository.
