/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this line for server-side deployment on Amplify
  output: 'standalone',

  // Your existing settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
