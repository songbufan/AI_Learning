# 个人项目合集

本仓库整合了三个独立项目，涵盖 AI 学习平台、3D 交互简历和聊天应用。

---

## 项目概览

| 项目 | 技术栈 | 简介 |
|------|--------|------|
| **AI_Learning** | Next.js 16 + React 19 + Pyodide | 交互式 Python 学习平台，内置代码编辑器，支持 Python / Go / Rust / Linux / 区块链 / 智能体开发课程 |
| **resume** | React 18 + Three.js + Vite | 3D 交互式简历，可旋转、缩放、点击探索一个虚拟房间中的作品集 |
| **song** | React 19 + Vite + Tailwind CSS | 聊天应用，支持 Markdown 渲染和代码高亮 |

---

## 项目结构

```
.
├── README.md                 ← 本文件
├── .gitignore                ← 统一忽略规则
├── projects/
│   ├── ai-learning/          ← 交互式 AI 学习平台
│   ├── resume/               ← 3D 交互简历
│   └── song/                 ← 聊天应用
└── (构建产物如 out/、coverage/ 等已在 .gitignore 中排除)
```

---

## 快速开始

每个子项目独立运行，互不依赖。克隆仓库后，分别进入对应子目录即可。

### 1. AI_Learning — 交互式 AI 学习平台

基于 Next.js 的交互式学习平台，在浏览器中直接编写和运行 Python 代码，内置 Pyodide 运行时。

```bash
cd projects/ai-learning
npm install
npm run dev        # 开发服务器 → http://localhost:3000
npm run build      # 静态导出到 out/ 目录
```

- 课程内容：Python 开发、智能体开发、区块链开发
- 支持浏览器内直接运行 Python（无需后端）
- 静态导出，可部署到 Vercel / Netlify / GitHub Pages

详细说明见 [projects/ai-learning/README.md](projects/ai-learning/README.md)。

### 2. resume — 3D 交互简历

使用 Three.js 构建的 3D 虚拟房间简历，支持轨道旋转、缩放和点击交互。

```bash
cd projects/resume
npm install
npm run dev        # 开发服务器 → http://localhost:5173
npm run build      # 构建到 dist/ 目录
npm run preview    # 预览生产构建
```

- 点击房间中的物体探索项目、技能、联系方式
- 动态昼夜光照系统
- 平滑的相机飞行动画（GSAP）

在线演示：[My 3D Resume](https://my-3d-resume-one.vercel.app/)

详细说明见 [projects/resume/README.md](projects/resume/README.md)。

### 3. song — 聊天应用

基于 React + Vite + Tailwind CSS 的聊天应用，支持 Markdown 渲染和代码语法高亮。

```bash
cd projects/song
cp .env.example .env   # 配置环境变量（如 API 地址）
npm install
npm run dev            # 开发服务器 → http://localhost:5173
npm run build          # 构建到 dist/ 目录
```

- Markdown 消息渲染
- 代码块语法高亮
- 响应式布局

详细说明见 [projects/song/README.md](projects/song/README.md)。

---

## 技术栈总览

| 技术 | AI_Learning | resume | song |
|------|-------------|--------|------|
| React | 19 | 18 | 19 |
| 框架 | Next.js 16 | Vite | Vite |
| 样式 | Tailwind CSS v4 | CSS Modules | Tailwind CSS v4 |
| 语言 | TypeScript | TypeScript | TypeScript |
| 运行时 | Pyodide (WASM) | Three.js | — |
| 状态管理 | React Hooks | Zustand | React Hooks |
| 动画 | — | GSAP | — |
| 测试 | Vitest + Playwright | — | — |

---

## 子项目 README

- [projects/ai-learning/README.md](projects/ai-learning/README.md) — AI 学习平台详细文档
- [projects/resume/README.md](projects/resume/README.md) — 3D 简历详细文档
- [projects/song/README.md](projects/song/README.md) — 聊天应用详细文档
