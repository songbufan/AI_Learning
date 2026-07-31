import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Message } from '../types'
import { FloatingInputPanel } from './FloatingInputPanel'
import { MarkdownBubble } from './MarkdownBubble'

export interface ChatInterfaceProps {
  messages: Message[]
  onSend: (text: string) => void | Promise<void>
  onClear?: () => void
  inputDisabled?: boolean
  loading?: boolean
  title?: string
  placeholder?: string
}

function buildTurns(messages: Message[]): Array<{
  user: Message
  assistant: Message | null
}> {
  const result: Array<{ user: Message; assistant: Message | null }> = []
  let i = 0
  while (i < messages.length) {
    const m = messages[i]
    if (m.role === 'user') {
      const next = messages[i + 1]
      if (next?.role === 'assistant') {
        result.push({ user: m, assistant: next })
        i += 2
      } else {
        result.push({ user: m, assistant: null })
        i += 1
      }
    } else {
      i += 1
    }
  }
  return result
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function stripMdLite(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function previewText(s: string, max: number): string {
  const t = stripMdLite(s)
  if (t.length <= max) return t || '（无内容）'
  return `${t.slice(0, max)}…`
}

function CopyAnswerButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handle = async () => {
    const t = text.trim()
    if (!t) return
    try {
      await navigator.clipboard.writeText(t)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = t
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handle}
      className="rounded-md px-2 py-0.5 text-[12px] text-slate-500 transition hover:bg-slate-300/50 hover:text-slate-800"
    >
      {copied ? '已复制' : '复制'}
    </button>
  )
}

const NEAR_BOTTOM_PX = 72

function isNearBottom(el: HTMLElement): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= NEAR_BOTTOM_PX
}

export function ChatInterface({
  messages,
  onSend,
  onClear,
  inputDisabled = false,
  loading = false,
  title = '聊天',
  placeholder = '输入消息…',
}: ChatInterfaceProps) {
  const [draft, setDraft] = useState('')
  const [showBackToBottom, setShowBackToBottom] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const stickToBottomRef = useRef(true)

  const turns = useMemo(() => buildTurns(messages), [messages])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  const scrollToTurn = useCallback((index: number) => {
    document
      .getElementById(`chat-turn-${index}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const handleListScroll = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const near = isNearBottom(el)
    stickToBottomRef.current = near
    setShowBackToBottom(!near)
  }, [])

  useLayoutEffect(() => {
    if (!stickToBottomRef.current) return
    scrollToBottom('auto')
    requestAnimationFrame(() => {
      const el = listRef.current
      if (el && isNearBottom(el)) {
        setShowBackToBottom(false)
      }
    })
  }, [messages, scrollToBottom])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (stickToBottomRef.current) {
        scrollToBottom('auto')
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [scrollToBottom])

  const busy = inputDisabled || loading

  const submit = () => {
    const t = draft.trim()
    if (!t || busy) return
    stickToBottomRef.current = true
    setShowBackToBottom(false)
    void Promise.resolve(onSend(t))
    setDraft('')
    requestAnimationFrame(() => scrollToBottom('auto'))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!busy) submit()
    }
  }

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-[#dfe8f3]">
      <header className="relative flex h-12 shrink-0 items-center justify-center border-b border-slate-300/45 bg-[#eef3fb] px-4 shadow-sm">
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            disabled={loading || messages.length === 0}
            className="absolute left-4 top-1/2 max-w-[28vw] -translate-y-1/2 truncate text-[14px] text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            清空对话
          </button>
        ) : null}
        <h1 className="text-[17px] font-semibold tracking-tight text-slate-800">
          {title}
        </h1>
      </header>

      {/* 1 : 5 布局 */}
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_5fr]">
        <aside className="m-3 flex min-h-0 min-w-0 flex-col rounded-3xl border border-emerald-600/20 bg-gradient-to-b from-emerald-100 via-green-100 to-emerald-200/95 shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_20px_60px_-35px_rgba(16,185,129,0.65)]">
          <div className="shrink-0 rounded-t-3xl border-b border-emerald-600/20 bg-emerald-700/10 px-3 py-2 text-[13px] font-semibold text-emerald-950 shadow-[inset_0_-1px_0_rgba(16,185,129,0.18)]">
            问答记录
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {turns.length === 0 ? (
              <p className="px-2 py-3 text-center text-sm text-emerald-900/70">
                暂无记录
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {turns.map((turn, idx) => (
                  <li key={`${turn.user.timestamp}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => scrollToTurn(idx)}
                      className="group relative w-full overflow-hidden rounded-lg border border-emerald-700/15 bg-white/75 px-3 py-2 text-left shadow-sm shadow-emerald-900/10 transition hover:border-emerald-600/55 hover:bg-white hover:shadow-[0_0_0_1px_rgba(16,185,129,0.65),0_0_28px_rgba(16,185,129,0.35),0_14px_44px_-22px_rgba(0,0,0,0.08)]"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.40),transparent_60%)]"
                      />
                      <div className="text-[11px] font-medium text-emerald-800/80">
                        #{idx + 1}{' '}
                        <span className="text-emerald-900/70">
                          {formatTime(turn.user.timestamp)}
                        </span>
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm text-emerald-950">
                        {previewText(turn.user.content, 80)}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs text-emerald-900/65">
                        {turn.assistant?.content
                          ? previewText(turn.assistant.content, 100)
                          : '…'}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <div className="relative flex min-h-0 min-w-0 flex-col">
          <div
            ref={listRef}
            onScroll={handleListScroll}
            className="h-full min-h-0 overflow-y-auto overflow-x-hidden px-3 pb-44 pt-3"
          >
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[120px] items-center justify-center px-4 text-center text-sm text-slate-500/90">
                暂无消息，在下方输入后开始对话
              </div>
            ) : (
              <ul className="flex min-w-0 flex-col gap-4">
                {turns.map((turn, turnIdx) => {
                  const userMsg = turn.user
                  const asst = turn.assistant
                  const canCopy =
                    asst && asst.content.trim().length > 0
                  const userBubbleClass =
                    'w-full max-w-[min(100%,17.5rem)] rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#c5ddf5] to-[#a8c9ec] px-3 py-2 shadow-md shadow-sky-900/10'
                  const aiBubbleClass =
                    'w-full max-w-[min(100%,17.5rem)] rounded-2xl rounded-tl-sm border border-slate-200/90 bg-white/95 px-3 py-2 shadow-md shadow-slate-400/15'

                  return (
                    <li
                      key={`${userMsg.timestamp}-turn-${turnIdx}`}
                      id={`chat-turn-${turnIdx}`}
                      className="grid w-full min-w-0 grid-cols-2 gap-x-3 scroll-mt-3"
                    >
                      <div className="flex min-w-0 flex-col items-start gap-0.5">
                        {asst ? (
                          <>
                            {canCopy ? (
                              <div className="flex w-full justify-start pl-0.5">
                                <CopyAnswerButton text={asst.content} />
                              </div>
                            ) : null}
                            <div className={aiBubbleClass}>
                              <MarkdownBubble
                                content={asst.content}
                                variant="assistant"
                              />
                            </div>
                            <span className="w-full pl-1 text-left text-[11px] text-slate-400">
                              {formatTime(asst.timestamp)}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-col items-end gap-0.5">
                        <div className={userBubbleClass}>
                          <MarkdownBubble
                            content={userMsg.content}
                            variant="user"
                          />
                        </div>
                        <span className="w-full pr-1 text-right text-[11px] text-slate-400">
                          {formatTime(userMsg.timestamp)}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {showBackToBottom ? (
            <button
              type="button"
              onClick={() => {
                stickToBottomRef.current = true
                setShowBackToBottom(false)
                scrollToBottom('smooth')
              }}
              className="fixed bottom-[10.5rem] right-6 z-40 flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 text-[13px] text-slate-600 shadow-lg backdrop-blur-sm transition hover:bg-white"
            >
              <span aria-hidden>↓</span>
              回到底部
            </button>
          ) : null}
        </div>
      </div>

      <FloatingInputPanel
        value={draft}
        onChange={setDraft}
        onSubmit={submit}
        busy={busy}
        loading={loading}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
