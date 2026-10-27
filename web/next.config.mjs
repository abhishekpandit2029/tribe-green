/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep development output separate from any stale/incomplete production build.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};
export default nextConfig;
