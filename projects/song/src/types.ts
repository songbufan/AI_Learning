/** 对话消息角色（与 Kimi Chat Completions 的 user / assistant 一致） */
export type MessageRole = 'user' | 'assistant'

/** 单条对话消息 */
export interface Message {
  role: MessageRole
  content: string
  /** Unix 时间戳（毫秒） */
  timestamp: number
}
