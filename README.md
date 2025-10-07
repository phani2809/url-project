# LinkShort - URL Shortener Application

A modern, full-featured URL shortener built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a beautiful UI, analytics tracking, and comprehensive functionality.

![LinkShort Screenshot](https://via.placeholder.com/800x400/6366f1/ffffff?text=LinkShort+URL+Shortener)

## ✨ Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, memorable links
- **Custom Aliases**: Create personalized short codes for your URLs
- **Auto-generated Codes**: Automatic short code generation when no alias is provided
- **URL Descriptions**: Add descriptions to organize and identify your links
- **Instant Redirection**: Fast, reliable redirection to original URLs

### Analytics & Tracking
- **Click Analytics**: Track total clicks, active days, and referrer information
- **Detailed Statistics**: View comprehensive analytics for each shortened URL
- **Recent Activity**: Monitor recent clicks with timestamps
- **Visual Dashboard**: Clean, intuitive analytics interface

### User Experience
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **Tab Navigation**: Easy switching between URL shortening and analytics
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Real-time Updates**: Instant feedback and updates
- **Mobile Responsive**: Works perfectly on all device sizes

## 🚀 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide Icons**: Beautiful, consistent iconography
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, minimalist web framework
- **MongoDB**: NoSQL database (with in-memory fallback)
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing support

### Development Tools
- **Vite**: Fast build tool and development server
- **Nodemon**: Auto-restart development server
- **ESLint**: Code linting and formatting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- MongoDB (optional - app works with in-memory storage)

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

The frontend will start on `http://localhost:5173`

### Environment Configuration
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:5000
NODE_ENV=development
```

## 🎯 Usage

### Shortening URLs
1. Enter the original URL in the input field
2. Optionally add a custom alias
3. Optionally add a description
4. Click "Shorten URL"
5. Copy and share your shortened link

### Viewing Analytics
1. Click the "Analytics" tab
2. Click the analytics button (📊) next to any shortened URL
3. View detailed statistics including:
   - Total clicks
   - Active days
   - Referrer information
   - Recent click history

### API Endpoints

#### Create Short URL
```http
POST /api/urls/shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com",
  "customAlias": "my-link",
  "description": "My custom link"
}
```

#### Get URL Analytics
```http
GET /api/analytics/:shortCode
```

#### Redirect to Original URL
```http
GET /:shortCode
```

## 🏗️ Project Structure

```
url-shortener/
├── backend/
│   ├── models/
│   │   └── Url.js          # URL data model
│   ├── routes/
│   │   ├── urls.js         # URL shortening routes
│   │   ├── redirect.js     # Redirection handling
│   │   └── analytics.js    # Analytics routes
│   ├── utils/
│   │   └── storage.js      # In-memory storage utility
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── UrlShortener.jsx  # Main component
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
└── README.md
```

## 🎨 Design Features

### Visual Design
- **Gradient Backgrounds**: Beautiful purple-to-blue gradients
- **Glass Morphism**: Semi-transparent cards with backdrop blur
- **Color-coded Elements**: Intuitive color coding for different sections
- **Smooth Animations**: Hover effects and transitions

### User Interface
- **Tab Navigation**: Clean tab switching between features
- **Form Validation**: Real-time input validation
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

### Responsive Layout
- **Mobile-first**: Optimized for mobile devices
- **Flexible Grid**: Adapts to different screen sizes
- **Touch-friendly**: Large buttons and touch targets

## 🔧 Customization

### Styling
The application uses Tailwind CSS for styling. Key design tokens:
- Primary colors: Purple (`purple-600`) and Blue (`blue-600`)
- Background: Gradient from purple to blue
- Cards: Semi-transparent white with backdrop blur
- Text: High contrast for accessibility

### Short Code Generation
The application generates 8-character short codes using:
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)

### Database Configuration
- **MongoDB**: Full persistence with Mongoose ODM
- **In-memory**: Fallback storage for development
- **Flexible**: Easy to switch between storage methods

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
pnpm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Deploy to your Node.js hosting service
```

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BASE_URL=https://your-domain.com
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular URL shortening services
- Designed for developer-friendly customization
- Created with attention to user experience

## 📞 Support

For support, email support@linkshort.com or create an issue in the repository.

---

**LinkShort** - Making long URLs short and analytics simple! 🔗✨
