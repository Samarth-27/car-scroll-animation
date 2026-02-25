/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/car-scroll-animation",
  assetPrefix: "/car-scroll-animation",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;