/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Next.js 配置项 */
  reactStrictMode: true,
  // 静态导出配置（可部署到任何 CDN）
  output: 'export',
  // 允许外部图片等配置（后续扩展用）
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
