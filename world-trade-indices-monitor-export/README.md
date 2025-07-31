# World Trade Indices Monitoring Dashboard

A real-time stock market indices monitoring application built with Next.js, TypeScript, and Tailwind CSS. This dashboard displays live data for major global stock market indices including S&P 500, NASDAQ, Dow Jones, FTSE 100, Nikkei 225, and more.

## Features

- **Real-time Data**: Fetches live market data from Yahoo Finance API with 10-second polling
- **Fallback System**: Automatically switches to simulated data if real API is unavailable
- **Responsive Design**: Modern, mobile-friendly interface using shadcn/ui components
- **Error Handling**: Graceful error handling with user-friendly messages
- **Performance Optimized**: Built with Next.js 15 and optimized for production

## Getting Started

### Development

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

### Production Export

To prepare the app for production deployment:

#### Option 1: Standard Production Build

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

#### Option 2: Standalone Build (Recommended)

This project is configured with `output: 'standalone'` for optimal deployment:

```bash
# Build the standalone version
npm run build

# The standalone build will be in .next/standalone/
# Copy static files
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Run the standalone server
cd .next/standalone
node server.js
```

#### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t indices-monitor .
docker run -p 3000:3000 indices-monitor
```

## API Endpoints

### GET /api/indices

Returns real-time data for major stock market indices.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "^GSPC",
      "name": "S&P 500",
      "price": 5800.00,
      "change": 25.50,
      "changePercent": 0.44,
      "currency": "USD",
      "lastUpdate": "2024-01-01T12:00:00.000Z",
      "isRealData": true
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "note": "All data is real-time"
}
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Data Fetching**: Native fetch with polling
- **Deployment**: Vercel, Docker, or standalone server

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/indices/route.ts    # API endpoint for market data
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main dashboard page
│   │   └── globals.css             # Global styles
│   ├── components/ui/              # shadcn/ui components
│   ├── hooks/
│   │   └── usePolling.ts           # Custom polling hook
│   └── lib/
│       └── utils.ts                # Utility functions
├── public/                         # Static assets
├── next.config.ts                  # Next.js configuration
└── package.json                    # Dependencies and scripts
```

## Performance Features

- **Standalone Output**: Self-contained build for efficient deployment
- **Image Optimization**: Next.js Image component with remote patterns
- **Code Splitting**: Automatic code splitting for optimal loading
- **SWC Minification**: Fast Rust-based minification
- **Compression**: Built-in gzip compression
- **Error Boundaries**: Graceful error handling throughout the app

## Deployment Options

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy automatically with zero configuration

### Other Platforms

- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **AWS/GCP/Azure**: Use the Docker approach or standalone build
- **Self-hosted**: Use the standalone build on any Node.js server

## Environment Variables

No environment variables are required for basic functionality. The app uses Yahoo Finance's public API with fallback to simulated data.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is open source and available under the [MIT License](LICENSE).
