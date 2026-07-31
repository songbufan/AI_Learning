import { KimiApiError } from './api'

/** 尝试解析 Kimi / OpenAI 风格错误 JSON */
function parseApiErrorBody(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined
  try {
    const j = JSON.parse(raw) as {
      error?: { message?: string; type?: string }
      message?: string
    }
    return j.error?.message ?? j.message
  } catch {
    return undefined
  }
}

function mapStatusToHint(status: number | undefined): string | undefined {
  if (status === undefined) return undefined
  if (status === 401 || status === 403) {
    return 'API 密钥无效或已过期，请检查 .env 中的 VITE_KIMI_API_KEY。'
  }
  if (status === 429) {
    return '请求过于频繁，请稍后再试。'
  }
  if (status === 500 || status === 502 || status === 503) {
    return '服务暂时不可用，请稍后再试。'
  }
  return undefined
}

/**
 * 将异常转换为用户可读的简短中文说明（用于气泡内展示）。
 */
export function formatChatError(error: unknown): string {
  if (error instanceof KimiApiError) {
    const fromBody = parseApiErrorBody(error.responseBody)
    if (fromBody) {
      return fromBody
    }
    const hint = mapStatusToHint(error.status)
    if (hint) {
      return hint
    }
    return error.message || '请求失败，请稍后重试。'
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return '请求已取消。'
  }

  if (error instanceof Error) {
    const m = error.message
    if (
      m.includes('Failed to fetch') ||
      m.includes('NetworkError') ||
      m.includes('Load failed')
    ) {
      return '网络连接失败，请检查网络后重试。'
    }
    if (m.includes('VITE_KIMI_API_KEY')) {
      return '未配置 API 密钥，请在项目根目录 .env 中设置 VITE_KIMI_API_KEY。'
    }
    return m
  }

  return '发生未知错误，请稍后重试。'
}
