/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    HF_TOKEN: process.env.HF_TOKEN,
  },
}

module.exports = nextConfig

