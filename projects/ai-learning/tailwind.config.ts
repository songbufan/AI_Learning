import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS 配置
 *
 * 定义了自定义主题颜色、字体和内容扫描路径
 */
const config: Config = {
  // 指定 Tailwind 需要扫描的文件路径
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          dark: '#16213e',
          card: '#0f3460',
        },
        python: {
          blue: '#3776AB',
          yellow: '#FFD43B',
        },
      },
      // 自定义字体
      fontFamily: {
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
