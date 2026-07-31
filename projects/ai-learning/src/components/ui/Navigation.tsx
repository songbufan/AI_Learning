/**
 * Navigation — 课程导航组件
 *
 * 在课程页面底部显示"上一课"和"下一课"导航按钮。
 * 使用 URL hash 切换课时（保持在 /course/{courseId} 路由下）。
 *
 * @param prevLesson - 上一课数据（可选，无上一课时按钮禁用）
 * @param nextLesson - 下一课数据（可选）
 * @param courseId - 当前课程 ID
 * @param chapterId - 当前子章节 ID
 * @param onNavigate - 课时切换回调（chapterId, lessonNumber）
 */

import type { Lesson } from '@/types';

/**
 * Navigation 组件的属性
 */
export interface NavigationProps {
  /** 上一课数据（可选） */
  prevLesson?: Lesson;
  /** 下一课数据（可选） */
  nextLesson?: Lesson;
  /** 当前课程 ID */
  courseId: number;
  /** 当前子章节 ID */
  chapterId: number;
  /** 课时切换回调 */
  onNavigate?: (chapterId: number, lessonNumber: number) => void;
}

/**
 * Navigation 组件
 */
export default function Navigation({
  prevLesson,
  nextLesson,
  courseId,
  chapterId,
  onNavigate,
}: NavigationProps) {
  const handleClick = (lessonNumber: number) => {
    if (onNavigate) {
      onNavigate(chapterId, lessonNumber);
    } else {
      // 回退：使用 hash 导航
      window.location.hash = `${chapterId}-${lessonNumber}`;
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-8 pt-6 border-t"
      style={{ borderColor: '#2a2a4a' }}
    >
      {/* 上一课按钮 */}
      {prevLesson ? (
        <button
          onClick={() => handleClick(prevLesson.lessonNumber)}
          className="group flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/10 active:scale-[0.98] w-full sm:w-auto text-left"
          style={{ borderColor: '#2a2a4a' }}
        >
          <span
            className="text-lg transition-transform group-hover:-translate-x-1"
            style={{ color: '#3776AB' }}
          >
            ←
          </span>
          <div>
            <span className="text-xs block" style={{ color: '#a0a0b0' }}>
              上一课
            </span>
            <span
              className="text-sm font-medium block group-hover:underline"
              style={{ color: '#eaeaea' }}
            >
              {prevLesson.title}
            </span>
          </div>
        </button>
      ) : (
        // 无上一课时显示禁用状态
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg border opacity-40"
          style={{ borderColor: '#2a2a4a' }}
        >
          <span className="text-lg" style={{ color: '#666' }}>
            ←
          </span>
          <div>
            <span className="text-xs block" style={{ color: '#666' }}>
              上一课
            </span>
            <span className="text-sm font-medium block" style={{ color: '#666' }}>
              已是第一章
            </span>
          </div>
        </div>
      )}

      {/* 下一课按钮 */}
      {nextLesson ? (
        <button
          onClick={() => handleClick(nextLesson.lessonNumber)}
          className="group flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/10 active:scale-[0.98] w-full sm:w-auto sm:justify-end text-left"
          style={{ borderColor: '#2a2a4a' }}
        >
          <div className="text-right">
            <span className="text-xs block" style={{ color: '#a0a0b0' }}>
              下一课
            </span>
            <span
              className="text-sm font-medium block group-hover:underline"
              style={{ color: '#eaeaea' }}
            >
              {nextLesson.title}
            </span>
          </div>
          <span
            className="text-lg transition-transform group-hover:translate-x-1"
            style={{ color: '#3776AB' }}
          >
            →
          </span>
        </button>
      ) : (
        // 无下一课时显示禁用状态
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg border opacity-40"
          style={{ borderColor: '#2a2a4a' }}
        >
          <div className="text-right">
            <span className="text-xs block" style={{ color: '#666' }}>
              下一课
            </span>
            <span className="text-sm font-medium block" style={{ color: '#666' }}>
              已是最后一课
            </span>
          </div>
          <span className="text-lg" style={{ color: '#666' }}>
            →
          </span>
        </div>
      )}
    </div>
  );
}
