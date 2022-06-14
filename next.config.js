/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { loader: "imgix", path: "", domains: ["ipfs.atomichub.io"] },
  exportPathMap: async function (defaultPathMap) {
    return {
      "/": { page: "/" },
      "/ended": { page: "/ended" },
      "/ending-soon": { page: "/ending-soon" },
      "/new": { page: "/new" },
    };
  },
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
};

module.exports = nextConfig;
