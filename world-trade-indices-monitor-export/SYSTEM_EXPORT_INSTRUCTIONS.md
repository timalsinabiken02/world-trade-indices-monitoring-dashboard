# 📦 World Trade Indices Monitor - System Export Instructions

## 🎯 Complete Export Package

This package contains everything you need to run the World Trade Indices Monitoring Dashboard on your local system.

## 📋 Prerequisites

Before running on your system, ensure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## 📁 Export Package Contents

```
world-trade-indices-monitor/
├── src/                          # Source code
│   ├── app/
│   │   ├── api/indices/route.ts  # API endpoint
│   │   ├── layout.tsx            # App layout
│   │   ├── page.tsx              # Main dashboard
│   │   └── globals.css           # Global styles
│   ├── components/ui/            # UI components (shadcn/ui)
│   ├── hooks/
│   │   └── usePolling.ts         # Custom polling hook
│   └── lib/
│       └── utils.ts              # Utilities
├── public/                       # Static assets
├── package.json                  # Dependencies
├── package-lock.json             # Lock file
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── components.json               # shadcn/ui config
├── deploy.sh                     # Deployment script
├── Dockerfile                    # Docker config
└── README.md                     # Documentation
```

## 🚀 Quick Start on Your System

### Step 1: Copy Files
Copy all the files from this export to a folder on your system, for example:
```bash
mkdir ~/world-trade-indices-monitor
# Copy all files to this directory
```

### Step 2: Install Dependencies
```bash
cd ~/world-trade-indices-monitor
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```
Access at: http://localhost:8000

### Step 4: Build for Production
```bash
npm run build
npm run start
```
Access at: http://localhost:3000

## 🔧 System-Specific Setup

### Windows
```cmd
# Open Command Prompt or PowerShell
cd C:\path\to\world-trade-indices-monitor
npm install
npm run dev
```

### macOS/Linux
```bash
cd /path/to/world-trade-indices-monitor
npm install
npm run dev
```

## 📊 Features You'll Get

- **Real-time Stock Data**: 8 major global indices
- **Auto-refresh**: Updates every 10 seconds
- **Fallback System**: Works even if external APIs fail
- **Responsive Design**: Works on desktop, tablet, mobile
- **Modern UI**: Built with Tailwind CSS and shadcn/ui

## 🛠 Customization Options

### Change Update Frequency
Edit `src/app/page.tsx`, line 52:
```typescript
usePolling(fetchIndicesData, { delay: 10000 }); // 10 seconds
// Change to: { delay: 5000 } for 5 seconds
```

### Add More Indices
Edit `src/app/api/indices/route.ts`, add to INDICES array:
```typescript
{ symbol: '^BVSP', name: 'Bovespa', basePrice: 125000.00, currency: 'BRL' }
```

### Modify Styling
- Colors: Edit Tailwind classes in `src/app/page.tsx`
- Layout: Modify the grid system in the same file
- Global styles: Edit `src/app/globals.css`

## 🐳 Docker Deployment (Optional)

If you prefer containerized deployment:
```bash
docker build -t indices-monitor .
docker run -p 3000:3000 indices-monitor
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### Node.js Version Issues
```bash
# Check your Node.js version
node --version
# Should be 18.0.0 or higher
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Performance Tips

- **Production Build**: Always use `npm run build && npm run start` for production
- **Memory**: The app uses ~50MB RAM in production
- **Network**: API calls are cached and optimized
- **Browser**: Works best in Chrome, Firefox, Safari, Edge

## 🔐 Security Notes

- No API keys required for basic functionality
- Uses public Yahoo Finance API with fallback
- All data processing happens client-side
- No user data is stored or transmitted

## 📞 Support

If you encounter issues:
1. Check Node.js version (18+)
2. Ensure all files were copied correctly
3. Try `npm install` again
4. Check the console for error messages

## 🎉 You're Ready!

Your World Trade Indices Monitor is now ready to run on your system. The application will automatically handle API failures and provide simulated data when needed, ensuring it always works reliably.

**Happy monitoring! 📊**
