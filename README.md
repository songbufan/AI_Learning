# 交互式 Python 学习平台

一个基于浏览器的交互式 Python 学习平台，内置代码编辑器，无需安装任何环境即可边学边练。

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Pyodide](https://img.shields.io/badge/Pyodide-CPython%20WASM-green)

## 课程内容

| 课程 | 说明 |
|------|------|
| Python 开发 | 从基础语法到进阶特性 |
| 智能体开发 | AI Agent 开发实战 |
| 区块链开发 | 区块链原理与实践 |

每门课程由多个章节组成，每个课时包含阅读内容和在线编程练习。

## 功能特性

- 内置代码编辑器（语法高亮 + Tab 缩进）
- 浏览器内直接运行 Python（Pyodide，无需后端）
- 学习进度自动保存（localStorage）
- 完整的 Markdown 课程内容渲染
- 静态导出，可部署到任意 CDN

## 快速开始

### 开发环境

```bash
# 安装依赖（会自动下载 Pyodide 运行时文件）
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 生产构建

```bash
# 生成静态文件到 out/ 目录
npm run build

# 预览构建结果
npx serve out
```

`out/` 目录包含所有静态文件，可直接部署到 Vercel、Netlify、GitHub Pages 或任何静态托管服务。

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 静态导出构建 |
| `npm run lint` | 代码检查 |
| `npm run test` | 单元测试（监听模式） |
| `npm run test:run` | 单元测试（单次运行） |
| `npm run test:e2e` | 端到端测试 |

## 技术栈

- **前端框架**：Next.js 16 + React 19
- **样式**：Tailwind CSS v4
- **代码编辑器**：CodeJar + Prism.js
- **Python 运行时**：Pyodide（CPython 编译为 WebAssembly）
- **内容渲染**：react-markdown
- **测试**：Vitest + Playwright

## 项目结构

```
src/
├── lib/content/          # 课程内容（Markdown + 章节数据）
├── components/ui/        # 页面组件（编辑器、侧边栏、输出面板等）
├── hooks/               # 自定义 Hooks（进度管理、Pyodide 运行时）
├── app/                 # 页面路由
└── types/               # TypeScript 类型定义
```

## 添加课程

1. 在 `src/lib/content/lessons/` 下创建 Markdown 文件
2. 在 `src/lib/content/chapters.ts` 中注册课时信息
3. 运行 `npm run build`，路由会自动生成

详细说明请参考 [docs/](./docs)。
