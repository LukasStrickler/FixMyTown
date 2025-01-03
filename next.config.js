/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/*", // or "/a/<APP_ID>/*" if using app-scoped URLs
      },
    ],
  },
  productionBrowserSourceMaps: true,
};

export default config;
