/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  
  },
  images: {
    unoptimized: true,        
  },
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  },
}

export default nextConfig
