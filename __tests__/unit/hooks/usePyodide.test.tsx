import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

/**
 * usePyodide Hook 测试
 *
 * 该 Hook 使用模块级全局单例，测试时通过手动管理全局状态来隔离。
 */

/** 重置 Pyodide 模块的全局状态 */
async function resetPyodideGlobals() {
  vi.resetModules();
  // 重新导入模块以获取对模块级变量的引用
  const mod = await import('@/hooks/usePyodide');
  return mod;
}

describe('usePyodide.ts — Python 运行时管理 Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 每个测试前重置模块级全局状态
  beforeEach(async () => {
    await resetPyodideGlobals();
  });

  // ==================== 辅助：设置成功的 loadPyodide mock ====================

  function setupSuccessfulLoad() {
    let stdoutCb: ((text: string) => void) | null = null;
    let stderrCb: ((text: string) => void) | null = null;

    const mockPyodide = {
      setStdout: vi.fn((cb: { batched: (text: string) => void }) => {
        stdoutCb = cb.batched;
      }),
      setStderr: vi.fn((cb: { batched: (text: string) => void }) => {
        stderrCb = cb.batched;
      }),
      runPythonAsync: vi.fn(async () => {
        // 模拟 Python 输出
        if (stdoutCb) stdoutCb('hello\n');
        return null;
      }),
    };
    const w = window as unknown as Record<string, unknown>;
    w.loadPyodide = vi.fn(async () => mockPyodide);
    return mockPyodide;
  }

  // ==================== 初始状态 ====================

  describe('初始状态（加载中）', () => {
    it('loading 状态下 isLoading 应该为 true', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      expect(result.current.isLoading).toBe(true);
    });

    it('loading 状态下 pyodide 应该为 null', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      expect(result.current.pyodide).toBeNull();
    });

    it('loading 状态下 error 应该为 null', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      expect(result.current.error).toBeNull();
    });

    it('应该暴露 runPython 方法', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      expect(typeof result.current.runPython).toBe('function');
    });
  });

  // ==================== 加载成功场景 ====================

  describe('加载成功', () => {
    it('加载完成后 isLoading 应该变为 false', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });
    });

    it('加载完成后 pyodide 应该有值', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      await waitFor(() => {
        expect(result.current.pyodide).not.toBeNull();
      }, { timeout: 3000 });
    });

    it('加载完成后 error 应该为 null', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      }, { timeout: 3000 });
    });

    it('应该调用 window.loadPyodide', async () => {
      setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      renderHook(() => usePyodide());

      await waitFor(() => {
        // 使用类型断言避免 tsc 报错（loadPyodide 不在标准 Window 类型中）
      const w = window as unknown as Record<string, unknown>;
      expect(w.loadPyodide).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  // ==================== 加载失败场景 ====================

  describe('加载失败', () => {
    it('loadPyodide 抛出错误时应该设置 error', async () => {
      const w = window as unknown as Record<string, unknown>;
      w.loadPyodide = vi.fn(async () => {
        throw new Error('初始化失败');
      });

      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).not.toBeNull();
        expect(result.current.error).toContain('初始化失败');
      }, { timeout: 3000 });
    });

    it('加载失败后 pyodide 应该保持 null', async () => {
      const w = window as unknown as Record<string, unknown>;
      w.loadPyodide = vi.fn(async () => {
        throw new Error('加载失败');
      });

      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      await waitFor(() => {
        expect(result.current.pyodide).toBeNull();
      }, { timeout: 3000 });
    });
  });

  // ==================== runPython 方法 ====================

  describe('runPython', () => {
    it('加载完成后应该能执行 Python 代码', async () => {
      const mockPyodide = setupSuccessfulLoad();
      const { usePyodide } = await resetPyodideGlobals();
      const { result } = renderHook(() => usePyodide());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      // runPythonAsync 应该被调用
      const response = await result.current.runPython('print("hello")');
      expect(mockPyodide.runPythonAsync).toHaveBeenCalledWith('print("hello")');
      // 成功执行时 stdout 包含输出
      expect(response.stdout).toContain('hello');
      expect(response.stderr).toBe('');
    });
  });
});
