import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export type MarkdownBubbleVariant = 'user' | 'assistant'

/** Prism 常用别名 */
function normalizeLanguage(lang: string): string {
  const map: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    py: 'python',
    sh: 'bash',
    yml: 'yaml',
    md: 'markdown',
  }
  const lower = lang.toLowerCase()
  return map[lower] ?? lower
}

function buildComponents(variant: MarkdownBubbleVariant): Components {
  const inlineCodeClass =
    variant === 'user'
      ? 'rounded bg-sky-900/12 px-1.5 py-0.5 text-[0.875em] text-slate-900'
      : 'rounded bg-slate-200/95 px-1.5 py-0.5 text-[0.875em] text-slate-900'

  return {
    /** 避免外层 <pre> 与 SyntaxHighlighter 的 div 嵌套冲突 */
    pre({ children }) {
      return <div className="my-1 min-w-0 overflow-x-auto">{children}</div>
    },
    code(props) {
      const { children, className } = props
      const match = /language-(\w+)/.exec(className ?? '')
      const raw = String(children).replace(/\n$/, '')
      const isBlock = Boolean(match) || raw.includes('\n')
      if (!isBlock) {
        return <code className={inlineCodeClass}>{children}</code>
      }
      const lang = match ? normalizeLanguage(match[1]) : 'text'
      return (
        <SyntaxHighlighter
          language={lang}
          style={oneDark}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            },
          }}
        >
          {raw}
        </SyntaxHighlighter>
      )
    },
    p({ children }) {
      return <p className="my-1 first:mt-0 last:mb-0">{children}</p>
    },
    ul({ children }) {
      return (
        <ul className="my-1 list-inside list-disc space-y-0.5 pl-0.5">
          {children}
        </ul>
      )
    },
    ol({ children }) {
      return (
        <ol className="my-1 list-inside list-decimal space-y-0.5 pl-0.5">
          {children}
        </ol>
      )
    },
    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            variant === 'user'
              ? 'font-medium text-sky-900 underline decoration-sky-800/50'
              : 'font-medium text-sky-700 underline decoration-sky-600/40'
          }
        >
          {children}
        </a>
      )
    },
    h1({ children }) {
      return <p className="my-1 text-base font-semibold">{children}</p>
    },
    h2({ children }) {
      return <p className="my-1 text-[0.95rem] font-semibold">{children}</p>
    },
    h3({ children }) {
      return <p className="my-1 text-sm font-semibold">{children}</p>
    },
    blockquote({ children }) {
      return (
        <blockquote
          className={
            variant === 'user'
              ? 'my-1 border-l-2 border-sky-800/35 pl-2 text-slate-800'
              : 'my-1 border-l-2 border-slate-300 pl-2 text-slate-700'
          }
        >
          {children}
        </blockquote>
      )
    },
  }
}

export interface MarkdownBubbleProps {
  content: string
  variant: MarkdownBubbleVariant
}

/** 聊天气泡内 Markdown（含代码高亮） */
export function MarkdownBubble({ content, variant }: MarkdownBubbleProps) {
  return (
    <div
      className="text-left text-[15px] leading-relaxed text-slate-900"
    >
      <ReactMarkdown components={buildComponents(variant)}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
