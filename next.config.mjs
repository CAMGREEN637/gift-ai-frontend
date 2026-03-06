/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix root directory resolution
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },

  // Ensure webpack resolves from correct directory
  webpack: (config, { isServer }) => {
    // Set correct context
    config.context = process.cwd();

    return config;
  },
};

export default nextConfig;