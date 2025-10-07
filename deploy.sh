#!/bin/bash

echo "🚀 LinkShort Deployment Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Build frontend
echo "🏗️ Building frontend..."
if command -v pnpm &> /dev/null; then
    pnpm run build
else
    npm run build
fi
if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend"
    exit 1
fi

# Copy built files to backend public directory
echo "📁 Copying built files..."
cd ..
mkdir -p backend/public
cp -r frontend/dist/* backend/public/

echo "✅ Deployment preparation complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure your environment variables in backend/.env"
echo "2. Start the backend server: cd backend && npm start"
echo "3. Your application will be available at http://localhost:5000"
echo ""
echo "📚 For detailed deployment instructions, see DEPLOYMENT.md"

