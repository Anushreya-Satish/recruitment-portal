/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/recruitment-portal' : '',
  assetPrefix: isProd ? '/recruitment-portal/' : '',
};

export default nextConfig;
