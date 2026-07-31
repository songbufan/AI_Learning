import type { Message } from './types'

const DEFAULT_BASE_URL = 'https://api.moonshot.cn/v1'
const DEFAULT_MODEL = 'kimi-k2.5'

export interface KimiUsage {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
}

export class KimiApiError extends Error {
  readonly status?: number
  readonly responseBody?: string

  constructor(message: string, status?: number, responseBody?: string) {
    super(message)
    this.name = 'KimiApiError'
    this.status = status
    this.responseBody = responseBody
  }
}

interface KimiStreamChunk {
  choices?: Array<{
    index?: number
    delta?: { role?: string; content?: string }
    finish_reason?: string | null
    usage?: KimiUsage
  }>
}

function getKimiConfig(): { apiKey: string; baseUrl: string; model: string } {
  const apiKey = import.meta.env.VITE_KIMI_API_KEY?.trim() ?? ''
  const baseUrl = (
    import.meta.env.VITE_KIMI_BASE_URL?.trim() || DEFAULT_BASE_URL
  ).replace(/\/$/, '')
  const model = import.meta.env.VITE_KIMI_MODEL?.trim() || DEFAULT_MODEL

  if (!apiKey) {
    throw new KimiApiError(
      '未配置 VITE_KIMI_API_KEY，请在 .env 中设置 Kimi API Key'
    )
  }

  return { apiKey, baseUrl, model }
}

async function* readLines(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<string, void, undefined> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (value) {
        buffer += decoder.decode(value, { stream: true })
      }
      let idx: number
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx)
        buffer = buffer.slice(idx + 1)
        yield line.endsWith('\r') ? line.slice(0, -1) : line
      }
      if (done) {
        if (buffer.length > 0) {
          yield buffer
        }
        break
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * 按 Kimi 文档解析 SSE：空行触发 JSON 解析；多行 JSON 会拼到同一条 `data:` 后。
 * @see https://platform.moonshot.ai/docs/guide/utilize-the-streaming-output-feature-of-kimi-api
 */
async function parseKimiSseStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (text: string) => void,
  onUsage: (u: KimiUsage) => void,
  signal?: AbortSignal
): Promise<void> {
  let pending = ''

  for await (const line of readLines(body)) {
    if (signal?.aborted) {
      throw new DOMException('请求已取消', 'AbortError')
    }

    if (line.length === 0) {
      if (pending === '') continue
      try {
        const chunk = JSON.parse(pending) as KimiStreamChunk
        const choice = chunk.choices?.[0]
        const content = choice?.delta?.content
        if (content) {
          onDelta(content)
        }
        const usage = choice?.usage
        if (usage && typeof usage === 'object') {
          onUsage(usage)
        }
      } catch {
        /* 忽略无法解析的片段 */
      }
      pending = ''
      continue
    }

    if (line.startsWith('data: ')) {
      pending = line.slice(6)
      if (pending === '[DONE]') {
        return
      }
    } else if (pending !== '') {
      pending += '\n' + line
    }
  }
}

export interface StreamKimiChatOptions {
  /** 作为 `system` 角色插入到消息列表最前 */
  systemPrompt?: string
  onDelta: (chunk: string) => void
  onError?: (error: Error) => void
  /** 流结束或收到 `[DONE]` 时调用；若最后一包含 usage 会传入 */
  onDone?: (meta?: { usage?: KimiUsage }) => void
  signal?: AbortSignal
}

/**
 * 调用 Kimi（Moonshot）Chat Completions，**流式**返回助手回复。
 * Base URL、模型、密钥均来自环境变量（见 `vite-env.d.ts` / `.env.example`）。
 */
export async function streamKimiChat(
  messages: Message[],
  options: StreamKimiChatOptions
): Promise<void> {
  const { apiKey, baseUrl, model } = getKimiConfig()

  const apiMessages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }> = []

  if (options.systemPrompt?.trim()) {
    apiMessages.push({ role: 'system', content: options.systemPrompt.trim() })
  }

  for (const m of messages) {
    apiMessages.push({ role: m.role, content: m.content })
  }

  let lastUsage: KimiUsage | undefined

  const url = `${baseUrl}/chat/completions`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        stream: true,
      }),
      signal: options.signal,
    })
  } catch (e) {
    const err =
      e instanceof Error ? e : new Error(String(e))
    options.onError?.(err)
    throw err
  }

  if (!response.ok) {
    const text = await response.text()
    const err = new KimiApiError(
      `Kimi API 请求失败：${response.status} ${response.statusText}`,
      response.status,
      text
    )
    options.onError?.(err)
    throw err
  }

  const body = response.body
  if (!body) {
    const err = new KimiApiError('响应体为空，无法读取流')
    options.onError?.(err)
    throw err
  }

  try {
    await parseKimiSseStream(
      body,
      (chunk) => options.onDelta(chunk),
      (u) => {
        lastUsage = u
      },
      options.signal
    )
    options.onDone?.({ usage: lastUsage })
  } catch (e) {
    const err =
      e instanceof Error ? e : new Error(String(e))
    options.onError?.(err)
    throw err
  }
}
