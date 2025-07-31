import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/workspace-*/**',
      },
    ],
  },
  // Optimize for production
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  // Enable compression
  compress: true,
}

export default nextConfig
