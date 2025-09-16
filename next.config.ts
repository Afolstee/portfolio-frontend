/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Allow all hosts for Replit proxy environment
  experimental: {
    allowedHosts: true
  }
}

module.exports = nextConfig