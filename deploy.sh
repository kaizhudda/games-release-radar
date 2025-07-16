#!/bin/bash

# Games Release Radar - Deployment Script
# This script helps you deploy the project to GitHub and GitHub Pages

echo "🎮 Games Release Radar - Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Check if GitHub repository exists
if ! git remote get-url origin &> /dev/null; then
    echo "📡 Setting up GitHub repository..."
    echo "Please create a GitHub repository called 'games-release-radar' and run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/games-release-radar.git"
    echo "Then run this script again."
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://YOUR_USERNAME.github.io/games-release-radar"
echo "📊 GitHub Actions will automatically update the game data daily."
