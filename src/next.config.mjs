/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.foody.vn',
        port: '',
        pathname: '**/*',
      },
    ],
  },
}

export default nextConfig
