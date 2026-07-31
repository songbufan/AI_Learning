/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Kimi（Moonshot）API Key，在 Kimi 开放平台创建 */
  readonly VITE_KIMI_API_KEY: string
  /** API 根路径，默认 `https://api.moonshot.cn/v1`（国内）；海外可用 `https://api.moonshot.ai/v1` */
  readonly VITE_KIMI_BASE_URL?: string
  /** 模型 id，默认 `kimi-k2.5` */
  readonly VITE_KIMI_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
