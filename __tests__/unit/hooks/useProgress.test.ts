import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgress } from '@/hooks/useProgress';

// localStorage 在测试中被 mock 为 vitest mock，使用类型断言访问 mock 方法
const ls = localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
};

describe('useProgress.ts — 课程进度管理 Hook', () => {
  beforeEach(() => {
    // 使用类型断言让 tsc 识别 vitest mock 方法
    const getItem = vi.mocked(ls.getItem);
    const setItem = vi.mocked(ls.setItem);
    const removeItem = vi.mocked(ls.removeItem);
    const clear = vi.mocked(ls.clear);
    getItem.mockClear();
    setItem.mockClear();
    removeItem.mockClear();
    clear.mockClear();
  });

  // ==================== 初始状态 ====================

  describe('初始状态', () => {
    it('应该返回默认进度结构', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      expect(result.current.progress).toBeDefined();
      expect(result.current.progress.completedLessons).toEqual({});
      expect(result.current.progress.totalCompleted).toBe(0);
      expect(typeof result.current.progress.startDate).toBe('string');
      expect(typeof result.current.progress.lastVisit).toBe('string');
    });

    it('应该暴露所有必要的方法', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      expect(typeof result.current.markComplete).toBe('function');
      expect(typeof result.current.markIncomplete).toBe('function');
      expect(typeof result.current.resetProgress).toBe('function');
      expect(typeof result.current.isCompleted).toBe('function');
    });

    it('completedLessons 应该等于 progress.completedLessons', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      expect(result.current.completedLessons).toBe(result.current.progress.completedLessons);
    });

    it('totalCompleted 应该等于 progress.totalCompleted', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      expect(result.current.totalCompleted).toBe(result.current.progress.totalCompleted);
    });
  });

  // ==================== markComplete ====================

  describe('markComplete', () => {
    it('应该标记课时为已完成', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
      });

      expect(result.current.progress.completedLessons['1-1']).toBe(true);
      expect(result.current.progress.totalCompleted).toBe(1);
    });

    it('标记完成后 isCompleted 应该返回 true', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
      });

      expect(result.current.isCompleted('1-1')).toBe(true);
    });

    it('标记多个课时后 totalCompleted 应该正确', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
        result.current.markComplete('1-2');
        result.current.markComplete('2-1');
      });

      expect(result.current.progress.totalCompleted).toBe(3);
      expect(result.current.isCompleted('1-2')).toBe(true);
      expect(result.current.isCompleted('2-1')).toBe(true);
    });

    it('重复标记同一课时不应增加 totalCompleted', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
        result.current.markComplete('1-1'); // 再次标记
      });

      expect(result.current.progress.totalCompleted).toBe(1);
    });

    it('标记完成后应该调用 ls.setItem', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
      });

      expect(ls.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(ls.setItem.mock.calls.at(-1)![1]);
      expect(savedData.completedLessons['1-1']).toBe(true);
    });
  });

  // ==================== markIncomplete ====================

  describe('markIncomplete', () => {
    it('应该取消课时的完成标记', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
        result.current.markComplete('1-2');
      });

      expect(result.current.progress.totalCompleted).toBe(2);

      act(() => {
        result.current.markIncomplete('1-1');
      });

      expect(result.current.progress.completedLessons['1-1']).toBeUndefined();
      expect(result.current.progress.totalCompleted).toBe(1);
      expect(result.current.isCompleted('1-1')).toBe(false);
      expect(result.current.isCompleted('1-2')).toBe(true);
    });

    it('取消不存在的课时标记不应报错', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markIncomplete('999-999');
      });

      expect(result.current.progress.totalCompleted).toBe(0);
    });
  });

  // ==================== resetProgress ====================

  describe('resetProgress', () => {
    it('应该重置所有进度', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
        result.current.markComplete('1-2');
        result.current.markComplete('2-1');
      });

      expect(result.current.progress.totalCompleted).toBe(3);

      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.progress.completedLessons).toEqual({});
      expect(result.current.progress.totalCompleted).toBe(0);
    });

    it('重置后 progress 应该恢复默认值', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
        result.current.markComplete('1-2');
      });

      expect(result.current.progress.totalCompleted).toBe(2);

      act(() => {
        result.current.resetProgress();
      });

      // 验证 hook 状态已重置
      expect(result.current.progress.completedLessons).toEqual({});
      expect(result.current.progress.totalCompleted).toBe(0);
      expect(result.current.isCompleted('1-1')).toBe(false);
    });
  });

  // ==================== isCompleted ====================

  describe('isCompleted', () => {
    it('未标记的课时应该返回 false', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      expect(result.current.isCompleted('1-1')).toBe(false);
      expect(result.current.isCompleted('999-999')).toBe(false);
    });

    it('已标记的课时应该返回 true', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('3-5');
      });

      expect(result.current.isCompleted('3-5')).toBe(true);
    });
  });

  // ==================== 从 ls 恢复数据 ====================

  describe('ls 数据恢复', () => {
    it('应该从 ls 恢复已有的进度数据', () => {
      const savedProgress = {
        completedLessons: { '1-1': true, '2-3': true },
        lastVisit: '2026-07-23T10:00:00.000Z',
        startDate: '2026-07-20T08:00:00.000Z',
        totalCompleted: 2,
      };
      ls.getItem.mockReturnValue(JSON.stringify(savedProgress));

      const { result } = renderHook(() => useProgress());

      expect(result.current.progress.totalCompleted).toBe(2);
      expect(result.current.progress.completedLessons['1-1']).toBe(true);
      expect(result.current.progress.completedLessons['2-3']).toBe(true);
    });

    it('ls 数据损坏时应该使用默认值', () => {
      ls.getItem.mockReturnValue('invalid json {{{');
      const { result } = renderHook(() => useProgress());

      expect(result.current.progress.totalCompleted).toBe(0);
      expect(result.current.progress.completedLessons).toEqual({});
    });
  });

  // ==================== lastVisit 自动更新 ====================

  describe('lastVisit 时间戳', () => {
    it('markComplete 后 lastVisit 应该有更新的时间戳', () => {
      ls.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useProgress());

      act(() => {
        result.current.markComplete('1-1');
      });

      // saveProgress 会更新 lastVisit，验证其为合法的 ISO 日期字符串
      expect(result.current.progress.lastVisit).toBeTruthy();
      expect(result.current.progress.lastVisit).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
