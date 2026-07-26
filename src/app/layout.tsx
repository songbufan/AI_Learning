/**
 * Next.js 根布局组件
 *
 * 这是整个应用的顶层布局，包含：
 * - HTML 结构（lang、主题色等元信息）
 * - 全局字体加载（Inter）
 * - 全局样式引入
 * - 全局导航栏
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// 加载 Inter 字体，支持拉丁字符和中文
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * 页面元信息配置
 * 定义浏览器标签页标题和基础描述
 */
export const metadata: Metadata = {
  title: {
    default: 'Python 学习中心',
    template: '%s | Python 学习中心',
  },
  description: '边学边练的交互式 Python 学习平台，在浏览器中直接编写和运行 Python 代码',
  keywords: ['Python', '编程学习', '在线编程', 'Pyodide', '交互式学习'],
};

/**
 * 根布局组件
 *
 * @param children - 子页面内容
 * @returns 完整的 HTML 页面结构
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body
        className={`${inter.className} antialiased`}
        style={{ backgroundColor: '#1a1a2e' }}
      >
        {/* 全局顶部导航栏 */}
        <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 border-b"
          style={{ backgroundColor: '#16213e', borderColor: '#2a2a4a' }}
        >
          {/* Logo 和网站标题 */}
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🐍</span>
            <span className="text-lg font-bold" style={{ color: '#3776AB' }}>
              AI 学习中心
            </span>
          </a>
        </header>

        {/* 主内容区域，顶部留出导航栏高度 */}
        <main className="pt-14 min-h-screen" style={{ paddingTop: '3.5rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
