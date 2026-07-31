import type { Message } from './types'

const STORAGE_KEY = 'ai-app-chat-messages'

function isMessage(x: unknown): x is Message {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    (o.role === 'user' || o.role === 'assistant') &&
    typeof o.content === 'string' &&
    typeof o.timestamp === 'number'
  )
}

/** 从 LocalStorage 读取对话历史，解析失败或不存在时返回空数组 */
export function loadChatMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isMessage)
  } catch {
    return []
  }
}

/** 将对话历史写入 LocalStorage */
export function saveChatMessages(messages: Message[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    /* 存储配额、隐私模式等 */
  }
}
