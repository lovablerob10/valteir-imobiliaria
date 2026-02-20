import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fpqpnztwhkcrytprhyhe.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'gvrrmhazmcvqekuvttpm.supabase.co',
      }
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns', 'recharts', 'react-day-picker'],
  },
};

export default nextConfig;
