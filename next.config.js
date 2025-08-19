/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: true, typedRoutes: false },
  images: { remotePatterns: [{ protocol:'https', hostname:'*' }] }
};
module.exports = nextConfig;
