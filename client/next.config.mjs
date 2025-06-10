const nextConfig = {
  // output: 'standalone',  ← remove or comment out
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};
export default nextConfig;
