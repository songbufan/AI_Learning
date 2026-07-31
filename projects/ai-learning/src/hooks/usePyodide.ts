/**
 * usePyodide Hook — Python 运行时管理
 *
 * 负责在浏览器中加载 Pyodide（CPython 编译为 WebAssembly），
 * 并提供执行 Python 代码的能力。
 *
 * 加载策略：优先使用本地 public/pyodide/ 副本（避免 CDN 网络问题），
 * 本地加载失败后回退到 jsdelivr CDN。
 *
 * 使用全局单例模式，防止重复加载和重复初始化。
 *
 * 使用方式：
 *   const { pyodide, isLoading, error, runPython } = usePyodide();
 *
 *   // 执行 Python 代码
 *   const result = await runPython('print("Hello")');
 *   // result = { stdout: "Hello\n", stderr: "", result: null }
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Python 代码执行结果
 */
export interface PyodideResult {
  /** 标准输出（stdout）内容 */
  stdout: string;
  /** 错误输出（stderr）内容 */
  stderr: string;
  /** 代码返回值（如果有） */
  result: unknown;
}

/**
 * usePyodide 返回值类型
 */
export interface UsePyodideReturn {
  /** Pyodide 实例，加载完成后可用 */
  pyodide: unknown | null;
  /** 是否正在加载 Pyodide */
  isLoading: boolean;
  /** 加载或执行过程中的错误信息 */
  error: string | null;
  /** 执行 Python 代码的函数 */
  runPython: (code: string) => Promise<PyodideResult>;
}

/* ============================================
   全局单例状态（跨 hook 实例共享）
   ============================================ */

/** 已加载的 Pyodide 实例 */
let globalInstance: unknown | null = null;
/** 当前加载 Promise（防止并发重复加载） */
let globalLoadPromise: Promise<unknown> | null = null;

/* ============================================
   路径配置
   ============================================ */

const LOCAL_PYODIDE_URL = '/pyodide/pyodide.js';
const LOCAL_PYODIDE_INDEX = '/pyodide/';
const CDN_PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.7/full/pyodide.js';
const CDN_PYODIDE_INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.26.7/full/';

/* ============================================
   底层加载函数
   ============================================ */

/**
 * 注入 Pyodide script 标签并等待加载完成
 */
function injectScript(url: string, label: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => {
      console.log(`[Pyodide] ${label} 脚本加载成功`);
      resolve();
    };
    script.onerror = () =>
      reject(new Error(`[${label}] 脚本加载失败: ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * 调用 window.loadPyodide 初始化运行时
 */
async function initPyodide(indexURL: string): Promise<unknown> {
  const win = window as unknown as Record<string, unknown>;
  const loadPyodideFn = win.loadPyodide as
    | ((options?: { indexURL: string }) => Promise<unknown>)
    | undefined;

  if (typeof loadPyodideFn !== 'function') {
    throw new Error('loadPyodide 函数未在 window 上找到，脚本可能未正确加载');
  }

  console.log(`[Pyodide] 初始化运行时 (indexURL: ${indexURL})`);
  try {
    const instance = await loadPyodideFn({ indexURL });
    console.log('[Pyodide] 运行时初始化成功');
    return instance;
  } catch (err) {
    console.error('[Pyodide] 初始化失败:', err);
    throw err;
  }
}

/**
 * 从本地 public/pyodide/ 加载
 */
async function loadFromLocal(): Promise<unknown> {
  console.log('[Pyodide] 尝试本地加载:', LOCAL_PYODIDE_URL);
  const win = window as unknown as Record<string, unknown>;

  if (!win.loadPyodide) {
    console.log('[Pyodide] 本地脚本未加载，开始注入...');
    await injectScript(LOCAL_PYODIDE_URL, '本地');
  } else {
    console.log('[Pyodide] loadPyodide 已存在，直接初始化');
  }

  return initPyodide(LOCAL_PYODIDE_INDEX);
}

/**
 * 从 CDN 加载（回退方案）
 */
async function loadFromCDN(): Promise<unknown> {
  console.log('[Pyodide] 尝试 CDN 加载:', CDN_PYODIDE_URL);
  const win = window as unknown as Record<string, unknown>;

  if (!win.loadPyodide) {
    console.log('[Pyodide] CDN 脚本未加载，开始注入...');
    await injectScript(CDN_PYODIDE_URL, 'CDN');
  } else {
    console.log('[Pyodide] loadPyodide 已存在，直接初始化');
  }

  return initPyodide(CDN_PYODIDE_INDEX);
}

/**
 * 加载 Pyodide 运行时（全局只执行一次）
 * 先尝试本地，失败后回退到 CDN
 */
async function loadPyodideRuntime(): Promise<unknown> {
  // 已有实例，直接返回
  if (globalInstance) {
    console.log('[Pyodide] 使用已缓存的全局实例');
    return globalInstance;
  }

  // 加载中，等待完成
  if (globalLoadPromise) {
    console.log('[Pyodide] 等待全局加载完成...');
    return globalLoadPromise;
  }

  console.log('[Pyodide] ========== 开始首次加载 ==========');

  globalLoadPromise = (async () => {
    try {
      const instance = await loadFromLocal();
      globalInstance = instance;
      console.log('[Pyodide] ========== 本地加载成功 ==========');
      return instance;
    } catch (localErr) {
      console.warn('[Pyodide] 本地加载失败:', localErr);
      try {
        const instance = await loadFromCDN();
        globalInstance = instance;
        console.log('[Pyodide] ========== CDN 加载成功 ==========');
        return instance;
      } catch (cdnErr) {
        const localMsg = localErr instanceof Error ? localErr.message : String(localErr);
        const cdnMsg = cdnErr instanceof Error ? cdnErr.message : String(cdnErr);
        const fullMsg = `所有 Pyodide 源加载失败。\n本地 (${LOCAL_PYODIDE_URL}): ${localMsg}\nCDN (${CDN_PYODIDE_URL}): ${cdnMsg}`;
        console.error('[Pyodide] ========== 全部加载失败 ==========', fullMsg);
        throw new Error(fullMsg);
      }
    }
  })();

  return globalLoadPromise;
}

/* ============================================
   React Hook
   ============================================ */

/**
 * usePyodide Hook
 *
 * 管理 Pyodide 的生命周期，提供 Python 代码执行能力。
 * 使用全局单例模式，确保只加载一次 Pyodide。
 */
export function usePyodide(): UsePyodideReturn {
  const [pyodide, setPyodide] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** 跟踪组件是否仍挂载，避免卸载后 setState */
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // ---- 情况1：全局实例已就绪 ----
    if (globalInstance) {
      console.log('[Pyodide] Hook: 使用全局已就绪实例');
      setPyodide(globalInstance);
      setIsLoading(false);
      setError(null);
      return;
    }

    // ---- 情况2：全局加载进行中，附加状态更新 ----
    if (globalLoadPromise) {
      console.log('[Pyodide] Hook: 附加到全局加载 Promise');
      globalLoadPromise
        .then((instance) => {
          if (isMountedRef.current) {
            setPyodide(instance);
            setError(null);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (isMountedRef.current) {
            const message = err instanceof Error ? err.message : 'Pyodide 加载失败';
            setError(message);
            setIsLoading(false);
          }
        });
      return;
    }

    // ---- 情况3：首次加载 ----
    console.log('[Pyodide] Hook: 触发首次加载');
    loadPyodideRuntime()
      .then((instance) => {
        if (isMountedRef.current) {
          setPyodide(instance);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          const message = err instanceof Error ? err.message : 'Pyodide 加载失败';
          setError(message);
          setIsLoading(false);
          console.error('[Pyodide] Hook 捕获加载错误:', err);
        }
      });

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * 执行 Python 代码
   */
  const runPython = useCallback(async (code: string): Promise<PyodideResult> => {
    if (!globalInstance) {
      return {
        stdout: '',
        stderr: 'Pyodide 尚未加载完成，请稍后重试',
        result: null,
      };
    }

    const stdoutLines: string[] = [];
    const stderrLines: string[] = [];

    try {
      // @ts-ignore - Pyodide 实例类型
      const p = globalInstance as {
        setStdout: (cb: { batched: (text: string) => void }) => void;
        setStderr: (cb: { batched: (text: string) => void }) => void;
        runPythonAsync: (code: string) => Promise<unknown>;
      };

      p.setStdout({ batched: (text: string) => stdoutLines.push(text) });
      p.setStderr({ batched: (text: string) => stderrLines.push(text) });

      console.log('[Pyodide] 执行代码:', code.substring(0, 100));
      const result = await p.runPythonAsync(code);
      console.log('[Pyodide] 执行完成');

      return {
        stdout: stdoutLines.join(''),
        stderr: stderrLines.join(''),
        result,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : '代码执行出错';
      console.error('[Pyodide] 执行错误:', message);
      return {
        stdout: stdoutLines.join(''),
        stderr: stderrLines.join('') + (stderrLines.length > 0 ? '\n' : '') + message,
        result: null,
      };
    }
  }, []);

  return {
    pyodide,
    isLoading,
    error,
    runPython,
  };
}
