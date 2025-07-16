/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/games-release-radar",
  assetPrefix: "/games-release-radar",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
