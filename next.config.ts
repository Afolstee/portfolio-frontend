/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for dev server
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure for Replit environment - allow all hosts
  experimental: {
    allowedHosts: true
  }
}

module.exports = nextConfig