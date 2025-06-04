const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: [
    "@monorepo/ui",
    "@monorepo/utils",
    "@monorepo/types",
    "@monorepo/database",
  ],
};

module.exports = withNextIntl(nextConfig);
