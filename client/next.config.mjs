/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✂️  Remove `output: 'standalone'` – Amplify needs the normal bundle
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};

export default nextConfig;
