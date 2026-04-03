/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone for better compatibility with Vercel/Railway default start
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
