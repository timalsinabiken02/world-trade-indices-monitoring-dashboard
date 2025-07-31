#!/bin/bash

echo "🚀 Starting production export process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Create standalone deployment package
    echo "📦 Creating standalone deployment package..."
    
    # Copy static files to standalone build
    if [ -d ".next/standalone" ]; then
        cp -r .next/static .next/standalone/.next/
        cp -r public .next/standalone/
        
        echo "✅ Standalone build ready in .next/standalone/"
        echo ""
        echo "🎯 Deployment Options:"
        echo "1. Standard: npm run start (runs on port 3000)"
        echo "2. Standalone: cd .next/standalone && node server.js"
        echo "3. Docker: Use the Dockerfile in the README"
        echo ""
        echo "📊 Build Statistics:"
        du -sh .next/standalone/
        echo ""
        echo "🌐 Test the API:"
        echo "curl http://localhost:3000/api/indices"
        
    else
        echo "⚠️  Standalone build not found. Check next.config.ts"
    fi
    
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
