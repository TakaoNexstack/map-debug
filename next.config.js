/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: false,
  images: {
    disableStaticImages: true,
  },
  experimental: {
    esmExternals: false,
    outputStandalone: true,
  },
};

module.exports = nextConfig;
