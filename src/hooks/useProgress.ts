/**
 * useProgress Hook — 课程进度管理
 *
 * 负责管理用户的学习进度，使用 localStorage 进行持久化存储。
 *
 * 存储格式（localStorage key: 'python-course-progress'）：
 * {
 *   completedLessons: { "1-1": true, "1-2": true, ... },
 *   lastVisit: "2026-07-23T...",
 *   startDate: "2026-07-20T...",
 *   totalCompleted: 2
 * }
 */

import { useState, useEffect, useCallback } from 'react';
import type { Progress } from '@/types';

/** localStorage 中存储进度的键名 */
const STORAGE_KEY = 'python-course-progress';

/**
 * 创建默认进度数据结构
 *
 * @returns 初始 Progress 对象
 */
function createDefaultProgress(): Progress {
  return {
    completedLessons: {},
    lastVisit: new Date().toISOString(),
    startDate: new Date().toISOString(),
    totalCompleted: 0,
  };
}

/**
 * 从 localStorage 读取进度数据
 *
 * @returns 存储的 Progress 对象，若不存在则返回默认值
 */
function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Progress;
    }
  } catch (error) {
    // localStorage 不可用或数据损坏时，使用默认值
    console.warn('无法读取进度数据，使用默认值:', error);
  }
  return createDefaultProgress();
}

/**
 * 将进度数据写入 localStorage
 *
 * @param progress - 要保存的进度对象
 */
function saveProgress(progress: Progress): void {
  try {
    // 更新最后访问时间
    progress.lastVisit = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('无法保存进度数据:', error);
  }
}

/**
 * useProgress Hook
 *
 * 管理用户学习进度的自定义 Hook，提供以下功能：
 * - 自动从 localStorage 加载进度
 * - 标记课时完成
 * * 重置进度
 * - 实时持久化到 localStorage
 *
 * @returns 进度管理相关状态和方法
 */
export function useProgress() {
  // 进度状态 - 使用惰性初始化，避免 SSR 时访问 localStorage
  const [progress, setProgress] = useState<Progress>(() => {
    // 服务端渲染时返回默认值
    if (typeof window === 'undefined') {
      return createDefaultProgress();
    }
    return loadProgress();
  });

  /**
   * 组件挂载时，确保进度已加载
   * 同时处理服务端渲染（SSR）时的 window 不可用问题
   */
  useEffect(() => {
    // 在客户端重新加载一次，确保获取最新数据
    const clientProgress = loadProgress();
    setProgress(clientProgress);
  }, []);

  /**
   * 标记某课时为已完成
   *
   * @param lessonId - 课时 ID，格式为 "章节号-课时号"，如 "1-1"
   */
  const markComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [lessonId]: true,
        },
        // 重新计算已完成总数
        totalCompleted: Object.values({
          ...prev.completedLessons,
          [lessonId]: true,
        }).filter(Boolean).length,
      };
      // 持久化到 localStorage
      saveProgress(updated);
      return updated;
    });
  }, []);

  /**
   * 标记某课时为未完成（取消完成标记）
   *
   * @param lessonId - 课时 ID，格式为 "章节号-课时号"
   */
  const markIncomplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const { [lessonId]: _, ...rest } = prev.completedLessons;
      const updated = {
        ...prev,
        completedLessons: rest,
        totalCompleted: Object.values(rest).filter(Boolean).length,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  /**
   * 重置所有进度
   * 清除 localStorage 中的所有学习进度数据
   */
  const resetProgress = useCallback(() => {
    const defaultProgress = createDefaultProgress();
    setProgress(defaultProgress);
    saveProgress(defaultProgress);
  }, []);

  /**
   * 检查某课时是否已完成
   *
   * @param lessonId - 课时 ID
   * @returns 是否已完成
   */
  const isCompleted = useCallback(
    (lessonId: string): boolean => {
      return progress.completedLessons[lessonId] === true;
    },
    [progress.completedLessons]
  );

  return {
    // 完整的进度数据
    progress,
    // 已完成课时映射表 { "1-1": true, ... }
    completedLessons: progress.completedLessons,
    // 已完成课时总数
    totalCompleted: progress.totalCompleted,
    // 标记完成
    markComplete,
    // 取消完成标记
    markIncomplete,
    // 重置所有进度
    resetProgress,
    // 检查单个课时完成状态
    isCompleted,
  };
}
