/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Allow dev origins for Replit environment
  allowedDevOrigins: [
    '*.replit.dev',
    '*.repl.co', 
    'localhost:5000',
    '127.0.0.1:5000'
  ],
  // Disable cache for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig