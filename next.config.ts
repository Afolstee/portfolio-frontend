/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for dev server
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig