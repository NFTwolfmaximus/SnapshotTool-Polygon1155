/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    alchemyAPI: process.env.alchemyAPI,
  },
}

module.exports = nextConfig
