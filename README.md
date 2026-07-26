# Python 学习中心 — 项目架构文档

> 静态导出的 Next.js 16 + React 19 交互式 Python 学习平台。

---

## 一、项目运行全流程

用户打开浏览器到看到课程页面的完整链路，以及每个环节涉及的文件。

### 1. 入口：浏览器请求页面

```
浏览器 → / → layout.tsx → page.tsx
```

| 阶段 | 文件 | 职责 |
|------|------|------|
| HTML 骨架 | `src/app/layout.tsx` | 注入 `<html>`、`<head>`、`<body>`，加载 Inter 字体，渲染全局顶部导航 |
| 首页内容 | `src/app/page.tsx` | 展示课程总览（章节卡片网格），导入 `chapters` 数据和 `ProgressOverview` |
| 静态文件 | `public/` | 提供 `pyodide/` 下 Pyodide 运行时文件（WASM、标准库等） |

### 2. 用户点击章节：`/learn/{chapterId}`

```
browser → /learn/1 → layout.tsx + page.tsx([chapter])
```

| 阶段 | 文件 | 职责 |
|------|------|------|
| 布局 | `src/app/layout.tsx` | 同首页（全局导航 + Inter 字体） |
| 章节页 | `src/app/learn/[chapter]/page.tsx` | 服务端组件，调用 `getChapterById()` 获取章节数据，渲染章节详情和课时列表 |
| 数据 | `src/lib/content/chapters.ts` → `src/types/index.ts` | 章节元数据（标题、颜色、课时列表）和 TypeScript 类型定义 |

### 3. 用户点击课时：`/learn/{chapterId}/{lessonNumber}`

这是最核心的页面，涉及文件最多。

```
browser → /learn/1/1
  │
  ├─ page.tsx([chapter][lesson])          ← 服务端组件
  │     ├─ getChapterById()               ← 查找章节数据
  │     ├─ loadLessonMarkdown("1-1")       ← 读取 Markdown 文件
  │     └─ <LessonClient />               ← 渲染客户端交互组件
  │
  └─ LessonClient.tsx                     ← 客户端组件（'use client'）
        ├─ useProgress()                  ← 进度管理（localStorage）
        ├─ usePyodide()                   ← Python 运行时加载
        │
        ├─ <Sidebar />                    ← 侧边栏导航
        ├─ <LessonContent />              ← Markdown 内容渲染
        ├─ <CodeEditor />                 ← 代码编辑器
        ├─ <OutputPanel />                ← 输出面板
        └─ <Navigation />                 ← 上/下一课导航
```

### 4. 客户端交互细节

#### 4.1 代码编辑与运行

```
用户输入代码 → CodeEditor → onChange → setCode → 状态更新
用户点击"运行" → handleRunCode() → runPython(code) → 输出结果 → OutputPanel
```

| 环节 | 文件 | 关键逻辑 |
|------|------|----------|
| 编辑器 | `src/components/ui/CodeEditor.tsx` | 动态导入 CodeJar + Prism.js，contenteditable 编辑，Tab 插入 4 空格 |
| Python 运行时 | `src/hooks/usePyodide.ts` → `src/components/ui/PyodideRunner.tsx` | 优先加载本地 `public/pyodide/`，回退 CDN；全局单例防止重复加载；`setStdout`/`setStderr` 捕获输出 |
| 输出 | `src/components/ui/OutputPanel.tsx` | 区分 stdout（绿色）/ stderr（红色）/ 运行中 / 空状态 |

#### 4.2 进度管理

```
用户标记完成 → markComplete("1-1") → localStorage → 侧边栏 ✓ 标记更新
刷新页面 → useProgress() → 读取 localStorage → 恢复进度
```

| 环节 | 文件 | 关键逻辑 |
|------|------|----------|
| 进度 Hook | `src/hooks/useProgress.ts` | localStorage 读写、完成标记、进度计算 |
| 侧边栏显示 | `src/components/ui/Sidebar.tsx` | 展示 ✓ / ○ 标记、进度条 |
| 首页概览 | `src/components/ui/ProgressOverview.tsx` → `ProgressBar.tsx` | 总完成数 / 总课时数 |

### 5. 数据流总览

```
chapters.ts (章节数据)
    │
    ├─→ page.tsx (首页) ──→ ProgressOverview ──→ ProgressBar
    │
    ├─→ page.tsx ([chapter]) ──→ SkeletonCard (骨架屏)
    │
    └─→ page.tsx ([chapter][lesson]) ──→ LessonClient
            │
            ├─→ chapters (章节数据)
            ├─→ useProgress (localStorage 进度)
            ├─→ usePyodide (Python WASM 运行时)
            │       └─→ public/pyodide/ (WASM 文件)
            ├─→ loadLessonMarkdown (Markdown 文件)
            │       └─→ src/lib/content/lessons/*.md
            ├─→ Sidebar (导航)
            ├─→ LessonContent (react-markdown 渲染)
            ├─→ CodeEditor (CodeJar + Prism)
            ├─→ OutputPanel (输出)
            └─→ Navigation (上/下一课)
```

### 6. 静态导出构建流程

```
npm run build
  │
  ├─ next.config.ts: { output: 'export' }
  │     └─ 生成静态 HTML/CSS/JS 到 out/ 目录
  │
  ├─ generateStaticParams() ([chapter] page)
  │     └─ 10 个章节 → 10 个 HTML
  │
  ├─ generateStaticParams() ([chapter][lesson] page)
  │     └─ 43 个课时 → 43 个 HTML
  │
  └─ out/
        ├─ index.html                    (首页)
        ├─ learn/1/index.html           (第1章)
        ├─ learn/1/1/index.html         (第1课)
        ├─ ...
        ├─ pyodide/                     (从 public/ 复制)
        └─ _next/                       (JS/CSS bundle)
```

### 7. 关键文件依赖关系

```
src/types/index.ts                    ← 所有类型定义的源头
    │
    ├── src/lib/content/chapters.ts   ← 章节元数据（导入 types）
    │       └── src/lib/content/index.ts ← 统一导出
    │
    ├── src/hooks/useProgress.ts      ← 进度管理（导入 types）
    ├── src/hooks/usePyodide.ts       ← WASM 运行时
    │
    ├── src/components/ui/
    │       ├── CodeEditor.tsx        ← CodeJar + Prism
    │       ├── LessonContent.tsx     ← react-markdown
    │       ├── Sidebar.tsx           ← 导航
    │       ├── OutputPanel.tsx       ← 输出
    │       ├── Navigation.tsx        ← 上/下一课
    │       ├── ProgressBar.tsx       ← 进度条
    │       ├── ProgressOverview.tsx  ← 首页进度
    │       ├── PyodideRunner.tsx     ← 代码执行器
    │       ├── CompletionBadge.tsx   ← 完成标记
    │       └── SkeletonCard.tsx      ← 骨架屏
    │
    └── src/app/
            ├── layout.tsx            ← 根布局（字体、导航）
            ├── globals.css           ← 全局样式 + @theme
            ├── page.tsx              ← 首页
            └── learn/
                    ├── [chapter]/page.tsx      ← 章节详情
                    └── [chapter]/[lesson]/
                            ├── page.tsx        ← 服务端组件
                            └── LessonClient.tsx ← 客户端组件
```

---

## 二、项目文件结构

```
d:\project\pythonWebsite\
│
├── package.json                    ← 项目依赖清单
├── postinstall.cjs                  ← 构建后脚本：复制 Pyodide 文件到 public/
├── postcss.config.js                ← PostCSS 配置（@tailwindcss/postcss v4）
├── next.config.ts                   ← Next.js 配置（静态导出）
├── tsconfig.json                    ← TypeScript 配置
├── tailwind.config.ts               ← 遗留 v3 配置（v4 使用 CSS @theme，此文件已无用）
├── .eslintrc.json                   ← ESLint 配置
│
├── public/                          ← 静态资源（构建时复制到 out/）
│   └── pyodide/                     ← Pyodide WASM 运行时文件
│         ├── pyodide.js             ← 主入口
│         ├── pyodide.asm.wasm       ← WebAssembly 核心
│         ├── pyodide.asm.mjs        ← WASM ES 模块
│         ├── pyodide.mjs            ← ES 模块入口
│         ├── python_stdlib.zip      ← Python 标准库
│         ├── pyodide-lock.json      ← 包版本锁定
│         └── pyodide.d.ts           ← 类型定义
│
├── src/                             ← 源代码
│   │
│   ├── types/
│   │     └── index.ts               ← 核心类型定义（Lesson、Chapter、Progress）
│   │
│   ├── lib/content/                 ← 课程内容数据层
│   │     ├── index.ts               ← 统一导出入口
│   │     ├── chapters.ts            ← 10 章 43 课元数据
│   │     ├── lesson-loader.ts       ← Markdown 文件读取器
│   │     └── lessons/               ← 43 个 .md 课程文件
│   │           ├── 1-1.md ~ 1-7.md
│   │           ├── 2-1.md ~ 2-4.md
│   │           ├── ...
│   │           └── 10-1.md ~ 10-4.md
│   │
│   ├── hooks/                       ← 自定义 React Hooks
│   │     ├── useProgress.ts         ← 进度管理（localStorage 持久化）
│   │     └── usePyodide.ts          ← WASM 运行时管理（全局单例）
│   │
│   ├── components/ui/               ← React 组件库
│   │     ├── CodeEditor.tsx         ← CodeJar + Prism 代码编辑器
│   │     ├── LessonContent.tsx      ← react-markdown 渲染器
│   │     ├── Sidebar.tsx            ← 可折叠侧边栏导航
│   │     ├── OutputPanel.tsx        ← 代码输出面板
│   │     ├── PyodideRunner.tsx      ← Python 执行器
│   │     ├── Navigation.tsx         ← 上/下一课导航
│   │     ├── ProgressBar.tsx        ← 进度条
│   │     ├── ProgressOverview.tsx   ← 首页进度概览
│   │     ├── CompletionBadge.tsx    ← 完成标记（✓ / ○）
│   │     └── SkeletonCard.tsx       ← 加载骨架屏
│   │
│   ├── app/                         ← Next.js App Router 页面
│   │     ├── layout.tsx             ← 根布局（Inter 字体 + 全局导航）
│   │     ├── page.tsx               ← 首页（/）
│   │     ├── globals.css            ← 全局样式 + Tailwind @theme
│   │     └── learn/                 ← 学习路由
│   │           ├── [chapter]/
│   │           │     └── page.tsx    ← 章节详情（/learn/{id}）
│   │           └── [chapter]/[lesson]/
│   │                 ├── page.tsx    ← 服务端组件
│   │                 └── LessonClient.tsx ← 客户端交互组件
│   │
│   └── app/not-found.tsx            ← 404 页面（自动生成）
│
└── node_modules/                    ← 依赖（不纳入版本控制）
```

---

## 三、依赖关系详解

### 3.1 npm 依赖清单

| 包 | 版本 | 类型 | 用途 | 使用位置 |
|----|------|------|------|----------|
| `next` | ^16 | prod | React 框架 | `next.config.ts` |
| `react` | ^19 | prod | UI 库 | 所有组件 |
| `react-dom` | ^19 | prod | DOM 渲染 | 客户端组件 |
| `codejar` | ^4.3 | prod | 轻量代码编辑器 | `CodeEditor.tsx` |
| `prismjs` | ^1.30 | prod | Python 语法高亮 | `CodeEditor.tsx` |
| `pyodide` | ^314 | prod | CPython WASM 运行时 | `usePyodide.ts` |
| `react-markdown` | ^10 | prod | Markdown → React | `LessonContent.tsx` |
| `remark-gfm` | ^4 | prod | GFM 语法扩展 | `LessonContent.tsx` |
| `@tailwindcss/postcss` | ^4 | prod | Tailwind PostCSS 插件 | `postcss.config.js` |
| `tailwindcss` | ^4 | prod | CSS 框架 | `globals.css @import` |
| `autoprefixer` | ^10 | prod | CSS 前缀 | `postcss.config.js` |
| `@types/node` | ^22 | dev | Node.js 类型 | TypeScript 编译 |
| `@types/react` | ^19 | dev | React 类型 | TypeScript 编译 |
| `@types/react-dom` | ^19 | dev | React DOM 类型 | TypeScript 编译 |
| `@types/prismjs` | ^1.26 | dev | Prism.js 类型 | TypeScript 编译 |
| `typescript` | ^5 | dev | TypeScript 编译器 | `tsc` |
| `eslint` | ^9 | dev | Linter | `npm run lint` |
| `eslint-config-next` | ^16 | dev | Next.js ESLint 规则 | `.eslintrc.json` |

### 3.2 类型系统

```
src/types/index.ts
    │
    ├── Lesson          ← 课时数据结构
    ├── Chapter         ← 章节数据结构
    └── Progress        ← 用户进度数据结构
         │
         ├── src/lib/content/chapters.ts      (导入 Lesson, Chapter)
         ├── src/hooks/useProgress.ts          (导入 Progress)
         ├── src/hooks/usePyodide.ts           (PyodideResult, UsePyodideReturn — 内联定义)
         └── src/components/ui/*.tsx           (导入对应类型)
```

---

## 四、快速扩展指南

### 4.1 新增一章内容

1. 在 `src/lib/content/chapters.ts` 中新增 `Chapter` 对象：

```typescript
{
  id: 11,
  title: '新章节标题',
  description: '章节描述',
  icon: '🎯',
  color: '#FF6B6B',
  lessons: [
    {
      id: '11-1',
      chapterId: 11,
      lessonNumber: 1,
      title: '第一课标题',
      description: '课程描述',
      slug: '11-1',
      difficulty: 'easy',
      duration: 15,
      contentPath: 'src/lib/content/lessons/11-1.md',
      initialCode: 'print("Hello")',
      expectedOutput: 'Hello',
    },
  ],
}
```

2. 在 `src/lib/content/lessons/` 下新增 `11-1.md`：

```markdown
# 11-1 第一课标题

## 课程简介

这里是课程内容...

```python
print("Hello, World!")
```

## 练习任务

1. 完成练习
```

3. 运行 `npm run build`，构建会自动生成新章节的路由。

### 4.2 新增一个组件

在 `src/components/ui/` 下新建 `.tsx` 文件，遵循现有命名约定：

- `*Bar.tsx` — 进度条类组件
- `*Panel.tsx` — 面板类组件
- `*Overview.tsx` — 概览类组件
- `use*.ts` — Hooks 放在 `src/hooks/` 下

### 4.3 新增一个页面路由

在 `src/app/` 下新建文件夹和 `page.tsx`，遵循 App Router 约定：

```
src/app/
  └── new-route/
        └── page.tsx       ← 服务端组件（默认）
```

需要客户端交互时，在组件顶部加 `'use client';`。

### 4.4 新增课程类型字段

1. 在 `src/types/index.ts` 中修改 `Lesson` 或 `Chapter` 接口
2. 在 `src/lib/content/chapters.ts` 中补充字段值
3. 在 `src/app/learn/[chapter]/[lesson]/page.tsx` 的 `buildFallbackContent` 中处理兜底逻辑

### 4.5 修改全局样式

- 主题色：`src/app/globals.css` 的 `@theme` 块中修改 `--color-*` 变量
- 组件样式：直接写在组件 `style` prop 中（本项目不使用 CSS Modules）
- Markdown 渲染样式：`.lesson-content` 开头的 CSS 规则

---

## 五、技术选型说明

| 决策 | 选型 | 原因 |
|------|------|------|
| 前端框架 | Next.js 16 | App Router + 静态导出 |
| UI 库 | React 19 | 与 Next.js 16 配套 |
| CSS | Tailwind CSS v4 | `@theme` CSS-based 配置，无需 JS config |
| 代码编辑器 | CodeJar | ~1KB 零依赖，contenteditable + Prism 高亮，静态导出下无 worker 路径问题 |
| Python 运行时 | Pyodide | CPython 编译为 WASM，浏览器直接运行 |
| 内容渲染 | react-markdown | Markdown → React 组件 |
| 构建输出 | 静态导出 | 可部署到任何 CDN，无需 Node.js 服务端 |
| 字体 | Inter | Google Fonts，支持拉丁字符和中文 |
| 进度持久化 | localStorage | 纯前端，无需后端 |

---

## 六、构建与部署

```bash
# 安装依赖
npm install

# 开发服务器（热更新）
npm run dev

# 生产构建（生成 out/ 目录）
npm run build

# 预览构建结果
npx serve out

# 代码检查
npm run lint
```

构建产出：`out/` 目录包含所有静态文件，可直接部署到 Vercel、Netlify、GitHub Pages 或任何静态托管服务。
