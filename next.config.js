/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: false },
  images: { remotePatterns: [{ protocol:'https', hostname:'*' }] },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
};

module.exports = nextConfig;
