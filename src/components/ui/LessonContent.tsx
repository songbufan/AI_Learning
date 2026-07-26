/**
 * LessonContent — 课程 Markdown 内容渲染组件
 *
 * 使用 react-markdown 将 Markdown 格式的课程内容渲染为 React 组件，
 * 配合 remark-gfm 支持 GitHub Flavored Markdown（表格、删除线、任务列表等）。
 *
 * 渲染流程：
 * 1. 接收 Markdown 格式的字符串内容
 * 2. 通过 react-markdown 解析 Markdown 语法
 * 3. remark-gfm 扩展支持 GFM 语法（表格、删除线等）
 * 4. 使用 .lesson-content CSS 类名应用自定义样式
 * 5. 代码块使用 Python 语法高亮
 *
 * Hydration 安全：
 * Prism.js 高亮 <pre> 时会添加 tabindex="0"，
 * 导致服务端 HTML 与客户端渲染不一致。
 * 通过 components.pre 统一添加 tabIndex，确保两端渲染一致。
 * 过滤 React 内部 props（node/key/ref），避免污染 DOM。
 *
 * @param content - Markdown 格式的课程内容字符串
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * LessonContent 组件的属性
 */
export interface LessonContentProps {
  /** Markdown 格式的课程内容 */
  content: string;
}

/**
 * LessonContent 组件
 *
 * @param props - 组件属性
 * @returns 渲染后的 Markdown 内容 JSX
 */
export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="lesson-content" suppressHydrationWarning>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /**
           * 自定义 <pre> 渲染，确保服务端和客户端属性一致
           *
           * Prism.js 高亮 <pre> 时会添加 tabindex="0"，
           * 如果不在这里处理，会导致 hydration mismatch。
           *
           * 注意：过滤 React 内部 props（node/key/ref），
           * 避免它们被扩散为 HTML 属性（如 node="[object Object]"）。
           */
          pre: ({ children }) => {
            return (
              <pre tabIndex={0}>
                {children}
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
